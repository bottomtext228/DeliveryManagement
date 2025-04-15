using System.ComponentModel.DataAnnotations;


namespace backend.Dtos.Order
{
    public class CreateOrderDto
    {
        [Required(ErrorMessage = "Продукт обязателен!")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "ПВЗ обязателен!")]
        public int PickUpPointTownId { get; set; }
        [Required(ErrorMessage = "Выбор пути обязателен!")]
        public RouteChoice Choice { get; set; }

        [Range(1, 100, ErrorMessage = "Количество может быть от 1 до 100!")]
        [Required(ErrorMessage = "Количество может быть от 1 до 100!")]
        [Display(Name = "Количество")]

        public int Quantity { get; set; }

    }

    public enum RouteChoice
    {
        Cheapest,
        Fastest
    }

}