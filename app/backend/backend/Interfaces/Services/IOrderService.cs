using backend.Dtos.Order;

namespace backend.Interfaces.Services
{
    public interface IOrderService
    {
        Task<Result<OrderDto>> CreateAsync(CreateOrderRequest model, string userId, CancellationToken cancellationToken = default);
        Task<Result<IEnumerable<OrderDto>>> GetAllAsync(string userId, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(int orderId, string user, CancellationToken cancellationToken = default);
    }
}