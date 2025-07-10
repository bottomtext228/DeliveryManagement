using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using backend.Dtos.Common;

namespace backend.Dtos.Catalog
{
    public class ProductQueryDto : QueryDto
    {
        // filters
        public string? Name { get; set; }
        public int? MinPrice { get; set; }
        public int? MaxPrice { get; set; }

        // sorting
       /*  [EnumDataType(typeof(ProductSortBy), ErrorMessage = "Сортировка может быть только по \"ID\", названию (\"name\"), цене (\"price\")!")] */
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