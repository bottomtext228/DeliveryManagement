namespace backend.Models
{
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