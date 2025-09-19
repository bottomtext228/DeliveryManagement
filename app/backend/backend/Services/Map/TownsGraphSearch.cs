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
                if (stockTown.Id == pickUpPointTown.Id) // stock in the same town as pick up point
                {
                    var path = new TownsPath { Time = 1, Price = 50, Towns = [pickUpPointTown] };
                    return new Route { Cheapest = path, Fastest = path, IsEqual = true };
                }

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


            var route = new Route
            {
                Cheapest = bestCheapestPath,
                Fastest = bestFastestPath,
            };

            // this two if statements handle the situation when user can get the same shipping time for different price
            // or the same price for different shipping time.
            if (route.Fastest.Time == route.Cheapest.Time) // if fastest route has the same time as cheapest we make fastest route the same price as cheapest
            {
                route.Fastest = route.Cheapest;
                route.IsEqual = true; // and tell the client that route choice doesn't matter
            }

            if (route.Cheapest.Price == route.Fastest.Price) // if cheapest route has the same price as fastest we make cheapest route the same time as fastest
            {
                route.Cheapest = route.Fastest;
                route.IsEqual = true; // and tell the client that route choice doesn't matter
            }

            return route;
        }


        public class Route
        {
            public required TownsPath Cheapest { get; set; }
            public required TownsPath Fastest { get; set; }
            public bool IsEqual { get; set; }
        }


    }

}
