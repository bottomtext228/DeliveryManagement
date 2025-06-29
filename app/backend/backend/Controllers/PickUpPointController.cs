using System.Security.Claims;
using backend.Dtos.PickUpPoint;
using backend.Helpers;
using backend.Mappers;
using backend.Models.Map;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing pick up points of the company
    /// </summary>
    [ApiController]
    [Route("api/pickuppoint")]
    public class PickUpPointController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly CountryMap _countryMap;
        public PickUpPointController(ApplicationDbContext dbContext, CountryMap countryMap)
        {
            _dbContext = dbContext;
            _countryMap = countryMap;
        }

        /// <summary>
        /// Gets all pick up points for the currently authenticated company.
        /// </summary>
        /// <returns>List of pick up point DTOs.</returns>
        /// <response code="200">Successfully retrieved pick up points.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        [Authorize(Roles = "company")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<PickUpPointDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll()
        {
            var companyId = int.Parse(User.FindFirstValue("CompanyId")!);
            return Ok(await _dbContext.PickUpPoints.Where(p => p.CompanyId == companyId).Select(e => e.ToPickUpPointDto(_countryMap.Towns)).ToListAsync());
        }

        /// <summary>
        /// Sets pick up points for the currently authenticated company.
        /// All previous pick up points will be removed.
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
        /// <returns>No content if successful.</returns>
        /// <response code="204">Pick up points updated successfully.</response>
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

            // delete previous pick up points
            await _dbContext.PickUpPoints.Where(p => p.CompanyId == companyId).ExecuteDeleteAsync();

            // set new ones
            var newPickUpPoints = townIds.Select(townId => new PickUpPoint
            {
                CompanyId = companyId,
                TownId = townId
            }).ToList();
            
            await _dbContext.AddRangeAsync(newPickUpPoints);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Gets pick up points for a specific company by ID. Used by clients.
        /// </summary>
        /// <param name="companyId">The ID of the company.</param>
        /// <returns>List of pick-up point DTOs.</returns>
        /// <response code="200">Successfully retrieved pick up points.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("{companyId:int}")]
        [Authorize(Roles = "client")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<PickUpPointDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetByCompanyId(int companyId)
        {
            var company = await _dbContext.Companies.FindAsync(companyId);
            if (company == null) return ApiResponseHelper.NotFound(HttpContext, $"Company with ID {companyId} not found.");

            var pickUpPoints = await _dbContext.PickUpPoints.Where(p => p.CompanyId == companyId).Select(e => e.ToPickUpPointDto(_countryMap.Towns)).ToListAsync();
            return Ok(pickUpPoints);
        }

    }
}