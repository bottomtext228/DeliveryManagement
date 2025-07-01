

using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace backend.Helpers
{
    /// <summary>
    /// Helper for returning a standardized ProblemDetails object from controllers.
    /// </summary>
    public static class ApiResponseHelper
    {
        /// <summary>
        /// Creates a standardized <see cref="ProblemDetails"/> object with optional extensions.
        /// </summary>
        /// <param name="httpContext">The current HTTP context.</param>
        /// <param name="statusCode">The HTTP status code to set.</param>
        /// <param name="title">A short, human-readable summary of the problem.</param>
        /// <param name="detail">A human-readable explanation specific to this occurrence of the problem.</param>
        /// <param name="type">An optional URI reference that identifies the problem type. If null, a default based on the status code is used.</param>
        /// <param name="extensions">Optional custom extensions to include in the problem response.</param>
        /// <returns>A fully populated <see cref="ProblemDetails"/> instance.</returns>
        private static ProblemDetails CreateProblemDetails(
            HttpContext httpContext,
            int statusCode,
            string title,
            string detail,
            string? type = null,
            IDictionary<string, object>? extensions = null)
        {
            var problem = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = detail,
                Type = type ?? $"https://httpstatuses.com/{statusCode}",
                Instance = httpContext?.Request?.Path
            };

            // Add default extension for trace ID
            problem.Extensions["traceId"] = Activity.Current?.Id ?? httpContext?.TraceIdentifier;

            // Add custom extensions if provided
            if (extensions != null)
            {
                foreach (var kvp in extensions)
                {
                    problem.Extensions[kvp.Key] = kvp.Value;
                }
            }

            return problem;
        }

        /// <summary>
        /// Returns a 400 Bad Request response with a standardized <see cref="ProblemDetails"/> payload.
        /// </summary>
        /// <param name="context">The current HTTP context.</param>
        /// <param name="detail">A human-readable explanation specific to this occurrence of the problem.</param>
        /// <param name="title">An optional short, human-readable summary of the problem. Defaults to "Bad Request".</param>
        /// <param name="extensions">Optional additional data to include in the response.</param>
        /// <returns>A <see cref="BadRequestObjectResult"/>.</returns>
        public static IActionResult BadRequest(HttpContext context, string detail, string? title = null, IDictionary<string, object>? extensions = null)
        {
            var problem = CreateProblemDetails(context, StatusCodes.Status400BadRequest, title ?? "Bad Request", detail, extensions: extensions);
            return new BadRequestObjectResult(problem)
            {
                ContentTypes = { "application/problem+json" }
            };
        }

        /// <summary>
        /// Returns a 404 Not Found response with a standardized <see cref="ProblemDetails"/> payload.
        /// </summary>
        /// <param name="context">The current HTTP context.</param>
        /// <param name="detail">A human-readable explanation specific to this occurrence of the problem.</param>
        /// <param name="title">An optional short, human-readable summary of the problem. Defaults to "Not Found".</param>
        /// <param name="extensions">Optional additional data to include in the response.</param>
        /// <returns>A <see cref="NotFoundObjectResult"/>.</returns>
        public static IActionResult NotFound(HttpContext context, string detail, string? title = null, IDictionary<string, object>? extensions = null)
        {
            var problem = CreateProblemDetails(context, StatusCodes.Status404NotFound, title ?? "Not Found", detail, extensions: extensions);
            return new NotFoundObjectResult(problem)
            {
                ContentTypes = { "application/problem+json" }
            };
        }

        /// <summary>
        /// Returns a 401 Unauthorized response with a standardized <see cref="ProblemDetails"/> payload.
        /// </summary>
        /// <param name="context">The current HTTP context.</param>
        /// <param name="detail">A human-readable explanation specific to this occurrence of the problem.</param>
        /// <param name="title">An optional short, human-readable summary of the problem. Defaults to "Unauthorized".</param>
        /// <param name="extensions">Optional additional data to include in the response.</param>
        /// <returns>An <see cref="UnauthorizedObjectResult"/>.</returns>
        public static IActionResult Unauthorized(HttpContext context, string detail, string? title = null, IDictionary<string, object>? extensions = null)
        {
            var problem = CreateProblemDetails(context, StatusCodes.Status401Unauthorized, title ?? "Unauthorized", detail, extensions: extensions);

            return new UnauthorizedObjectResult(problem)
            {
                ContentTypes = { "application/problem+json" }
            };
        }

        /// <summary>
        /// Returns a 500 Internal Server Error response with a standardized <see cref="ProblemDetails"/> payload.
        /// </summary>
        /// <param name="context">The current HTTP context.</param>
        /// <param name="detail">A human-readable explanation specific to this occurrence of the problem.</param>
        /// <param name="title">An optional short, human-readable summary of the problem. Defaults to "Internal Server Error".</param>
        /// <param name="extensions">Optional additional data to include in the response.</param>
        /// <returns>An <see cref="ObjectResult"/></returns>
        public static IActionResult InternalServerError(HttpContext context, string detail, string? title = null, IDictionary<string, object>? extensions = null)
        {
            var problem = CreateProblemDetails(context, StatusCodes.Status500InternalServerError, title ?? "Internal Server Error", detail, extensions: extensions);
            return new ObjectResult(problem)
            {
                StatusCode = StatusCodes.Status500InternalServerError,
                ContentTypes = { "application/problem+json" }
            };
        }

        /// <summary>
        /// Returns a 400 Bad Request response with a ValidationProblemDetails object.
        /// </summary>
        /// <param name="context">The current HTTP context.</param>
        /// <param name="errors">A dictionary of validation errors where the key is the field name and the value is an array of error messages.</param>
        /// <param name="title">An optional title for the validation error. Defaults to "Validation Failed".</param>
        /// <returns>A <see cref="BadRequestObjectResult"/> containing a ValidationProblemDetails object.</returns>
        public static IActionResult ValidationProblem(HttpContext context, Dictionary<string, string[]> errors, string? title = null)
        {
            var validationProblem = new ValidationProblemDetails(errors)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = title ?? "Validation Failed",
                Type = "https://httpstatuses.com/400",
                Instance = context?.Request?.Path
            };

            validationProblem.Extensions["traceId"] = Activity.Current?.Id ?? context.TraceIdentifier;

            return new BadRequestObjectResult(validationProblem)
            {
                ContentTypes = { "application/problem+json" }
            };
        }

        /// <summary>
        /// Returns a 400 Bad Request response with a ValidationProblemDetails object from a simplified dictionary.
        /// </summary>
        /// <param name="context">The current HTTP context.</param>
        /// <param name="errors">A dictionary of validation errors where the key is the field name and the value is a single error message.</param>
        /// <param name="title">An optional title for the validation error. Defaults to "Validation Failed".</param>
        /// <returns>A <see cref="BadRequestObjectResult"/> containing a ValidationProblemDetails object.</returns>
        public static IActionResult ValidationProblem(HttpContext context, Dictionary<string, string> errors, string? title = null)
        {
            var formattedErrors = errors.ToDictionary(
                kvp => kvp.Key,
                kvp => new[] { kvp.Value }
            );
            return ValidationProblem(context, formattedErrors, title);
        }

        /// <summary>
        /// Returns a 400 Bad Request response with a ValidationProblemDetails object for a single field error.
        /// </summary>
        /// <param name="context">The current HTTP context.</param>
        /// <param name="fieldName">The name of the field that failed validation.</param>
        /// <param name="errorMessage">The error message associated with the field.</param>
        /// <param name="title">An optional title for the validation error. Defaults to "Validation Failed".</param>
        /// <returns>A <see cref="BadRequestObjectResult"/> containing a ValidationProblemDetails object.</returns>
        public static IActionResult ValidationProblem(HttpContext context, string fieldName, string errorMessage, string? title = null)
        {
            return ValidationProblem(context, new Dictionary<string, string[]>
            {
                [fieldName] = [errorMessage]
            }, title);
        }

    }

}