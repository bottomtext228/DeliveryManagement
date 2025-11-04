using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Order
{
    public class ProductOrderDto
    {
        public int ProductId { get; set; }
        [Range(1, 99, ErrorMessage = "Количество товара должно быть в диапозоне [1, 99].")]
        public int Quantity { get; set; }
    }
}