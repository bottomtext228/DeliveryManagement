
using backend.Dtos.Company;

namespace backend.Interfaces.Services
{
    public interface ICompanyService
    {
        Task<Result<CompanyDto>> GetByIdAsync(int companyId, CancellationToken cancellationToken = default);
        Task<Result> CanCreateProductAsync(int companyId, CancellationToken cancellationToken = default);
        Task<Result> UpdateDetails(int companyId,  UpdateCompanyDetailsRequest model, CancellationToken cancellationToken = default);
    }
}