namespace backend.Errors
{
    public class AccountErrors
    {
        private const string Prefix = "Account";

        public static Error NotFound(string userId)
        {
            return Error.NotFound(Prefix, $"User with ID {userId} not found.");
        }

        public static Error TakenEmail(string email)
        {
            return Error.Validation(Prefix, $"Email '{email}' is already taken.");
        }

        public static Error InvalidCredentials()
        {
            return Error.BadRequest(Prefix, "Invalid email or password");
        }

        public static Error MissingRefreshToken()
        {
            return Error.BadRequest(Prefix, "Missing refresh token");
        }

        public static Error ExpiredRefreshToken()
        {
            return Error.BadRequest(Prefix, "The refresh token has expired.");
        }

        public static Error NullCompanyName()
        {
            return Error.Validation(Prefix, "CompanyName can't be null with AsCompany = true");
        }

        public static Error NullCompanyDescription()
        {
            return Error.Validation(Prefix, "CompanyName can't be null with AsCompany = true");
        }

        public static Error TakenCompanyName(string name)
        {
            return Error.Validation(Prefix, $"Company name '{name}' is already taken.");
        }
    }
}