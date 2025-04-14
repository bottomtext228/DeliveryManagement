using backend.Dtos.Catalog;
using backend.Models;
using backend.Services;

namespace backend.Mappers
{
    public static class ProductMapper
    {
        public static ProductDto ToProductDto(this Product product)
        {
            return new ProductDto { Id = product.Id, Name = product.Name, Price = product.Price, Image = FileService.GetPath(product.Image) };
        }

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
                Image = FileService.GetPath(product.Image),
            };
        }

     /*    public static Product? ToProduct(this EditProductDto productDto)
        {
            var product = new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Price = productDto.Price,
                Weight = productDto.Weight,
                Size = new Vector(productDto.SizeX, productDto.SizeY, productDto.SizeZ)
            };
            var Image = productDto.Image;
            if (Image != null)
            {

                if (Image.Length <= 0 || !(
                    Image.ContentType.Equals("image/png", StringComparison.OrdinalIgnoreCase) ||
                    Image.ContentType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase) ||
                    Image.ContentType.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase)))
                    return null;
                //Convert Image to byte and save to database

                byte[]? ImageBytes = null;
                using (var fs1 = Image.OpenReadStream())
                using (var ms1 = new MemoryStream())
                {
                    fs1.CopyTo(ms1);
                    ImageBytes = ms1.ToArray();
                }
                product.Image = ImageBytes;
            }

            return product;
        } */
    }
}