using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public Order Order { get; set; }

        public int ProductId { get; set; }

        public Product Product { get; set; }

        [Precision(19, 4)]
        public decimal ProductPrice { get; set; }  // we must store product price at the moment of order creation

        public int Quantity { get; set; }

        public decimal FinalPrice => ProductPrice * Quantity;
    }
}