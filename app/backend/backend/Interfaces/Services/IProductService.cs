using backend.Dtos.Catalog;
using backend.Dtos.Common;

namespace backend.Interfaces.Services
{
    public interface IProductService
    {
        Task<Result<PaginatedResponseDto<ProductDto>>> GetAllAsync(int? companyId, ProductQueryDto query);
        Task<Result<ProductDetailDto>> GetByIdAsync(int productId, int? companyId);
        Task<Result<ProductDetailDto>> CreateAsync(CreateProductDto model, int companyId);
        Task<Result> EditAsync(int productId, EditProductDto model, int companyId);
        Task<Result> DeleteAsync(int productId, int companyId);
    }
}