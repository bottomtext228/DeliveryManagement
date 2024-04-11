namespace DeliveryManagement.ViewModels.Catalog
{
    public class AllProductViewModel
    {

        public List<ProductSmallViewModel> Products { get; set; } = new List<ProductSmallViewModel>();

        public bool IsCompany { get; set; }

    }
    public class ProductSmallViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public string ImageBase64 { get; set; }
    }
}
