using System.ComponentModel.DataAnnotations;
using backend.Models.Map;

namespace backend.Models
{
    public class Company
    {
        public int Id { get; set; }

        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public User User { get; set; } = null!;

        public ICollection<Product> Products { get; set; }

        public ICollection<Stock> Stocks { get; set; }

        public ICollection<PickUpPoint> PickUpPoints { get; set; }

        public bool ValidateSetup()
        {
            if (Stocks.Count == 0 || PickUpPoints.Count == 0)
            {
                return false;
            }

            return true;
        }
    }
}
