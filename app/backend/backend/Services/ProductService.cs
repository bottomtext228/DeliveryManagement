using backend.Dtos.Catalog;
using backend.Dtos.Common;
using backend.Errors;
using backend.Extensions;
using backend.Interfaces;
using backend.Interfaces.Services;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IFileService _fileService;
        public ProductService(ApplicationDbContext dbContext, IFileService fileService)
        {
            _dbContext = dbContext;
            _fileService = fileService;
        }
        public async Task<Result<PaginatedResponseDto<ProductDto>>> GetAllAsync(int? companyId, ProductQueryDto query)
        {
            IQueryable<Product> queryableProducts = _dbContext.Products;

            if (companyId != null)
            {
                queryableProducts = queryableProducts.Where(e => e.CompanyId == companyId);
            }

            queryableProducts = queryableProducts.ApplyFiltering(query).ApplySorting(query);

            var response = await queryableProducts.ToPaginationResponseAsync(query);
            return response;
        }

        public async Task<Result<ProductDetailDto>> GetByIdAsync(int productId, int? companyId)
        {
            var query = _dbContext.Products.AsQueryable();

            if (companyId != null) query = query.Where(e => e.CompanyId == companyId);


            var productDetail = await query
                .Include(e => e.Company)
                .Where(e => e.Id == productId)
                .Select(e => e.ToProductDetailDto())
                .FirstOrDefaultAsync();


            if (productDetail == null) return ProductErrors.NotFound(productId);

            return productDetail;
        }

        public async Task<Result<ProductDetailDto>> CreateAsync(CreateProductDto model, int companyId)
        {
            var company = await _dbContext.Companies
                       .Include(c => c.Stocks)
                       .Include(c => c.PickUpPoints)
                       .Include(c => c.Products)
                       .FirstOrDefaultAsync(e => e.Id == companyId);

            if (company == null) return CompanyErrors.NotFound(companyId);

            if (!company.ValidateSetup()) return CompanyErrors.MissingSetup();

            var fileName = await _fileService.SaveFileAsync(model.Image);

            var product = new Product
            {
                Name = model.Name,
                Description = model.Description,
                Size = new Vector(model.SizeX, model.SizeY, model.SizeZ),
                Weight = model.Weight,
                Price = model.Price,
                Image = fileName
            };

            company.Products.Add(product);
            await _dbContext.SaveChangesAsync();

            return product.ToProductDetailDto();
        }

        public async Task<Result> EditAsync(int productId, EditProductDto model, int companyId)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(e => e.Id == productId && e.CompanyId == companyId);
            if (product == null) return ProductErrors.NotFound(productId);

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.Weight = model.Weight;
            product.Size = new Vector(model.SizeX, model.SizeY, model.SizeZ);

            if (model.Image != null)
            {
                var fileName = await _fileService.SaveFileAsync(model.Image);
                product.Image = fileName;
            }

            await _dbContext.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result> DeleteAsync(int productId, int companyId)
        {
            var product = await _dbContext.Products.FirstOrDefaultAsync(e => e.Id == productId && e.CompanyId == companyId);
            if (product == null) return ProductErrors.NotFound(productId);


            _dbContext.Products.Remove(product);
            _fileService.DeleteFile(product.Image);
            await _dbContext.SaveChangesAsync();

            return Result.Success();
        }
    }
}