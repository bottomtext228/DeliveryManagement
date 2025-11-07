using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Order
{
    public class ProductOrderDto
    {
        public int ProductId { get; set; }
        [Range(1, 99, ErrorMessage = "{0} должно быть в диапазоне от {1} до {2}.")]
        [Display(Name = "Количество")]
        public int Quantity { get; set; }
    }
}