namespace backend.Errors
{
    public static class ProductErrors
    {
        private const string Prefix = "Product";
        public static Error NotFound(int productId)
        {
            return Error.NotFound(Prefix, $"Продукт с ID {productId} не найден.");
        }
    }
}