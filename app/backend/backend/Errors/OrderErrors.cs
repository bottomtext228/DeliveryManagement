namespace backend.Errors
{
    public static class OrderErrors
    {
        private const string Prefix = "Order";
        public static Error MissingProducts(IEnumerable<int> productIds)
        {
            return Error.BadRequest(Prefix, $"Продукты со следующими ID не найдены: {string.Join(", ", productIds)}.");
        }

        public static Error CompanyMismatch()
        {
            return Error.BadRequest(Prefix, "Все продукты должны принадлежать одной компании.");
        }

        public static Error NotFound(int orderId)
        {
            return Error.NotFound(Prefix, $"Заказ с ID {orderId} не найден.");
        }
    }
}