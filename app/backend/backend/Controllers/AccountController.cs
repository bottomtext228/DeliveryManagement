
using Microsoft.AspNetCore.Mvc;
using backend.Dtos;
using backend.Dtos.Account;
using backend.Helpers;
using Microsoft.AspNetCore.Authorization;
using backend.Interfaces.Services;
using backend.Extensions;
using backend.Results;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing accounts
    /// </summary>
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
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
        [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] RegisterDto model, CancellationToken cancellationToken = default)
        {
            var result = await _accountService.RegisterAsync(model, cancellationToken);

            return result.Map(
                onSuccess: loginData =>
                {
                    Response.SetRefreshToken(loginData.RefreshToken);
                    return Ok(new LoginResponseDto { User = loginData.User, Token = loginData.Token });
                },
                onFailure: error =>
                {
                    if (result.Error is ValidationError validationError)
                    {
                        return ApiResponseHelper.ValidationProblem(HttpContext, validationError);
                    }

                    return ApiResponseHelper.BadRequest(HttpContext, result.Error!);
                }
            );
        }

        /// <summary>
        /// Gets the authenticated user's basic information (email, roles, and company info if applicable).
        /// </summary>
        /// <returns>The user's identity information.</returns>
        /// <response code="200">Returns the user's identity information.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetMe(CancellationToken cancellationToken = default)
        {
            var userId = User.GetUserId()!;
            var companyId = User.GetCompanyId();

            var result = await _accountService.GetMeAsync(userId, companyId/* , cancellationToken */);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.NotFound(HttpContext, error)
            );
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
        [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto model, CancellationToken cancellationToken = default)
        {
            var result = await _accountService.LoginAsync(model/* , cancellationToken */);

            if (result.IsSuccess)
            {
                var loginData = result.Value!;
                Response.SetRefreshToken(loginData.RefreshToken);
                return Ok(new LoginResponseDto { User = loginData.User, Token = loginData.Token });
            }

            return ApiResponseHelper.BadRequest(HttpContext, result.Error!);
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

            var result = await _accountService.RefreshTokenAsync(refreshToken);

            if (result.IsSuccess)
            {
                var tokenInfo = result.Value!;

                Response.SetRefreshToken(tokenInfo.RefreshToken);

                return Ok(new RefreshTokenResponseDto { Token = tokenInfo.Token });
            }

            return ApiResponseHelper.BadRequest(HttpContext, result.Error!);
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

            var result = await _accountService.LogoutAsync(refreshToken);

            if (result.IsSuccess)
            {
                Response.ClearRefreshToken();
                return Ok();
            }

            return ApiResponseHelper.BadRequest(HttpContext, result.Error!);
        }

        /// <summary>
        /// Gets profile of the currently authenticated user.
        /// </summary>
        /// <returns>Returns user's complete profile.</returns>
        /// <response code="200">Profile info.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("profile")]
        [Authorize]
        [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Profile()
        {
           var userId = User.GetUserId()!;

            var result = await _accountService.GetProfileAsync(userId);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
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
        [ProducesResponseType(typeof(EmailAvailabilityDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CheckIfEmailIsNotUsed([FromQuery] string email)
        {
            var availability = await _accountService.IsEmailAvailableAsync(email);

            return Ok(availability);
        }
    }
}
