using backend.Dtos.Stock;

namespace backend.Interfaces.Services
{
    public interface IStockService
    {
        Task<Result<IEnumerable<GetStocksDto>>> GetAllAsync(int companyId, CancellationToken cancellationToken = default);
        Task<Result> SetAsync(List<int> townIds, int companyId, CancellationToken cancellationToken = default);
    }
}