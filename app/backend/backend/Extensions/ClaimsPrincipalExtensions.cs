using System.Security.Claims;

namespace backend.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static int? GetCompanyId(this ClaimsPrincipal user)
        {
            var companyIdStr = user.FindFirstValue("CompanyId");
            return int.TryParse(companyIdStr, out var id) ? id : null;
        }

        public static string? GetUserId(this ClaimsPrincipal user)
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            return userId;
        }
    }
}