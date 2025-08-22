
namespace backend.Infrastructure
{
    public class TaskCancellationHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TaskCancellationHandlingMiddleware> _logger;
        public TaskCancellationHandlingMiddleware(RequestDelegate next, ILogger<TaskCancellationHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Request was cancelled: {Path}", context.Request.Path);
                context.Response.StatusCode = StatusCodes.Status499ClientClosedRequest;         
            }
        }
    }
}