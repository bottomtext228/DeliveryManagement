namespace backend.Dtos.Catalog
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public float Price { get; set; }
        public string Image { get; set; } = string.Empty;
    }
}