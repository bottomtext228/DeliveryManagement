using backend.Dtos.Catalog;
using backend.Models;

namespace backend.Mappers
{
    public static class ProductMapper
    {
        // need to .Include() Company entity!
        public static ProductDto ToProductDto(this Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Image = product.Image,
                CompanyName = product.Company.Name
            };
        }

        // need to .Include() Company entity!
        public static ProductDetailDto ToProductDetailDto(this Product product)
        {
            return new ProductDetailDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Weight = product.Weight,
                Size = product.Size,
                Image = product.Image,
                CompanyId = product.CompanyId,
                CompanyName = product.Company.Name
            };
        }
    }
}