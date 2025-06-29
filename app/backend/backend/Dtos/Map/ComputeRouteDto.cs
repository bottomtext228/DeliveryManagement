
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Order
{
    public class ComputeRouteRequestDto
    {
        [Required(ErrorMessage = "Компания обязательна!")]
        public int CompanyId { get; set; }

        [Required(ErrorMessage = "ПВЗ обязателен!")]
        public int PickUpPointTownId { get; set; }
        [Required(ErrorMessage = "Выбор пути обязателен!")]
        public RouteChoice Choice { get; set; }
    }

    public class ComputeRouteResponseDto
    {
        public float ShippingPrice { get; set; }
        public float ShippingTime { get; set; }
        public List<string> Towns { get; set; } = [];
        public bool IsRoutesEqual { get; set; }
    }
}