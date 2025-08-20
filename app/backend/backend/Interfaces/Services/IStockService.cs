using backend.Dtos.Stock;

namespace backend.Interfaces.Services
{
    public interface IStockService
    {
        Task<Result<IEnumerable<GetStocksDto>>> GetAll(int companyId);
        Task<Result> Set(List<int> townIds, int companyId);
    }
}