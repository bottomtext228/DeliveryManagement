using System.Security.Claims;
using backend.Dtos.Order;
using backend.Mappers;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly TownsGraphSearch _graphSearch;
        private readonly CountryMap _countryMap;
        public OrderController(ApplicationDbContext dbContext, TownsGraphSearch graphSearch, CountryMap countryMap)
        {
            _dbContext = dbContext;
            _graphSearch = graphSearch;
            _countryMap = countryMap;
        }

        /*         [HttpPost]
                [Authorize(Roles = "client")]
                public async Task<IActionResult> Create([FromBody] CreateOrderDto model)
                {

                    // find product
                    var product = await _dbContext.Products.Include(e => e.Company).ThenInclude(e => e.Stocks).FirstOrDefaultAsync(e => e.Id == model.ProductId);
                    if (product == null) return BadRequest();



                    // find pick up point
                    var pickUpPoint = _countryMap.Towns.Find(e => e.Id == model.PickUpPointTownId);
                    if (pickUpPoint == null) return BadRequest();

                    // get towns with stocks of the company
                    var company = product.Company;

                    var townIdsWithStocks = company.Stocks.Where(e => e.CompanyId == product.CompanyId).Select(e => e.TownId).ToList();

                    var towns = townIdsWithStocks.Select(e => _countryMap.Towns.Find(t => t.Id == e)!).ToList();

                    var route = _graphSearch.ComputeRoute(towns, pickUpPoint);
                    var chosenRoute = model.Choice == RouteChoice.Fastest ? route.Fastest : route.Cheapest;

                    var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                    await _dbContext.Orders.AddAsync(new Order
                    {
                        UserId = currentUserId!,
                        ProductId = model.ProductId,
                        Quantity = model.Quantity,
                        ProductPrice = product.Price,
                        ShippingPrice = chosenRoute.Price,
                        FinalPrice = model.Quantity * product.Price + chosenRoute.Price,
                        ShippingTime = chosenRoute.Time,
                        TownIds = chosenRoute.Towns.Select(e => e.Id).ToList()
                    });
                    await _dbContext.SaveChangesAsync();

                    return Created();
                }
         */
        [HttpPost]
        [Authorize(Roles = "client")]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto model)
        {
            var pickUpPoint = _countryMap.Towns.Find(t => t.Id == model.PickUpPointTownId);
            if (pickUpPoint == null)
                return BadRequest("Invalid pickup point.");

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var productIds = model.Products.Select(p => p.ProductId).ToList();

            // Fetch all products in one query
            var products = await _dbContext.Products
                .Include(p => p.Company)
                .ThenInclude(c => c.Stocks)
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            // Check all products exist
            if (products.Count != model.Products.Count)
                return BadRequest("One or more products not found.");

            // Check all products belong to the same company
            var distinctCompanyIds = products.Select(p => p.CompanyId).Distinct().ToList();
            if (distinctCompanyIds.Count > 1)
                return BadRequest("All products must belong to the same company.");

            var company = products.First().Company;

            // Get towns with stock
            var townIdsWithStock = company.Stocks.Select(s => s.TownId).ToList();
            var towns = townIdsWithStock.Select(id => _countryMap.Towns.Find(t => t.Id == id)!).ToList();

            var route = _graphSearch.ComputeRoute(towns, pickUpPoint);
            var chosenRoute = model.Choice == RouteChoice.Fastest ? route.Fastest : route.Cheapest;

            var order = new Order
            {
                UserId = currentUserId!,
                ShippingPrice = chosenRoute.Price,
                ShippingTime = chosenRoute.Time,
                TownIds = chosenRoute.Towns.Select(t => t.Id).ToList(),
                Items = []
            };

            float totalProductPrice = 0;

            foreach (var productOrder in model.Products)
            {
                if (productOrder.Quantity <= 0) return BadRequest($"Invalid quantity for product {productOrder.ProductId}.");

                var product = products.First(p => p.Id == productOrder.ProductId);

                var item = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = productOrder.Quantity,
                    ProductPrice = product.Price
                };

                order.Items.Add(item);
                totalProductPrice += product.Price * productOrder.Quantity;
            }

            order.FinalPrice = totalProductPrice + order.ShippingPrice;

            await _dbContext.Orders.AddAsync(order);
            await _dbContext.SaveChangesAsync();

            return Created("", new { order.Id });
        }


        [HttpGet]
        [Authorize(Roles = "client")]
        public async Task<IActionResult> GetAll()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var orders = await _dbContext.Orders.Include(e => e.Items).ThenInclude(e => e.Product).Where(e => e.UserId == currentUserId).Select(e => e.ToOrderDto(_countryMap.Towns)).ToListAsync();
            return Ok(orders);
        }

        /// <summary>
        /// Deletes order by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "client")]
        public async Task<IActionResult> Delete(int id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _dbContext.Orders.Where(e => e.Id == id && e.UserId == currentUserId).ExecuteDeleteAsync();
            if (result != 1) return NotFound();
            return NoContent();

        }

        [HttpPost("preview")]
        [Authorize(Roles = "client")]
        public async Task<IActionResult> ComputeRoute([FromBody] PreviewOrderRequestDto model)
        {

            // find product
            var product = await _dbContext.Products.Include(e => e.Company).ThenInclude(e => e.Stocks).FirstOrDefaultAsync(e => e.Id == model.ProductId);
            if (product == null) return Problem("Product is not found.", statusCode: StatusCodes.Status400BadRequest);


            // find pick up point
            var pickUpPoint = _countryMap.Towns.Find(e => e.Id == model.PickUpPointTownId);
            if (pickUpPoint == null) return Problem("PickUpPoint is not found.", statusCode: StatusCodes.Status400BadRequest);

            // get towns with stocks of the company
            var company = product.Company;

            var townIdsWithStocks = company.Stocks.Where(e => e.CompanyId == product.CompanyId).Select(e => e.TownId).ToList();

            var towns = townIdsWithStocks.Select(e => _countryMap.Towns.Find(t => t.Id == e)!).ToList();

            var route = _graphSearch.ComputeRoute(towns, pickUpPoint);
            var chosenRoute = model.Choice == RouteChoice.Fastest ? route.Fastest : route.Cheapest;

            return Ok(new PreviewOrderResponseDto
            {
                ShippingPrice = chosenRoute.Price,
                ShippingTime = chosenRoute.Time,
                Towns = chosenRoute.Towns.Select(e => e.Name).ToList(),
                IsRoutesEqual = route.IsEqual
            });
        }

        /*  [Authorize(Roles = "company")]
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
         return Json("");
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
 } */
    }
}