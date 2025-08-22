using backend.Dtos.Stock;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing stocks of the company
    /// </summary>
    [ApiController]
    [Route("api/stock")]
    [Authorize]

    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService;

        public StockController(IStockService stockService)
        {
            _stockService = stockService;
        }

        /// <summary>
        /// Gets all stocks of the authenticated company. Accessible only to users registered as a company.
        /// </summary>
        /// <returns>List of stock DTOs.</returns>
        /// <response code="200">Successfully retrieved stocks</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by companies.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        [Authorize(Roles = "company")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<GetStocksDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default)
        {
            var companyId = User.GetCompanyId();

            var result = await _stockService.GetAllAsync(companyId!.Value, cancellationToken);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }

        /// <summary>
        /// Sets the stocks of the authenticated company.
        /// All previous stocks will be removed.
        /// Accessible only to users registered as a company.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /api/stock
        ///     [
        ///         1,
        ///         5,
        ///         7
        ///     ]
        /// </remarks>
        /// <param name="townIds">List of town IDs where stocks will be created.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>No content.</returns>
        /// <response code="204">Stocks updated successfully.</response>
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
        public async Task<IActionResult> Set([FromBody] List<int> townIds, CancellationToken cancellationToken = default)
        {
            var companyId = User.GetCompanyId();

            var result = await _stockService.SetAsync(townIds, companyId!.Value, cancellationToken);

            return result.Map(
                onSuccess: NoContent,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }
    }
}