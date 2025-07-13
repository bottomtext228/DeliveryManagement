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