using backend.Dtos.Catalog;
using backend.Dtos.Common;

namespace backend.Interfaces.Services
{
    public interface IProductService
    {
        Task<Result<PaginatedResponseDto<ProductDto>>> GetAllAsync(int? companyId, ProductQueryDto query, CancellationToken cancellationToken = default);
        Task<Result<ProductDetailDto>> GetByIdAsync(int productId, int? companyId, CancellationToken cancellationToken = default);
        Task<Result<ProductDetailDto>> CreateAsync(CreateProductDto model, int companyId, CancellationToken cancellationToken = default);
        Task<Result> EditAsync(int productId, EditProductDto model, int companyId, CancellationToken cancellationToken = default);
        Task<Result> DeleteAsync(int productId, int companyId, CancellationToken cancellationToken = default);
    }
}