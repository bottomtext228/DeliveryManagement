using Vector = DeliveryManagement.Models.Vector;

namespace DeliveryManagement.ViewModels.Catalog
{
    public class GetProductViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public float Weight { get; set; }
        public Vector Size { get; set; }
        public string ImageBase64 { get; set; }
        public bool IsCompany { get; set; }
    }
}
