using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Cart
{
    public class CartItemDto
    {
        public int ProductId { get; set; }
        [Range(0, 99, ErrorMessage = "Количество товара должно быть в диапозоне [0, 99].")]
        public int Quantity { get; set; }
    }
}