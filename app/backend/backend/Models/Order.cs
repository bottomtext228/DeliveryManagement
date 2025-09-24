
namespace backend.Models
{
    public class Order
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public int CompanyId { get; set; }
        
        public Company Company { get; set; } // we allow to order items only from one company at once

        public ICollection<OrderItem> Items { get; set; } = [];

        public float ShippingPrice { get; set; }

        public float FinalPrice { get; set; } // it's another field in case of sale system, etc.

        public int ShippingTime { get; set; }

        public List<int> TownIds { get; set; } = [];

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public float ProductPrice { get; set; }  // we must store product price at the moment of order creation

        public int Quantity { get; set; }

        public float FinalPrice => ProductPrice * Quantity;
    }

    public enum OrderStatus
    {
        Pending = 0,         // Order received but not yet processed
        Processing = 1,      // Order is being prepared/processed
        Shipped = 2,         // Order has been shipped
        Delivered = 3,       // Order delivered to the customer
        Cancelled = 4,       // Order was cancelled
        Returned = 5         // Order was returned by the customer
    }

}



//public int StockId { get; set; }
//public Stock Stock { get; set; }
//public int PickUpPointId { get; set; }
//public PickUpPoint PickUpPoint { get; set; }





//public int ProductId { get; set; }

//public int UserId { get; set; }
//public User User { get; set; }

//public int StockId { get; set; }
//public int PickUpPointId {  get; set; }