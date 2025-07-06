
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
using backend.Mappers;
using backend.Extensions;
using Microsoft.AspNetCore.Authentication;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing accounts
    /// </summary>
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

        /// <summary>
        /// Registers a new user as either a client or a company. Sets a refresh token to Cookie.
        /// </summary>
        /// <param name="model">Registration details including email, password, and optional company info.</param>
        /// <returns>Returns the newly created user details along with an access token.</returns>
        /// <response code="200">User successfully registered.</response>
        /// <response code="400">Validation error.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost("register")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(NewLoginDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (model.AsCompany)
            {
                {
                    var errors = new Dictionary<string, string>();

                    if (string.IsNullOrEmpty(model.CompanyName))
                        errors.Add(nameof(model.CompanyName), "CompanyName can't be null with AsCompany = true");

                    if (string.IsNullOrEmpty(model.CompanyDescription))
                        errors.Add(nameof(model.CompanyDescription), "CompanyDescription can't be null with AsCompany = true");

                    if (errors.Count != 0)
                        return ApiResponseHelper.ValidationProblem(HttpContext, errors);
                }

                bool exists = await _dbContext.Companies.AnyAsync(c => c.Name.Equals(model.CompanyName));
                if (exists)
                {
                    return ApiResponseHelper.ValidationProblem(HttpContext, "CompanyName", $"Имя компании \"{model.CompanyName}\" уже занято.");
                }
            }

            User user = new User { Email = model.Email, UserName = model.Email };


            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {

                await _userManager.AddToRoleAsync(user, model.AsCompany ? "company" : "client");


                Company? company = null;
                if (model.AsCompany)
                {
                    company = new Company { Name = model.CompanyName!, Description = model.CompanyDescription!, UserId = user.Id };
                    await _dbContext.Companies.AddAsync(company);
                }

                var roles = await _userManager.GetRolesAsync(user);

                // issue new token and save changes
                await _tokenService.IssueRefreshTokenAsync(user, Response);
                await _dbContext.SaveChangesAsync();

                return Ok(new NewLoginDto
                {
                    User = new UserDto { Email = user.Email, Roles = roles.ToList(), Company = company?.ToCompanyDto() },
                    Token = _tokenService.CreateToken(user, roles, company?.Id)
                });
            }
            else
            {
                return ApiResponseHelper.ValidationProblem(HttpContext, ValidationHelper.CreateValidationProblemDetails(result));
            }

        }

        /// <summary>
        /// Gets the profile of the currently authenticated user.
        /// </summary>
        /// <returns>The user's email, roles, and company info if applicable.</returns>
        /// <response code="200">Returns the user profile.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("profile")]
        [Authorize]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Profile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var userEmail = User.FindFirstValue(ClaimTypes.Email)!;

            var user = (await _userManager.FindByIdAsync(userId))!;

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

        /// <summary>
        /// Authenticates a user and returns an access token with user details. Sets a refresh token to Cookie.
        /// </summary>
        /// <param name="model">Login credentials containing email and password.</param>
        /// <returns>User details and JWT token if login is successful.</returns>
        /// <response code="200">Login successful.</response>
        /// <response code="400">Validation error.</response>
        /// <response code="401">Invalid email or password.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost("login")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(NewLoginDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (user == null) return ApiResponseHelper.Unauthorized(HttpContext, "Invalid email or password");

            var roles = await _userManager.GetRolesAsync(user);

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (result.Succeeded)
            {
                var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.UserId == user.Id);


                await _tokenService.IssueRefreshTokenAsync(user, Response);
                await _dbContext.SaveChangesAsync();

                return Ok(new NewLoginDto
                {
                    User = new UserDto
                    {
                        Email = user.Email!,
                        Roles = roles.ToList(),
                        Company = company?.ToCompanyDto()
                    },
                    Token = _tokenService.CreateToken(user, roles, company?.Id)
                });
            }
            else
            {
                return ApiResponseHelper.Unauthorized(HttpContext, "Invalid email or password");
            }
        }


        /// <summary>
        /// Refreshes the JWT access token using a valid refresh token cookie.
        /// </summary>
        /// <returns>New access token if refresh token is valid.</returns>
        /// <response code="200">Access token refreshed.</response>
        /// <response code="401">Missing or invalid refresh token.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost("refresh")]
        [ProducesResponseType(typeof(RefreshTokenResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken)) return ApiResponseHelper.Unauthorized(HttpContext, "Missing refresh token");

            // check refresh token
            var storedRefreshToken = await _dbContext.RefreshTokens.Include(e => e.User).FirstOrDefaultAsync(e => e.Token == refreshToken);
            if (storedRefreshToken == null || storedRefreshToken.ExpiresOn < DateTime.UtcNow)
            {
                return ApiResponseHelper.Unauthorized(HttpContext, "The refresh token has expired.");
            }

            // get user
            var user = storedRefreshToken.User;

            // create access token
            var roles = await _userManager.GetRolesAsync(user);
            var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.UserId == user.Id);
            string accessToken = _tokenService.CreateToken(user, roles, company?.Id);

            // update refresh token
            await _tokenService.RotateRefreshTokenAsync(storedRefreshToken, user, Response);
            await _dbContext.SaveChangesAsync();

            return Ok(new RefreshTokenResponseDto { Token = accessToken });

        }

        /// <summary>
        /// Logs out the current user by revoking their refresh token and clearing the authentication cookie.
        /// </summary>
        /// <returns>200 OK.</returns>
        /// <response code="200">User logged out successfully</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(refreshToken))
            {
                return ApiResponseHelper.BadRequest(HttpContext, "Missing refresh token.");
            }

            // find and delete refresh token
            await _tokenService.RevokeRefreshTokenAsync(refreshToken, Response);
            return Ok();
        }

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
        /// <response code="500">Internal server error.</response>
        [HttpGet("check_credentials")]
        [ProducesResponseType(typeof(AvailabilityResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
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
