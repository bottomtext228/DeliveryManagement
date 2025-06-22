
using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Order
{
    public class PreviewOrderRequestDto
    {
        [Required(ErrorMessage = "Продукт обязателен!")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "ПВЗ обязателен!")]
        public int PickUpPointTownId { get; set; }
        [Required(ErrorMessage = "Выбор пути обязателен!")]
        public RouteChoice Choice { get; set; }
    }

    public class PreviewOrderResponseDto
    {
        public float ShippingPrice { get; set; }
        public float ShippingTime { get; set; }
        public List<string> Towns { get; set; } = [];
        public bool IsRoutesEqual { get; set; }
    }
}