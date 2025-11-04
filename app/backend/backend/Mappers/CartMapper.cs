using backend.Dtos.Cart;
using backend.Models.Cart;

namespace backend.Mappers
{
    public static class CartMapper
    {
        public static CartDto ToCartDto(this Cart cart)
        {
            return new CartDto
            {
                CartItems = [.. cart.CartItems.Select(e => e.ToCartItemDto())]
            };
        }

        public static CartItemDto ToCartItemDto(this CartItem cartItem)
        {
            return new CartItemDto
            {
                ProductId = cartItem.ProductId,
                Quantity = cartItem.Quantity
            };
        }
    }
}