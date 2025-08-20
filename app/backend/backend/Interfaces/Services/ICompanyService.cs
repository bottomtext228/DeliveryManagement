
using backend.Dtos.Company;

namespace backend.Interfaces.Services
{
    public interface ICompanyService
    {
        Task<Result<CompanyDto>> GetByIdAsync(int companyId);
        Task<Result> CanCreateProductAsync(int companyId);
    }
}