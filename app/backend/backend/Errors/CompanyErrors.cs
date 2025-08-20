namespace backend.Errors
{
    public static class CompanyErrors
    {
        private const string Prefix = "Company";

        public static Error NotFound(int companyId)
        {
            return Error.NotFound(Prefix, $"Company with ID {companyId} not found.");
        }

        public static Error MissingSetup()
        {
            return Error.BadRequest(Prefix, "The company must set stocks and pick up points before creating a product.");
        }
    }
}