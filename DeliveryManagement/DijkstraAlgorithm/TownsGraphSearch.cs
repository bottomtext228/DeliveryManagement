using DeliveryManagement.DijkstraAlgorith;
using DeliveryManagement.Models;
using DeliveryManagement.Models.Map;
using DeliveryManagement.Services;

namespace DeliveryManagement.GraphSearch
{
    public class TownsGraphSearch
    {

        private readonly CountryMap _countryMap;
        private readonly ApplicationDbContext _dbContext;
        public TownsGraphSearch(CountryMap countryMap, ApplicationDbContext dbContext)
        {
            _countryMap = countryMap;
            _dbContext = dbContext;
        }
        // first is bestChepeastPath, second is bestFastestPath
        public Tuple<Tuple<int, int, List<Town>>, Tuple<int, int, List<Town>>> ComputeRoute(Company company, Town pickUpPointTown)
        {

            var pathSystem = new DijkstraAlgorithm(_countryMap.Graph);


            var mostSuitableStockTimeWeight = int.MaxValue;
            Stock mostSuitableStockTime = null;

            var mostSuitableStockPriceWeight = int.MaxValue;
            Stock mostSuitableStockPrice = null;


            Tuple<int, int, List<Town>> bestCheapestPath = Tuple.Create(0, 0, new List<Town>());
            Tuple<int, int, List<Town>> bestFastestPath = Tuple.Create(0, 0, new List<Town>());

            foreach (var stock in company.Stocks)
            {
                if (stock.TownId == pickUpPointTown.Id)
                {
                    break;
                }
                var stockTown = _countryMap.Towns.FirstOrDefault(t => t.Id == stock.TownId);
                Tuple<int, int, List<Town>> cheapestPath;
                Tuple<int, int, List<Town>> fastestPath;
                fastestPath = pathSystem.GetFastestPath(stockTown, pickUpPointTown);
                cheapestPath = pathSystem.GetCheapestPath(stockTown, pickUpPointTown);


                if (mostSuitableStockTimeWeight > fastestPath.Item1)
                {
                    mostSuitableStockTimeWeight = cheapestPath.Item1;
                    mostSuitableStockTime = stock;
                    bestFastestPath = fastestPath;
                }

                if (mostSuitableStockPriceWeight > cheapestPath.Item1)
                {
                    mostSuitableStockPriceWeight = cheapestPath.Item1;
                    mostSuitableStockPrice = stock;
                    bestCheapestPath = cheapestPath;
                }

            }
            return Tuple.Create(bestCheapestPath, bestFastestPath);
        }


    }
}
