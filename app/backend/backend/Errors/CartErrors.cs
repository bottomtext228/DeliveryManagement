namespace backend.Errors
{
    public class CartErrors
    {
        private const string Prefix = "Cart";

        public static Error NotFound(string userId)
        {
            return Error.NotFound(Prefix, $"Корзина для пользователя с ID {userId} не найдена.");
        }
    }
}