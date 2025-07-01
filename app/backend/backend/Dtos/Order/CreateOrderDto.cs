using System.ComponentModel.DataAnnotations;


namespace backend.Dtos.Order
{
    public class CreateOrderDto
    {
        [Required(ErrorMessage = "Продукты обязательны!")]
        public List<ProductOrderDto> Products { get; set; } = [];

        [Required(ErrorMessage = "ПВЗ обязателен!")]
        public int PickUpPointTownId { get; set; }
        [Required(ErrorMessage = "Выбор пути обязателен!")]
        // Attributes support only compile time expressions, so we write "0", "1" manually.
        [EnumDataType(typeof(RouteChoice), ErrorMessage = "Тип пути может быть только \"0\" (быстрейший)  или \"1\" (дешевейший)")]
        public RouteChoice Choice { get; set; }
    }

    public class ProductOrderDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
    public enum RouteChoice
    {
        Fastest = 0,
        Cheapest = 1
    }

}