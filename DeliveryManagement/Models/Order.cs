
using DeliveryManagement.Models.Map;

namespace DeliveryManagement.Models
{
    public class Order
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }
        //public int StockId { get; set; }
        //public Stock Stock { get; set; }
        //public int PickUpPointId { get; set; }
        //public PickUpPoint PickUpPoint { get; set; }
        //public float FinalPrice { get; set; }

        public List<int> TownIds { get; set; }

    }
}









//public int ProductId { get; set; }

//public int UserId { get; set; }
//public User User { get; set; }

//public int StockId { get; set; }
//public int PickUpPointId {  get; set; }