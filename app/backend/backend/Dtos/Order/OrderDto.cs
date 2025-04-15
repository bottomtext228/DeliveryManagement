namespace backend.Dtos.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public List<int> TownIds { get; set; }
        public float ProductPrice { get; set; }

        public float ShippingPrice { get; set; }
        public float FinalPrice { get; set; }
        public int Time { get; set; }
        public int Quantity { get; set; }
    }
}