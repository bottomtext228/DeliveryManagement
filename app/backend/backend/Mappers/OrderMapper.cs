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
                CompanyId = order.CompanyId,
                Items = order.Items.Select(e => e.ToOrderItemDto()).ToList(),
                Towns = [.. order.TownIds.Select(e => towns.Find(t => t.Id == e)!)],
                FinalPrice = order.FinalPrice,
                ShippingPrice = order.ShippingPrice,
                ShippingTime = order.ShippingTime,
                Status = order.Status,
                CreatedAt = order.CreatedAt
            };
        }

        public static OrderItemDto ToOrderItemDto(this OrderItem orderItem)
        {
            return new OrderItemDto
            {
                Product = orderItem.Product.ToProductDto(),
                ProductPrice = orderItem.ProductPrice,
                Quantity = orderItem.Quantity
            };

        }

    }
}