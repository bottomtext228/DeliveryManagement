using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using backend.Models.Map;
using backend.Services;

namespace backend.tests
{
    public class TownsGraphSearchTests
    {
        private readonly CountryMap _countryMap;
        private readonly TownsGraphSearch _graphSearch;
        public TownsGraphSearchTests()
        {
            _countryMap = new CountryMap();
            _graphSearch = new TownsGraphSearch(_countryMap);
        }
        [Fact]
        public void CheapestPath_Price_Yaroslav_Peter_Tambov_To_Ijevsk_Equals_910()
        {
            // Arrange
            var Yaroslavl = _countryMap.Towns.Find(e => e.Name == "Ярославль")!;
            var SaintPetersburg = _countryMap.Towns.Find(e => e.Name == "Санкт-Петербург")!;
            var Tambov = _countryMap.Towns.Find(e => e.Name == "Тамбов")!;
            var Ijevsk = _countryMap.Towns.Find(e => e.Name == "Ижевск")!;
            List<Town> towns = [Yaroslavl, SaintPetersburg, Tambov];

            // Act
            var route = _graphSearch.ComputeRoute(towns, Ijevsk);
            var cheapestPath = route.Fastest;

            // Assert
            Assert.Equal(910, cheapestPath.Price);
        }
        [Fact]
        public void FastestPath_Price_Yaroslav_Moscow_Peter_Tambov_To_Ijevsk_Equals_1015()
        {
            // Arrange
            var Yaroslavl = _countryMap.Towns.Find(e => e.Name == "Ярославль")!;
            var Moscow = _countryMap.Towns.Find(e => e.Name == "Москва")!;
            var SaintPetersburg = _countryMap.Towns.Find(e => e.Name == "Санкт-Петербург")!;
            var Tambov = _countryMap.Towns.Find(e => e.Name == "Тамбов")!;
            var Ijevsk = _countryMap.Towns.Find(e => e.Name == "Ижевск")!;
            List<Town> towns = [Yaroslavl, Moscow, SaintPetersburg, Tambov];

            // Act
            var route = _graphSearch.ComputeRoute(towns, Ijevsk);
            var fastestPath = route.FastestPath;

            // Assert
            Assert.Equal(1015, fastestPath.Price);
        }
    }
}