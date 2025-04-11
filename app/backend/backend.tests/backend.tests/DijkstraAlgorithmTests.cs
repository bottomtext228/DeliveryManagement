using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Services;

namespace backend.tests
{
    public class DijkstraAlgorithmTests
    {
        private readonly DijkstraAlgorithm _pathSystem;
        private readonly CountryMap _countryMap;
        public DijkstraAlgorithmTests()
        {
            _countryMap = new CountryMap();
            _pathSystem = new DijkstraAlgorithm(_countryMap.Graph);
        }

        [Fact]
        public void CheapestPath_Yaroslavl_Moscow_Equals_240()
        {
            // Arrange
            var Yaroslavl = _countryMap.Towns.Find(e => e.Name == "Ярославль");
            var Moscow = _countryMap.Towns.Find(e => e.Name == "Москва");

            // Act
            var path = _pathSystem.GetCheapestPath(Yaroslavl, Moscow);

            // Assert
            Assert.Equal(240, path.Price);
        }

        [Fact]
        public void CheapestPath_Price_SaintPetesburg_Ijevsk_Equals_1245()
        {
            // Arrange
            var SaintPetersburg = _countryMap.Towns.Find(e => e.Name == "Санкт-Петербург");
            var Ijevsk = _countryMap.Towns.Find(e => e.Name == "Ижевск");

            // Act
            var path = _pathSystem.GetCheapestPath(SaintPetersburg, Ijevsk);

            // Assert
            Assert.Equal(1245, path.Price);
        }


        [Fact]
        public void CheapestPath_Time_SaintPetesburg_Ijevsk_Equals_18()
        {
            // Arrange
            var SaintPetersburg = _countryMap.Towns.Find(e => e.Name == "Санкт-Петербург");
            var Ijevsk = _countryMap.Towns.Find(e => e.Name == "Ижевск");

            // Act
            var path = _pathSystem.GetCheapestPath(SaintPetersburg, Ijevsk);

            // Assert
            Assert.Equal(22, path.Time);

        }

        [Fact]
        public void FastestPath_Time_SaintPetesburg_Ijevsk_Equals_18()
        {
            // Arrange
            var SaintPetersburg = _countryMap.Towns.Find(e => e.Name == "Санкт-Петербург");
            var Ijevsk = _countryMap.Towns.Find(e => e.Name == "Ижевск");

            // Act
            var path = _pathSystem.GetFastestPath(SaintPetersburg, Ijevsk);

            // Assert
            Assert.Equal(18, path.Time);
        }

        [Fact]
        public void FastestPath_Price_SaintPetesburg_Ijevsk_Equals_1365()
        {
            // Arrange
            var SaintPetersburg = _countryMap.Towns.Find(e => e.Name == "Санкт-Петербург");
            var Ijevsk = _countryMap.Towns.Find(e => e.Name == "Ижевск");

            // Act
            var path = _pathSystem.GetFastestPath(SaintPetersburg, Ijevsk);

            // Assert
            Assert.Equal(1365, path.Price);
        }

    }
}