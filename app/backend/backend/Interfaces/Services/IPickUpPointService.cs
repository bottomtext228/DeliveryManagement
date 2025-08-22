using backend.Dtos.PickUpPoint;

namespace backend.Interfaces.Services
{
    public interface IPickUpPointService
    {
        Task<Result<IEnumerable<PickUpPointDto>>> GetAllAsync(int companyId, CancellationToken cancellationToken = default);
        Task<Result> SetAsync(List<int> townIds, int companyId, CancellationToken cancellationToken = default);
        Task<Result<IEnumerable<PickUpPointDto>>> GetByCompanyIdAsync(int companyId, CancellationToken cancellationToken = default);
    }
}