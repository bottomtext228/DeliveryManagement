
namespace backend.Dtos.Cart
{
    public class CartDto
    {
        public ICollection<CartItemDto> CartItems { get; set; } = [];
    }
}