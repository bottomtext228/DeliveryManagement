using DeliveryManagement.Models;

namespace DeliveryManagement.ViewModels.Order
{
    public class AllViewModel
    {
        public List<OneOrderViewModel> Orders = new();
    }
    public class OneOrderViewModel
    {
        public List<string> TownsNames { get; set; }

        public Product Product;
        public int OrderId { get; set; }
    }
}
