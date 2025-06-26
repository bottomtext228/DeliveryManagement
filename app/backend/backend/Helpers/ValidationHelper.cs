using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Helpers
{
    public static class ValidationHelper
    {
        public static Dictionary<string, string> CreateValidationProblemDetails(IdentityResult result)
        {
            var errors = new Dictionary<string, string>();

            foreach (var error in result.Errors)
            {
                // Identity errors don’t always have a field name, so use Code or "General" key as fallback
                var key = string.IsNullOrWhiteSpace(error.Code) ? "General" : error.Code;
                errors[key] = error.Description;
            }

            return errors;
        }
    }
}