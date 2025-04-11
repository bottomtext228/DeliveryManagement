using backend.Models.Map;

namespace backend.Services
{
    public class TownsGraphSearch
    {

        private readonly CountryMap _countryMap;
        public TownsGraphSearch(CountryMap countryMap)
        {
            _countryMap = countryMap;
        }

        public Route ComputeRoute(List<Town> stockTowns, Town pickUpPointTown)
        {

            var pathSystem = new DijkstraAlgorithm(_countryMap.Graph);


            var mostSuitableStockTimeWeight = int.MaxValue;
            Town mostSuitableStockTime;

            var mostSuitableStockPriceWeight = int.MaxValue;
            Town mostSuitableStockPrice;


            TownsPath bestCheapestPath = new();
            TownsPath bestFastestPath = new();

            foreach (var stockTown in stockTowns)
            {
                if (stockTown.Id == pickUpPointTown.Id)
                {
                    break;
                }
                /*     var stockTown = _countryMap.Towns.FirstOrDefault(t => t.Id == stockTown.Id); */
                TownsPath cheapestPath;
                TownsPath fastestPath;
                fastestPath = pathSystem.GetFastestPath(stockTown, pickUpPointTown);
                cheapestPath = pathSystem.GetCheapestPath(stockTown, pickUpPointTown);


                if (mostSuitableStockTimeWeight > fastestPath.Time)
                {
                    mostSuitableStockTimeWeight = fastestPath.Time;
                    mostSuitableStockTime = stockTown;
                    bestFastestPath = fastestPath;
                }

                if (mostSuitableStockPriceWeight > cheapestPath.Price)
                {
                    mostSuitableStockPriceWeight = cheapestPath.Price;
                    mostSuitableStockPrice = stockTown;
                    bestCheapestPath = cheapestPath;
                }

            }
            return new Route { CheapestPath = bestCheapestPath, FastestPath = bestFastestPath };
        }


        public class Route
        {
            public required TownsPath CheapestPath { get; set; }
            public required TownsPath FastestPath { get; set; }
        }


    }

}
