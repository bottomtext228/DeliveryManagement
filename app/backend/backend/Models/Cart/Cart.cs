namespace backend.Models.Cart
{
    public class Cart
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;

        public ICollection<CartItem> CartItems { get; set; } = [];

    }
}