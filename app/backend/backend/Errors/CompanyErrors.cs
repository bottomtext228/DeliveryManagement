namespace backend.Errors
{
    public static class CompanyErrors
    {
        private const string Prefix = "Company";

        public static Error NotFound(int companyId)
        {
            return Error.NotFound(Prefix, $"Комания с ID {companyId} не найдена.");
        }

        public static Error MissingSetup()
        {
            return Error.BadRequest(Prefix, "Компания должна указать склады и пункты выдачи заказов перед созданием продукта.");
        }
    }
}