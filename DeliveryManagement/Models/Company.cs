using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography.X509Certificates;

namespace DeliveryManagement.Models
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        //[ForeignKey("UserId")]
        public string UserId { get; set; }
        //public User User { get; set; } = null!;

        // public List<> Stocks;
        // public List<> PickUpPoints;
        [ForeignKey("ProductId")]
        public virtual ICollection<Product> Products { get; set; }
        public virtual int ProductId { get; set; }
    }
}
