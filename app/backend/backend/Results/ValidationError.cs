using Microsoft.AspNetCore.Identity;

namespace backend.Results
{
    public class ValidationError : Error
    {
        public IDictionary<string, string> Errors { get; }
        public ValidationError(IDictionary<string, string> errors)
            : base("ValidationError", "One or more validation errors occurred.")
        {
            Errors = errors;
        }

        public ValidationError(string key, string message)
         : this(new Dictionary<string, string> { { key, message } })
        {
        }
        
        public static ValidationError FromIdentityErrors(IEnumerable<IdentityError> identityErrors)
        {
            var errors = identityErrors.ToDictionary(
                e => string.IsNullOrWhiteSpace(e.Code) ? "General" : e.Code,
                e => e.Description
            );

            return new ValidationError(errors);
        }
    }
}