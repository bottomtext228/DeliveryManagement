namespace backend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public float Price { get; set; }

        public Vector Size { get; set; }

        public float Weight { get; set; }

        public string Image { get; set; } = string.Empty;

        public int CompanyId { get; set; }

        public Company Company { get; set; }
    }
}
