using backend.Dtos.Catalog;

namespace backend.Dtos.Order
{
    public class OrderItemDto
    {
        public ProductDto Product { get; set; }
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }
        public decimal FinalPrice => ProductPrice * Quantity;
    }
}