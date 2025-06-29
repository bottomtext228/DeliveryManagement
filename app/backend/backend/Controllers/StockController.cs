using System.Security.Claims;
using backend.Dtos.Stock;
using backend.Helpers;
using backend.Models.Map;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        private readonly ApplicationDbContext _dbContext;
        private readonly CountryMap _countryMap;

        public StockController(ApplicationDbContext dbContext, CountryMap countryMap)
        {
            _dbContext = dbContext;
            _countryMap = countryMap;
        }

        /// <summary>
        /// Gets all stocks of the authenticated company.
        /// </summary>
        /// <returns>List of stock DTOs.</returns>
        /// <response code="200">Successfully retrieved stocks</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        [Authorize(Roles = "company")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<GetStocksDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll()
        {
            var companyId = int.Parse(User.FindFirstValue("CompanyId")!);
            var stocks = _dbContext.Stocks.Where(s => s.CompanyId == companyId).Select(s => new GetStocksDto { Id = s.Id, CompanyId = s.CompanyId, TownId = s.TownId });
            var list = await stocks.ToListAsync();
            return Ok(list);
        }

        /// <summary>
        /// Sets the stocks of the authenticated company.
        /// All previous stocks will be removed.
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
        /// <returns>No content.</returns>
        /// <response code="204">Stocks updated successfully.</response>
        /// <response code="400">Validation error or wrong town IDs.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPut]
        [Authorize(Roles = "company")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Set([FromBody] List<int> townIds)
        {
            var (duplicates, missing) = IdValidationHelper.ValidateIds(townIds, _countryMap.Towns.Select(p => p.Id));

            if (duplicates.Count != 0) return ApiResponseHelper.BadRequest(HttpContext, $"Duplicate town IDs found: {string.Join(", ", duplicates)}");
            if (missing.Count != 0)  return ApiResponseHelper.BadRequest(HttpContext, $"The following towns with IDs not found: {string.Join(", ", missing)}");

            var companyId = int.Parse(User.FindFirstValue("CompanyId")!);

            // delete previous stocks
            await _dbContext.Stocks.Where(p => p.CompanyId == companyId).ExecuteDeleteAsync();

            // save new ones
            var newStocks = townIds.Select(townId => new Stock { CompanyId = companyId, TownId = townId });
            await _dbContext.AddRangeAsync(newStocks);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}