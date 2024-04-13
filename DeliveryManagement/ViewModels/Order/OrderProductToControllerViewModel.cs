using DeliveryManagement.Models;
using DeliveryManagement.Models.Map;

namespace DeliveryManagement.ViewModels.Order
{
    public class OrderProductToControllerViewModel
    {
        public int ProductId { get; set; }
        //public int StockId { get; set; }
        //public int PickUpPointId { get; set; }

        public string PickUpPointTown { get; set; }
        public bool IsFastest { get; set; }

        //public List<Town> PickUpPointsTowns {  get; set; }


    }
}
