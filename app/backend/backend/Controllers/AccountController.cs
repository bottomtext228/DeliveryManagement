
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using backend.Models;
using backend.Dtos;
using backend.Dtos.Account;
using backend.Services;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using backend.Dtos.Company;
using backend.Mappers;

namespace backend.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ApplicationDbContext dbContext, TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
            _tokenService = tokenService;
        }


        [HttpPost("register")]
        [Consumes("application/json")]
        [ProducesResponseType<NewLoginDto>(StatusCodes.Status200OK)]
        [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                if (dto.AsCompany)
                {
                    if (string.IsNullOrEmpty(dto.CompanyName)) return Problem("CompanyName can't be null with AsCompany = true", statusCode: StatusCodes.Status400BadRequest);
                    if (string.IsNullOrEmpty(dto.CompanyDescription)) return Problem("CompanyDescription can't be null with AsCompany = true", statusCode: StatusCodes.Status400BadRequest);


                    bool exists = await _dbContext.Companies.AnyAsync(c => c.Name.Equals(dto.CompanyName));
                    if (exists)
                    {
                        var errors = new Dictionary<string, string[]>
                        {
                            { "CompanyName", new[] { $"Имя компании '{dto.CompanyName}' уже занято." } }
                        };
                        return ValidationProblem(new ValidationProblemDetails(errors)
                        {
                            Title = "Invalid input",
                            Detail = "One or more validation errors occurred.",
                            Status = StatusCodes.Status400BadRequest
                        });
                    }
                }

                User user = new User { Email = dto.Email, UserName = dto.Email };


                var result = await _userManager.CreateAsync(user, dto.Password);
                if (result.Succeeded)
                {

                    await _userManager.AddToRoleAsync(user, dto.AsCompany ? "company" : "client");


                    Company? company = null;
                    if (dto.AsCompany)
                    {
                        var _user = await _userManager.FindByEmailAsync(dto.Email);
                        if (_user != null)
                        {
                            company = new Company { Name = dto.CompanyName!, Description = dto.CompanyDescription!, UserId = _user.Id };
                            await _dbContext.Companies.AddAsync(company);
                            await _dbContext.SaveChangesAsync();
                        }
                    }

                    var roles = await _userManager.GetRolesAsync(user);


                    var refreshToken = _tokenService.CreateRefreshToken(user);
                    await _dbContext.RefreshTokens.AddAsync(refreshToken);
                    await _dbContext.SaveChangesAsync();

                    Response.SetRefreshToken(refreshToken);

                    return Ok(new NewLoginDto
                    {
                        User = new UserDto { Email = user.Email, Roles = roles.ToList(), Company = company?.ToCompanyDto() },
                        Token = _tokenService.CreateToken(user, roles, company?.Id)
                    });
                }
                else
                {
                    return ValidationProblem(ValidationHelper.CreateValidationProblemDetails(result));
                }
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }


        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> Profile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

            var user = await _userManager.FindByIdAsync(userId);

            var roles = await _userManager.GetRolesAsync(user);


            if (User.IsInRole("company"))
            {
                var company = await _dbContext.Companies.FirstOrDefaultAsync(e => e.UserId == userId);
                return Ok(new UserDto
                { Email = userEmail, Roles = roles.ToList(), Company = company?.ToCompanyDto() });
            }
            else
            {
                return Ok(new UserDto { Email = userEmail, Roles = roles.ToList() });
            }
        }


        [HttpPost("login")]
        [Consumes("application/json")]
        [ProducesResponseType<NewLoginDto>(StatusCodes.Status200OK)]
        [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
                if (user == null) return Unauthorized();

                var roles = await _userManager.GetRolesAsync(user);

                var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);

                if (result.Succeeded)
                {
                    var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.UserId == user.Id);

                    // create refresh token and save it
                    var refreshToken = _tokenService.CreateRefreshToken(user);
                    await _dbContext.RefreshTokens.AddAsync(refreshToken);
                    await _dbContext.SaveChangesAsync();

                    Response.SetRefreshToken(refreshToken);

                    return Ok(new NewLoginDto
                    {
                        User = new UserDto
                        {
                            Email = user.Email,
                            Roles = roles.ToList(),
                            Company = company?.ToCompanyDto()
                        },
                        Token = _tokenService.CreateToken(user, roles, company?.Id)
                    });
                }
                else
                {
                    return Problem(result.ToString(), statusCode: StatusCodes.Status401Unauthorized);
                }
            }
            catch (Exception)
            {
                return StatusCode(500);
            }

        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken)) return Unauthorized();

            // check refresh token
            var storedRefreshToken = await _dbContext.RefreshTokens.Include(e => e.User).FirstOrDefaultAsync(e => e.Token == refreshToken);
            if (storedRefreshToken == null || storedRefreshToken.ExpiresOn < DateTime.UtcNow)
            {
                return Unauthorized("The refresh token has expired.");
            }

            // get user
            var user = storedRefreshToken.User;

            // create access token
            var roles = await _userManager.GetRolesAsync(user);
            var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.UserId == user.Id);
            string accessToken = _tokenService.CreateToken(user, roles, company?.Id);

            // update refrsh token
            var newRefreshToken = _tokenService.CreateRefreshToken(user);
            storedRefreshToken.Token = newRefreshToken.Token;
            storedRefreshToken.ExpiresOn = newRefreshToken.ExpiresOn;

            await _dbContext.SaveChangesAsync();

            Response.SetRefreshToken(storedRefreshToken);

            return Ok(new RefreshTokenResponseDto { Token = accessToken });

        }

        // TODO: implement revoke tokens endpoint?

        /// <summary>
        /// Checks if provided email is not used by another account.
        /// </summary>
        /// <remarks>
        /// If email is not used than `available` is true and `message` is null. Otherwise `available` is false and `messsage` is not null.
        /// 
        /// 
        /// Response example:
        /// ```
        /// GET api/account/check_credentials?email=test@mail.com
        /// {
        ///     available: false,
        ///     message: "Имя пользователя 'test@mail.com' уже занято."
        /// }
        /// ``` 
        /// </remarks>
        /// <param name="email"></param>
        /// <response code="200">Returns the result of the check.</response>
        /// <response code="400">If email is not provided</response> 
        [HttpGet("check_credentials")]
        [ProducesResponseType<AvailabilityResponse>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public async Task<IActionResult> CheckIfEmailIsNotUsed([FromQuery] string email)
        {
            var exists = await _userManager.Users.AnyAsync(u => u.Email == email);
            return Ok(new AvailabilityResponse { Available = !exists, Message = exists ? $"Имя пользователя '{email}' уже занято." : null });
        }

        public class AvailabilityResponse
        {
            public bool Available { get; set; }
            public string? Message { get; set; }
        }
    }
}
