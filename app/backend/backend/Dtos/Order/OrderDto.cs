using backend.Dtos.Catalog;
using backend.Models;
using backend.Models.Map;

namespace backend.Dtos.Order
{
    public class OrderDto
    {
        public int Id { get; set; }

        public ProductDto Product { get; set; }

        public List<Town> Towns { get; set; }
        public float ProductPrice { get; set; }

        public float ShippingPrice { get; set; }
        public float FinalPrice { get; set; }
        public int ShippingTime { get; set; }
        public int Quantity { get; set; }

        public OrderStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}