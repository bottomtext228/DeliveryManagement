using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class Product
    {
        public int Id { get; set; }

        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Precision(19, 4)]
        public decimal Price { get; set; }

        public Vector Size { get; set; }

        public float Weight { get; set; }

        public string Image { get; set; } = string.Empty;

        public int CompanyId { get; set; }

        public Company Company { get; set; }
    }
}
