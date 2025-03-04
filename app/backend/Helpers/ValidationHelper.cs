using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Helpers
{
    public static class ValidationHelper
    {
        public static ValidationProblemDetails CreateValidationProblemDetails(IdentityResult result)
        {

            var errorDictionary = new Dictionary<string, string[]>(1);

            foreach (var error in result.Errors)
            {
                errorDictionary[error.Code] = [error.Description];
            }

            return new ValidationProblemDetails { Errors = errorDictionary };
        }
    }
}