using DeliveryManagement.Models.Map;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace DeliveryManagement.ViewModels.Order
{
    public class IndexModel 
    {
        public List<Town> Towns { get; set; }

        public int?[,] Matrix;
    }
}
