using backend.Dtos.PickUpPoint;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing pick up points of the company
    /// </summary>
    [ApiController]
    [Route("api/pickuppoint")]
    public class PickUpPointController : ControllerBase
    {
        private readonly IPickUpPointService _pickUpPointService;
        public PickUpPointController(IPickUpPointService pickUpPointService)
        {
            _pickUpPointService = pickUpPointService;
        }

        /// <summary>
        /// Gets all pick up points for the currently authenticated company. Accessible only to users registered as a company.
        /// </summary>
        /// <returns>List of pick up point DTOs.</returns>
        /// <response code="200">Successfully retrieved pick up points.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by companies.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        [Authorize(Roles = "company")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<PickUpPointDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var companyId = User.GetCompanyId();
            var result = await _pickUpPointService.GetAllAsync(companyId!.Value, cancellationToken);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }

        /// <summary>
        /// Sets pick up points for the currently authenticated company.
        /// All previous pick up points will be removed.
        /// Accessible only to users registered as a company.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST api/pickuppoint
        ///     [
        ///         1,
        ///         5,
        ///         7
        ///     ]
        /// </remarks>
        /// <param name="townIds">List of town IDs where pick up points will be created.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>No content if successful.</returns>
        /// <response code="204">Pick up points updated successfully.</response>
        /// <response code="400">Validation error or wrong town IDs.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by companies.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPut]
        [Authorize(Roles = "company")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Set([FromBody] List<int> townIds, CancellationToken cancellationToken)
        {
            var companyId = User.GetCompanyId();

            var result = await _pickUpPointService.SetAsync(townIds, companyId!.Value, cancellationToken);

            return result.Map(
                onSuccess: NoContent,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }

        /// <summary>
        /// Gets pick up points for a specific company by ID. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="companyId">The ID of the company.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>List of pick-up point DTOs.</returns>
        /// <response code="200">Successfully retrieved pick up points.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by clients.</response>
        /// <response code="404">Company is not found.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("{companyId:int}")]
        [Authorize(Roles = "client")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<PickUpPointDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetByCompanyId(int companyId, CancellationToken cancellationToken)
        {
            var result = await _pickUpPointService.GetByCompanyIdAsync(companyId, cancellationToken);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.NotFound(HttpContext, error)
            );
        }

    }
}