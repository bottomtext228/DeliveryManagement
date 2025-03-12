
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


                    return Ok(new NewLoginDto
                    {
                        Email = user.Email,
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

            if (User.IsInRole("company"))
            {
                var company = await _dbContext.Companies.FirstOrDefaultAsync(e => e.UserId == userId);
                return Ok(new ProfileDto
                { CompanyName = company.Name, Email = userEmail, CompanyDescription = company.Description, IsCompany = true });
            }
            else
            {
                return Ok(new ProfileDto { Email = userEmail, IsCompany = false });
            }
        }

        [HttpPost("login")]
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
                    var company = _dbContext.Companies.FirstOrDefault(c => c.UserId == user.Id);
                    return Ok(new NewLoginDto
                    {
                        Email = user.Email!,
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

        /// <summary>
        /// Checks if provided email is not used by another account.
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        [HttpGet("check_credentials")]
        public async Task<IActionResult> CheckIfEmailIsNotUsed([FromQuery] string email)
        {
            var exists = await _userManager.Users.AnyAsync(u => u.Email == email);
            return Ok(new { available = !exists });
        }

    }
}
