using DeliveryManagement.DijkstraAlgorith;
using DeliveryManagement.Models;
using DeliveryManagement.Services;
using DeliveryManagement.ViewModels.Order;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryManagement.Controllers
{

    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _dbContext;

        private CountryMap _countryMap;
        public OrderController(ApplicationDbContext dbContext, CountryMap countryMap)
        {
            _dbContext = dbContext;
            _countryMap = countryMap;
        }
        public IActionResult Index()
        {





            int?[,] matrix = _countryMap.Graph.CreateAdjacencyMatrix();

            
            //foreach(var node in _countryMap.Graph.AllNodes)
            //{
            //    foreach(var edge in node.Edges)
            //    {
            //        var from = edge.Parent.Town.Id;
            //        var to = edge.Child.Town.Id;
            //        edges.Add((from, to));
            //    }
            //}


            IndexModel view = new IndexModel { Towns = _countryMap.Towns, Matrix = matrix };


            return View(view);
        }
    }
}
