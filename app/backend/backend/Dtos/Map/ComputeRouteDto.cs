
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
        // Attributes support only compile time expressions, so we write "0", "1" manually.
        [EnumDataType(typeof(RouteChoice), ErrorMessage = "Тип пути может быть только \"0\" (быстрейший)  или \"1\" (дешевейший)")] 
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