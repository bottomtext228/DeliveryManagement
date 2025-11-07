
using Microsoft.EntityFrameworkCore;

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

        [Precision(19, 4)]
        public decimal ShippingPrice { get; set; }

        [Precision(19, 4)]
        public decimal FinalPrice { get; set; } // it's another field in case of sale system, etc.

        public int ShippingTime { get; set; }

        public List<int> TownIds { get; set; } = [];

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}