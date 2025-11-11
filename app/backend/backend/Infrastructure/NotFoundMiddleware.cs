using Microsoft.AspNetCore.Mvc;

namespace backend.Infrastructure
{
    /// <summary>
    /// Handles default 404 status code
    /// </summary>
    /// <param name="next"></param>
    public class NotFoundMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            await _next(context);

            var response = context.Response;

            if (!response.HasStarted && response.StatusCode == StatusCodes.Status404NotFound)
            {
                response.ContentType = "application/problem+json";

                var problem = new ProblemDetails
                {
                    Status = StatusCodes.Status404NotFound,
                    Title = "Not Found",
                    Type = "https://httpstatuses.com/404",
                    Detail = "Ресурс не найден.",
                    Instance = context.Request.Path
                };
                await response.WriteAsJsonAsync(problem);
            }
        }
    }
}