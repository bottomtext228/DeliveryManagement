using backend.Dtos.Stock;
using backend.Errors;
using backend.Helpers;
using backend.Interfaces.Services;
using backend.Models.Map;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class StockService : IStockService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly CountryMap _countryMap;

        public StockService(ApplicationDbContext dbContext, CountryMap countryMap)
        {
            _dbContext = dbContext;
            _countryMap = countryMap;
        }

        public async Task<Result<IEnumerable<GetStocksDto>>> GetAll(int companyId)
        {
            var company = await _dbContext.Companies.FindAsync(companyId);
            if (company == null) return CompanyErrors.NotFound(companyId);


            var stocks = await _dbContext.Stocks
                .Where(s => s.CompanyId == companyId)
                .Select(s => new GetStocksDto { Id = s.Id, CompanyId = s.CompanyId, TownId = s.TownId })
                .ToListAsync();
            return stocks;
        }

        public async Task<Result> Set(List<int> townIds, int companyId)
        {
            var company = await _dbContext.Companies.FindAsync(companyId);
            if (company == null) return CompanyErrors.NotFound(companyId);

            if (townIds.Count == 0) return TownErrors.NoTownsProvided();

            var (duplicates, missing) = IdValidationHelper.ValidateIds(townIds, _countryMap.Towns.Select(p => p.Id));

            if (duplicates.Count != 0) return TownErrors.DuplicateTowns(duplicates);
            if (missing.Count != 0) return TownErrors.TownsNotFound(missing);

            // delete previous stocks
            await _dbContext.Stocks.Where(p => p.CompanyId == companyId).ExecuteDeleteAsync();

            // save new ones
            var newStocks = townIds.Select(townId => new Stock { CompanyId = companyId, TownId = townId });
            _dbContext.AddRange(newStocks);
            
            await _dbContext.SaveChangesAsync();

            return Result.Success();
        }
    }
}