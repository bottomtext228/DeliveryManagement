using DeliveryManagement.Models;
using DeliveryManagement.Models.Map;
using DeliveryManagement.Services;
using DeliveryManagement.GraphSearch;
using DeliveryManagement.ViewModels.Order;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace DeliveryManagement.Controllers
{
    [Authorize]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _dbContext;

        private readonly CountryMap _countryMap;
        private readonly TownsGraphSearch _graphSearch;
        public OrderController(ApplicationDbContext dbContext, CountryMap countryMap, TownsGraphSearch graphSearch)
        {
            _dbContext = dbContext;
            _countryMap = countryMap;
            _graphSearch = graphSearch;
        }
        [Authorize(Roles = "company")]
        public IActionResult Index() // country map
        {


            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var currentCompany = _dbContext.Companies.Include(c => c.Stocks).Include(c => c.PickUpPoints).FirstOrDefault(c => c.UserId == userId);

            if (currentCompany != null)
            {


                var jsonStocks = string.Join(",", currentCompany.Stocks.Select(s => s.TownId));
                var jsonPickUpPoints = string.Join(",", currentCompany.PickUpPoints.Select(s => s.TownId));


                int?[,] matrix = _countryMap.Graph.CreateAdjacencyMatrix();

                IndexModel view = new IndexModel { Towns = _countryMap.Towns, Matrix = matrix, JsonStocks = jsonStocks, JsonPickUpPoints = jsonPickUpPoints };


                return View(view);
            }

            return BadRequest();
        }

        [HttpPost]
        [Authorize(Roles = "company")]
        public IActionResult Index([FromBody] StocksAndPickUpPoints info)
        {

            var currentCompany = _dbContext.Companies.Include(c => c.Stocks).Include(c => c.PickUpPoints).FirstOrDefault(c => c.UserId == User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (currentCompany != null)
            {
                currentCompany.Stocks.Clear();
                info.stocks.ToList().ForEach(townId => currentCompany.Stocks.Add(new Stock { Company = currentCompany, TownId = townId }));


                currentCompany.PickUpPoints.Clear();
                info.pickUpPoints.ToList().ForEach(townId => currentCompany.PickUpPoints.Add(new PickUpPoint { Company = currentCompany, TownId = townId }));


                _dbContext.SaveChanges();

            }

            return Ok();
        }

        [HttpGet]
        [Authorize(Roles = "client")]

        public IActionResult OrderProduct(int? id)
        {
            var product = _dbContext.Products.FirstOrDefault(p => p.Id == id);
            if (product != null)
            {
                var currentCompany = _dbContext.Companies.Include(c => c.PickUpPoints).Include(c => c.Products).FirstOrDefault(c => c.Products.FirstOrDefault(p => p == product) != null);

                if (currentCompany != null)
                {
                    var townsWithPickUpPoints = currentCompany.PickUpPoints.Select(p => _countryMap.Towns.FirstOrDefault(t => t.Id == p.TownId)).ToList();

                    return View(new OrderProductToViewViewModel { PickUpPointsTowns = townsWithPickUpPoints, Product = product });
                }
            }
            return View();
        }
        public record class OrderProductResult
        {
            public int id { get; set; }
            public int PickUpPointTownId { get; set; }
            public bool isFastest { get; set; }
        }
        [HttpPost]
        [Authorize(Roles = "client")]
        public IActionResult OrderProduct([FromBody]OrderProductResult result)
        {
            if (result == null)
            {
                return BadRequest();
            }
            var product = _dbContext.Products.FirstOrDefault(p => p.Id == result.id);
            if (product != null)
            {
                var currentCompany = _dbContext.Companies.Include(c => c.Stocks).Include(c => c.PickUpPoints).Include(c => c.Products).FirstOrDefault(c => c.Products.FirstOrDefault(p => p == product) != null);

                if (currentCompany != null)
                {
                    var pickUpPointTown = _countryMap.Towns.FirstOrDefault(t => t.Id == result.PickUpPointTownId);
                    if (pickUpPointTown == null)
                    {
                        return BadRequest();
                    }
                    var route = _graphSearch.ComputeRoute(currentCompany, pickUpPointTown);

                    Tuple<int, int, List<Town>> chosenPath;
                    if (!result.isFastest)
                    {
                        chosenPath = route.Item1;
                    }
                    else
                    {
                        chosenPath = route.Item2;
                    }

                    var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    var currentUser = _dbContext.Users.FirstOrDefault(u => u.Id == currentUserId);
                    if (currentUser != null)
                    {
                        var order = new Order { Product = product, User = currentUser, TownIds = chosenPath.Item3.Select(town => town.Id).ToList() };
                        _dbContext.Orders.Add(order);
                        _dbContext.SaveChanges();
                        return Ok();
                    }
                }
            }
            return BadRequest();
        }

        public record class ComputeRouteResponse
        {
            public Tuple<int, int, List<Town>> bestCheapestPath { get; set; }
            public Tuple<int, int, List<Town>> bestFastestPath { get; set; }
        }
        public record class MapRouteData
        {
            public int PickUpPointTownId { get; set; }
            public int CompanyId { get; set; }

        }
        [HttpPost]
        [Authorize(Roles = "client")]
        public JsonResult ComputeRoute([FromBody] MapRouteData data)
        {
            if (data == null)
            {
                BadRequest();
            }
            var currentCompany = _dbContext.Companies.Include(c => c.Stocks).Include(c => c.PickUpPoints).Include(c => c.Products).FirstOrDefault(c => c.Id == data.CompanyId);
            if (currentCompany != null)
            {
                var pickUpPointTown = _countryMap.Towns.FirstOrDefault(t => t.Id == data.PickUpPointTownId);
                if (pickUpPointTown != null && currentCompany.PickUpPoints.Any(p => p.TownId == pickUpPointTown.Id))
                {

                    var m = _countryMap.Graph.CreateTimeAdjacencyMatrix();
                    for (int i = 0; i < m.GetLength(0); i++)
                    {
                        for (int j = 0; j < m.GetLength(1); j++)
                        {
                            Console.WriteLine(m[i, j]);
                        }
                    }
                
                    var route = _graphSearch.ComputeRoute(currentCompany, pickUpPointTown);
                    return Json(new ComputeRouteResponse { bestCheapestPath = route.Item1, bestFastestPath = route.Item2 });


                }
            }
            return Json("");


        }




        [HttpGet]
        [Authorize(Roles = "client")]
        public IActionResult All()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var orders = _dbContext.Orders.Include(o => o.Product).Where(o => o.User.Id == currentUserId).ToList();




            var model = new AllViewModel();


            foreach(var order in orders)
            {

                List<string> townNames = new List<string>();
                foreach (var townId in order.TownIds)
                {
                    var town = _countryMap.Towns.FirstOrDefault(town => town.Id == townId);
                    townNames.Add(town.Name);
                
                }
                model.Orders.Add(new OneOrderViewModel { TownsNames = townNames, OrderId = order.Id, Product = order.Product });
             
            }
 


            return View(model);
        }

        [HttpGet]
        [Authorize(Roles = "client")]
        public IActionResult Get(int? id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var order = _dbContext.Orders.Include(o => o.Product).FirstOrDefault(o => o.User.Id == currentUserId && o.Id == id);
            if (order != null)
            {
                var model = new OneOrderViewModel
                {
                    Product = order.Product,
                    TownsNames = order.TownIds.Select(id => _countryMap.Towns.FirstOrDefault(town => town.Id == id).Name).ToList(),
                    OrderId = order.Id
                };
                return View(model);
            }

            return View();

        }


        [HttpGet]
        [Authorize(Roles = "client")]
        public IActionResult MyOrders()
        {

            return View();
        }
    }
}
