using backend.Models.Map;

namespace backend.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        //[ForeignKey("UserId")]
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;

        // public List<> Stocks;
        // public List<> PickUpPoints;
        //[ForeignKey("ProductId")]
        public ICollection<Product> Products { get; set; }

        public ICollection<Stock> Stocks { get; set; }

        public ICollection<PickUpPoint> PickUpPoints { get; set;}
    }
}
