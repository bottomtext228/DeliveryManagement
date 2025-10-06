
using backend.Dtos.Company;
using backend.Errors;
using backend.Interfaces.Services;
using backend.Mappers;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ApplicationDbContext _dbContext;
        public CompanyService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Result<CompanyDto>> GetByIdAsync(int companyId, CancellationToken cancellationToken = default)
        {
            var companyDto = await _dbContext.Companies
                .Where(e => e.Id == companyId)
                .Select(e => e.ToCompanyDto())
                .FirstOrDefaultAsync(cancellationToken);

            if (companyDto == null) return CompanyErrors.NotFound(companyId);

            return companyDto;
        }

        public async Task<Result> UpdateDetails(int companyId, UpdateCompanyDetailsRequest model, CancellationToken cancellationToken = default)
        {
            var company = await _dbContext.Companies.FindAsync([companyId], cancellationToken);

            if (company == null) return CompanyErrors.NotFound(companyId);

            company.Name = model.Name;
            company.Description = model.Description;

            await _dbContext.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }

        public async Task<Result> CanCreateProductAsync(int companyId, CancellationToken cancellationToken = default)
        {
            var company = await _dbContext.Companies
                .Include(e => e.Stocks)
                .Include(e => e.PickUpPoints)
                .FirstOrDefaultAsync(e => e.Id == companyId, cancellationToken);
            if (company == null) return CompanyErrors.NotFound(companyId);

            if (company.ValidateSetup()) return Result.Success();

            return CompanyErrors.MissingSetup();
        }
    }
}