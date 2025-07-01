

using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace backend.Helpers
{

    public static class ApiResponseHelper
    {
        public static ProblemDetails CreateProblemDetails(
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

        public static IActionResult BadRequest(HttpContext context, string detail, string? title = null, IDictionary<string, object>? extensions = null)
        {
            var problem = CreateProblemDetails(context, StatusCodes.Status400BadRequest, title ?? "Bad Request", detail, extensions: extensions);
            return new BadRequestObjectResult(problem)
            {
                ContentTypes = { "application/problem+json" }
            };
        }

        public static IActionResult NotFound(HttpContext context, string detail, string? title = null, IDictionary<string, object>? extensions = null)
        {
            var problem = CreateProblemDetails(context, StatusCodes.Status404NotFound, title ?? "Not Found", detail, extensions: extensions);
            return new NotFoundObjectResult(problem)
            {
                ContentTypes = { "application/problem+json" }
            };
        }

        public static IActionResult Unauthorized(HttpContext context, string detail, string? title = null, IDictionary<string, object>? extensions = null)
        {
            var problem = CreateProblemDetails(
                context,
                StatusCodes.Status401Unauthorized,
                title ?? "Unauthorized",
                detail,
                extensions: extensions);

            return new ObjectResult(problem)
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                ContentTypes = { "application/problem+json" }
            };
        }

        public static IActionResult InternalServerError(HttpContext context, string detail, string? title = null, IDictionary<string, object>? extensions = null)
        {
            var problem = CreateProblemDetails(context, StatusCodes.Status500InternalServerError, title ?? "Internal Server Error", detail, extensions: extensions);
            return new ObjectResult(problem)
            {
                StatusCode = StatusCodes.Status500InternalServerError,
                ContentTypes = { "application/problem+json" }
            };
        }
        
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

        public static IActionResult ValidationProblem(HttpContext context, Dictionary<string, string> errors, string? title = null)
        {
            var formattedErrors = errors.ToDictionary(
                kvp => kvp.Key,
                kvp => new[] { kvp.Value }
            );
            return ValidationProblem(context, formattedErrors, title);
        }

        public static IActionResult ValidationProblem(HttpContext context, Tuple<string, string> error, string? title = null)
        {
            return ValidationProblem(context, new Dictionary<string, string[]>
            {
                [error.Item1] = [error.Item2]
            }, title);
        }
    }

}