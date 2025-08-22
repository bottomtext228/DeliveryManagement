using backend.Dtos.PickUpPoint;
using backend.Errors;
using backend.Helpers;
using backend.Interfaces.Services;
using backend.Mappers;
using backend.Models.Map;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class PickUpPointService : IPickUpPointService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly CountryMap _countryMap;
        public PickUpPointService(ApplicationDbContext dbContext, CountryMap countryMap)
        {
            _dbContext = dbContext;
            _countryMap = countryMap;
        }

        public async Task<Result<IEnumerable<PickUpPointDto>>> GetAllAsync(int companyId, CancellationToken cancellationToken = default)
        {
            var company = await _dbContext.Companies.FindAsync(companyId, cancellationToken);
            if (company == null) return CompanyErrors.NotFound(companyId);

            var pickUpPoints = await _dbContext.PickUpPoints
                .Where(p => p.CompanyId == companyId)
                .Select(e => e.ToPickUpPointDto(_countryMap.Towns))
                .ToListAsync(cancellationToken);
            return pickUpPoints;
        }

        public async Task<Result> SetAsync(List<int> townIds, int companyId, CancellationToken cancellationToken = default)
        {
            var company = await _dbContext.Companies.FindAsync(companyId, cancellationToken);
            if (company == null) return CompanyErrors.NotFound(companyId);

            if (townIds.Count == 0) return TownErrors.NoTownsProvided();

            var (duplicates, missing) = IdValidationHelper.ValidateIds(townIds, _countryMap.Towns.Select(p => p.Id));

            if (duplicates.Count != 0) return TownErrors.DuplicateTowns(duplicates);
            if (missing.Count != 0) return TownErrors.TownsNotFound(missing);

            // delete previous pick up points
            await _dbContext.PickUpPoints.Where(p => p.CompanyId == companyId).ExecuteDeleteAsync(cancellationToken);

            // set new ones
            var newPickUpPoints = townIds.Select(townId => new PickUpPoint
            {
                CompanyId = companyId,
                TownId = townId
            }).ToList();

            _dbContext.AddRange(newPickUpPoints);
            
            await _dbContext.SaveChangesAsync(); // do not pass cancellation token

            return Result.Success();
        }

        public async Task<Result<IEnumerable<PickUpPointDto>>> GetByCompanyIdAsync(int companyId, CancellationToken cancellationToken = default)
        {
            var company = await _dbContext.Companies.FindAsync(companyId, cancellationToken);
            if (company == null) return CompanyErrors.NotFound(companyId);

            var pickUpPoints = await _dbContext.PickUpPoints
                .Where(p => p.CompanyId == companyId)
                .Select(e => e.ToPickUpPointDto(_countryMap.Towns))
                .ToListAsync(cancellationToken);
            return pickUpPoints;
        }
    }
}