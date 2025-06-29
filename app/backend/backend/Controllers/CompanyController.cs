using backend.Dtos.Company;
using backend.Helpers;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Handles operations related to companies.
    /// </summary>
    [ApiController]
    [Route("api/company")]
    public class CompanyController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public CompanyController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Retrieves a company by its ID. Accessible only to clients.
        /// </summary>
        /// <param name="id">The ID of the company to retrieve.</param>
        /// <returns>The requested company data.</returns>
        /// <response code="200">Returns the requested company.</response>
        /// <response code="401">Unauthorized. Only clients can access this endpoint.</response>
        /// <response code="404">Company with the specified ID was not found.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("{id:int}")]
        [Authorize(Roles = "client")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(CompanyDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Get(int id)
        {
            var company = await _dbContext.Companies.FindAsync(id);
            if (company == null) return ApiResponseHelper.NotFound(HttpContext, $"Company with ID {id} not found.");

            return Ok(company.ToCompanyDto());
        }
    }
}