using backend.Dtos.Order;

namespace backend.Interfaces.Services
{
    public interface IOrderService
    {
        Task<Result<OrderDto>> CreateAsync(CreateOrderDto model, string userId);
        Task<Result<IEnumerable<OrderDto>>> GetAllAsync(string userId);
        Task<Result> DeleteAsync(int orderId, string user);
    }
}