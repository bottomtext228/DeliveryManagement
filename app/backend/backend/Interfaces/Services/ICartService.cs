using backend.Dtos.Cart;

namespace backend.Interfaces.Services
{
    public interface ICartService
    {
        Task<Result<CartDto>> GetCartByUserIdAsync(string userId, CancellationToken cancellationToken = default);
        Task<Result<CartDto>> SetItemAsync(string userId, CartItemDto item, CancellationToken cancellationToken = default);
    }
}