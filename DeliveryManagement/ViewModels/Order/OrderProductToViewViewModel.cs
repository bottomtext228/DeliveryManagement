using DeliveryManagement.Models;
using DeliveryManagement.Models.Map;

namespace DeliveryManagement.ViewModels.Order
{
    public class OrderProductToViewViewModel
    {
        public Product Product { get; set; }
        public List<Town> PickUpPointsTowns { get; set; }

        public bool IsFastest { get; set; }

    }
}
