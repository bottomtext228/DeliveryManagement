using backend.Dtos.Order;
using backend.Errors;
using backend.Interfaces.Services;
using backend.Models.Map;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class MapService : IMapService
    {
        private readonly CountryMap _countryMap;
        private readonly TownsGraphSearch _graphSearch;
        private readonly ApplicationDbContext _dbContext;
        private int[][]? _roadsCache;
        public MapService(CountryMap countryMap, TownsGraphSearch graphSearch, ApplicationDbContext dbContext)
        {
            _countryMap = countryMap;
            _graphSearch = graphSearch;
            _dbContext = dbContext;
        }

        public IEnumerable<Town> GetTowns()
        {
            return _countryMap.Towns;
        }

        public int[][] GetRoads()
        {
            if (_roadsCache != null) return _roadsCache;


            int[,] array = _countryMap.Graph.CreateAdjacencyMatrix();

            // Convert to jagged array for JSON serialization
            var jaggedArray = new int[array.GetLength(0)][];
            for (int i = 0; i < array.GetLength(0); i++)
            {
                jaggedArray[i] = new int[array.GetLength(1)];
                for (int j = 0; j < array.GetLength(1); j++)
                {
                    jaggedArray[i][j] = array[i, j];
                }
            }

            _roadsCache = jaggedArray;
            return _roadsCache;
        }

        public async Task<Result<ComputeRouteResponseDto>> ComputeRouteAsync(ComputeRouteRequestDto model)
        {
            // find company
            var company = await _dbContext.Companies.Include(e => e.Stocks).Include(e => e.PickUpPoints).FirstOrDefaultAsync(e => e.Id == model.CompanyId);
            if (company == null) return CompanyErrors.NotFound(model.CompanyId);

            if (!company.ValidateSetup()) return CompanyErrors.MissingSetup();

            // find pick up point
            var pickUpPoint = company.PickUpPoints.FirstOrDefault(e => e.TownId == model.PickUpPointTownId);
            if (pickUpPoint == null) return PickUpPointErrors.NotFound(model.PickUpPointTownId);

            var pickUpPointTown = _countryMap.Towns.Find(e => e.Id == pickUpPoint.TownId)!;

            var townIdsWithStocks = company.Stocks.Select(e => e.TownId).ToList();
            var towns = townIdsWithStocks.Select(e => _countryMap.Towns.Find(t => t.Id == e)!).ToList();

            var route = _graphSearch.ComputeRoute(towns, pickUpPointTown);
            var chosenRoute = model.Choice == RouteChoice.Fastest ? route.Fastest : route.Cheapest;

            return new ComputeRouteResponseDto
            {
                ShippingPrice = chosenRoute.Price,
                ShippingTime = chosenRoute.Time,
                Towns = chosenRoute.Towns.Select(e => e.Name).ToList(),
                IsRoutesEqual = route.IsEqual
            };
        }
    }
}