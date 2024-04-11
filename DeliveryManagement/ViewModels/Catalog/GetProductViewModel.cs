using DeliveryManagement.Attributes;
using System.ComponentModel.DataAnnotations;

namespace DeliveryManagement.ViewModels.Catalog
{
    public class GetProductViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public float Weight { get; set; }
        public float SizeX { get; set; }
        public float SizeY { get; set; }
        public float SizeZ { get; set; }
        public string ImageBase64 { get; set; }
    }
}
