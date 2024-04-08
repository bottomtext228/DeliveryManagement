namespace DeliveryManagement.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }
        public User User {get; set; }

        // public List<> Stocks;
        // public List<> PickUpPoints;

        // public List<> Products
    }
}
