using System.Security.Claims;
using backend.Dtos.Order;
using backend.Helpers;
using backend.Mappers;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing orders made by clients.
    /// </summary>
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

        /// <summary>
        /// Creates a new order for one or more products with a specified pick up point and shipping preference. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="model">Details of the order including product IDs, quantities, and pickup point.</param>
        /// <returns>Returns the created order dto or an error if validation fails.</returns>
        /// <response code="201">Order successfully created.</response>
        /// <response code="400">Validation error or products, pickup point, quantity not found.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by clients.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost]
        [Authorize(Roles = "client")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto model)
        {
            var pickUpPoint = _countryMap.Towns.Find(t => t.Id == model.PickUpPointTownId);
            if (pickUpPoint == null)
            {
                return ApiResponseHelper.NotFound(HttpContext, $"PickUpPoint with Town ID {model.PickUpPointTownId} not found.");
            }

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
            {
                // if not then tell the user which products are missing

                var foundProductIds = products.Select(p => p.Id).ToHashSet();
                var missingProductIds = productIds.Where(id => !foundProductIds.Contains(id)).ToList();

                return ApiResponseHelper.BadRequest(HttpContext, $"The following products with IDs not found: {string.Join(", ", missingProductIds)}");
            }

            // Check all products belong to the same company
            var distinctCompanyIds = products.Select(p => p.CompanyId).Distinct().ToList();
            if (distinctCompanyIds.Count > 1)
                return ApiResponseHelper.BadRequest(HttpContext, "All products must belong to the same company.");

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
                if (productOrder.Quantity <= 0) return ApiResponseHelper.BadRequest(HttpContext, $"Invalid quantity for product {productOrder.ProductId}.");

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

            return Created(string.Empty, order.ToOrderDto(_countryMap.Towns));
        }

        /// <summary>
        /// Retrieves all orders made by the authenticated client. Accessible only to users registered as a client.
        /// </summary>
        /// <returns>A list of orders.</returns>
        /// <response code="200">Orders successfully retrieved.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by clients.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        [Authorize(Roles = "client")]
        [ProducesResponseType(typeof(List<OrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var orders = await _dbContext.Orders.Include(e => e.Items).ThenInclude(e => e.Product).Where(e => e.UserId == currentUserId).Select(e => e.ToOrderDto(_countryMap.Towns)).ToListAsync();
            return Ok(orders);
        }

        /// <summary>
        /// Deletes an order by its ID. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="id">ID of the order to delete.</param>
        /// <returns>No content on success.</returns>
        /// <response code="204">Order successfully deleted.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by clients.</response>
        /// <response code="404">Order not found.</response>
        /// <response code="500">Internal server error.</response>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "client")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete(int id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _dbContext.Orders.Where(e => e.Id == id && e.UserId == currentUserId).ExecuteDeleteAsync();
            if (result != 1) return ApiResponseHelper.NotFound(HttpContext, $"Order with ID {id} not found.");
            return NoContent();
        }
    }
}