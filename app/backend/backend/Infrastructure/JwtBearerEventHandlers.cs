using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Infrastructure
{
    /// <summary>
    /// Handles JwtBearerEvents to return a proper ProblemDetails result in 401, 403 status codes.
    /// </summary>
    public static class JwtBearerEventHandlers
    {
        /// <summary>
        /// Handles 401 status code when authorization failes.
        /// </summary>
        /// <param name="context"></param>
        /// <returns>Problem details and WWW-Authenticate header with additional information</returns>
        public static Task HandleOnChallenge(JwtBearerChallengeContext context)
        {
            context.HandleResponse(); // Stop default behavior

            // set proper wwwAuthenticate header
            string wwwAuthenticate = "Bearer";
            var failure = context.AuthenticateFailure;
            if (failure is SecurityTokenExpiredException expired)
            {
                wwwAuthenticate = $"Bearer error=\"invalid_token\", error_description=\"The token expired at '{expired.Expires}'\"";
            }
            else if (failure is SecurityTokenInvalidSignatureException)
            {
                wwwAuthenticate = "Bearer error=\"invalid_token\", error_description=\"The token signature is invalid\"";
            }
            else if (failure is SecurityTokenException)
            {
                wwwAuthenticate = $"Bearer error=\"invalid_token\", error_description=\"{failure.Message}\"";
            }
            context.Response.Headers.WWWAuthenticate = wwwAuthenticate;

            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/problem+json";

            var problem = new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Unauthorized",
                Detail = "Authentication is required to access this resource.",
                Type = "https://httpstatuses.com/401",
                Instance = context.Request.Path
            };

            return context.Response.WriteAsJsonAsync(problem);
        }

        /// <summary>
        /// Handles 403 status code when authorization failes due to lack of permission.
        /// </summary>
        /// <param name="context"></param>
        /// <returns>Problem details</returns>
        public static Task HandleOnForbidden(ForbiddenContext context)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/problem+json";

            var problem = new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Forbidden",
                Type = "https://httpstatuses.com/403",
                Detail = "You are authenticated but do not have permission to access this resource.",
                Instance = context.Request.Path
            };

            return context.Response.WriteAsJsonAsync(problem);
        }
    }

}