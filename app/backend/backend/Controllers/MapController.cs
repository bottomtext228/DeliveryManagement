using backend.Models.Map;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using backend.Dtos.Order;
using backend.Interfaces.Services;

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
        private readonly IMapService _mapService;

        public MapController(IMapService mapService)
        {
            _mapService = mapService;
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
            return Ok(_mapService.GetTowns());
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
            return Ok(_mapService.GetRoads());
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
            var result = await _mapService.ComputeRouteAsync(model);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }
    }
}