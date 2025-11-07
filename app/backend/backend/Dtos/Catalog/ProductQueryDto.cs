using System.ComponentModel.DataAnnotations;
using backend.Dtos.Common;

namespace backend.Dtos.Catalog
{
    public class ProductQueryDto : QueryDto
    {
        // filters
        [StringLength(200, ErrorMessage = "{0} должно иметь длину от {2} до {1} символов.")]
        [Display(Name = "Название")]
        public string? Name { get; set; }

        [Range(0, 1000000.0, ErrorMessage = "{0} должна быть в диапазоне от {1} до {2} рублей.")]
        [Display(Name = "Минимальная цена")]
        public decimal? MinPrice { get; set; }

        [Range(0, 1000000.0, ErrorMessage = "{0} должна быть в диапазоне от {1} до {2} рублей.")]
        [Display(Name = "Максимальная цена")]
        public decimal? MaxPrice { get; set; }

        // sorting
        public ProductSortBy SortBy { get; set; } = ProductSortBy.Id;
        public bool IsDescending { get; set; } = false;
    }
    public enum ProductSortBy
    {
        Id,
        Name,
        Price
    }
}