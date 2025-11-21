using System.Threading.RateLimiting;
using backend.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Infrastructure
{
    /// <summary>
    /// Handles 429 status code.
    /// </summary>
    public static class RateLimiterHandlers
    {
        public static async ValueTask OnRejected(OnRejectedContext context, CancellationToken cancellationToken)
        {
            if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
            {
                context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
            }
            
            context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.HttpContext.Response.ContentType = "application/problem+json";

            var problem = new ProblemDetails
            {
                Status = StatusCodes.Status429TooManyRequests,
                Title = "Too many requests",
                Type = "https://httpstatuses.com/429",
                Detail = "Слишком много запросов. Попробуйте позже.",
                Instance = context.HttpContext.Request.Path
            };

            await context.HttpContext.Response.WriteAsJsonAsync(problem, cancellationToken);
        }

        /// <summary>
        /// Rate limit policy applied to users individually.
        /// </summary>
        public static RateLimitPartition<string> PerUserPolicy(HttpContext httpContext)
        {
            string? userId = httpContext.User.GetUserId();

            if (!string.IsNullOrEmpty(userId))
            {
                // logged user
                return RateLimitPartition.GetTokenBucketLimiter(userId, _ => new TokenBucketRateLimiterOptions
                {
                    TokenLimit = 30,
                    TokensPerPeriod = 10,
                    ReplenishmentPeriod = TimeSpan.FromSeconds(5),
                    QueueLimit = 5,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                });
            }
            else
            {
                // anonymous user (identified by IP)
                var partitionKey = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

                return RateLimitPartition.GetFixedWindowLimiter(partitionKey,
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 10,
                    Window = TimeSpan.FromSeconds(30)
                });
            }
        }
    }
}