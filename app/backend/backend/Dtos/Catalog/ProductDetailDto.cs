using backend.Models;

namespace backend.Dtos.Catalog
{
    public class ProductDetailDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public float Price { get; set; }
        public float Weight { get; set; }
        public Vector Size { get; set; } = null!;
        public string Image { get; set; } = string.Empty;

        public int CompanyId { get; set; }
    }
}