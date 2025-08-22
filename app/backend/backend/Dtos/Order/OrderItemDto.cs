using backend.Dtos.Catalog;

namespace backend.Dtos.Order
{
    public class OrderItemDto
    {
        public ProductDto Product { get; set; }
        public float ProductPrice { get; set; }
        public int Quantity { get; set; }
        public float FinalPrice => ProductPrice * Quantity;
    }
}