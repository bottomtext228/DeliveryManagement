using backend.Dtos.Order;
using backend.Models;

namespace backend.Mappers
{
    public static class OrderMapper
    {
        public static OrderDto ToOrderDto(this Order order)
        {
            return new OrderDto { Id = order.Id, ProductId = order.ProductId, TownIds = order.TownIds, Quantity = order.Quantity,
            FinalPrice = order.FinalPrice };
        }
    }
}