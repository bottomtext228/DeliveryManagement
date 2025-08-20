using backend.Dtos.PickUpPoint;

namespace backend.Interfaces.Services
{
    public interface IPickUpPointService
    {
        Task<Result<IEnumerable<PickUpPointDto>>> GetAll(int companyId);
        Task<Result> Set(List<int> townIds, int companyId);
        Task<Result<IEnumerable<PickUpPointDto>>> GetByCompanyId(int companyId);
    }
}