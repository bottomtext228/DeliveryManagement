using backend.Services;
using backend.Models.Map;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.Dtos.Order;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    /// <summary>
    /// Provides endpoints to retrieve map data.
    /// </summary>
    [ApiController]
    [Route("api/map")]
    [Authorize]
    public class MapController : ControllerBase
    {
        private readonly CountryMap _countryMap;
        private readonly ApplicationDbContext _dbContext;
        private readonly TownsGraphSearch _graphSearch;

        public MapController(CountryMap countryMap, ApplicationDbContext dbContext, TownsGraphSearch graphSearch)
        {
            _countryMap = countryMap;
            _dbContext = dbContext;
            _graphSearch = graphSearch;
        }

        /// <summary>
        /// Gets the list of towns in the country map.
        /// </summary>
        /// <returns>List of towns.</returns>
        /// <response code="200">Returns the list of towns.</response>
        /// <response code="401">Unauthorized access.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("towns")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Town>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public IActionResult GetTowns()
        {
            return Ok(_countryMap.Towns);
        }

        /// <summary>
        /// Gets the adjacency matrix representing roads between towns.
        /// </summary>
        /// <returns>Adjacency matrix as a jagged array.</returns>
        /// <response code="200">Returns adjacency matrix of roads.</response>
        /// <response code="401">Unauthorized access.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("roads")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(int[][]), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public IActionResult GetRoads()
        {
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

            return Ok(jaggedArray);
        }

        /// <summary>
        /// Previews the shipping route and cost for a given product and pick up point. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="model">Preview order request containing product and pick up town ID.</param>
        /// <returns>Shipping route details.</returns>
        /// <response code="200">Route successfully calculated.</response>
        /// <response code="400">Validation error or company, pick up point not found or company did not set stocks/pick up points.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by clients.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost("preview")]
        [Authorize(Roles = "client")]
        [ProducesResponseType(typeof(ComputeRouteResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ComputeRoute([FromBody] ComputeRouteRequestDto model)
        {
            // find company
            var company = await _dbContext.Companies.Include(e => e.Stocks).Include(e => e.PickUpPoints).FirstOrDefaultAsync(e => e.Id == model.CompanyId);
            if (company == null) return ApiResponseHelper.BadRequest(HttpContext, $"Company with ID {model.CompanyId} not found.");

            if (company.Stocks.Count == 0 || company.PickUpPoints.Count == 0)
            {
                return ApiResponseHelper.BadRequest(HttpContext, $"Company with ID {model.CompanyId} did not set stocks/pick up points.");
            }

            // find pick up point
            var pickUpPoint = company.PickUpPoints.FirstOrDefault(e => e.TownId == model.PickUpPointTownId);
            if (pickUpPoint == null) return ApiResponseHelper.BadRequest(HttpContext, $"PickUpPoint with Town ID {model.PickUpPointTownId} not found.");

            var pickUpPointTown = _countryMap.Towns.Find(e => e.Id == pickUpPoint.TownId)!;

            var townIdsWithStocks = company.Stocks.Select(e => e.TownId).ToList();
            var towns = townIdsWithStocks.Select(e => _countryMap.Towns.Find(t => t.Id == e)!).ToList();

            var route = _graphSearch.ComputeRoute(towns, pickUpPointTown);
            var chosenRoute = model.Choice == RouteChoice.Fastest ? route.Fastest : route.Cheapest;

            return Ok(new ComputeRouteResponseDto
            {
                ShippingPrice = chosenRoute.Price,
                ShippingTime = chosenRoute.Time,
                Towns = chosenRoute.Towns.Select(e => e.Name).ToList(),
                IsRoutesEqual = route.IsEqual
            });
        }
    }
}