using backend.Dtos.Order;
using backend.Models;
using backend.Models.Map;

namespace backend.Mappers
{
    public static class OrderMapper
    {
        public static OrderDto ToOrderDto(this Order order, List<Town> towns)
        {

            return new OrderDto
            {
                Id = order.Id,
                Product = order.Product.ToProductDto(),
                Towns = [.. order.TownIds.Select(e => towns.Find(t => t.Id == e)!)],
                ProductPrice = order.ProductPrice,
                ShippingPrice = order.ShippingPrice,
                Quantity = order.Quantity,
                FinalPrice = order.FinalPrice,
                ShippingTime = order.ShippingTime,
                Status = order.Status,
                CreatedAt = order.CreatedAt
            };
        }
    }
}