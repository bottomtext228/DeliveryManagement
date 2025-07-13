using System.Security.Claims;
using backend.Dtos.Company;
using backend.Helpers;
using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        /// Retrieves a company by its ID. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="id">The ID of the company to retrieve.</param>
        /// <returns>The requested company data.</returns>
        /// <response code="200">Returns the requested company.</response>
        /// <response code="401">Unauthorized. Only clients can access this endpoint.</response>
        /// <response code="403">Forbidden. Method used only by clients.</response>
        /// <response code="404">Company with the specified ID was not found.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("{id:int}")]
        [Authorize(Roles = "client")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(CompanyDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Get(int id)
        {
            var company = await _dbContext.Companies.FindAsync(id);
            if (company == null) return ApiResponseHelper.NotFound(HttpContext, $"Company with ID {id} not found.");

            return Ok(company.ToCompanyDto());
        }

        /// <summary>
        /// Checks if the current company can create a product. Accessible only to users registered as a company.
        /// </summary>
        /// <returns>A response indicating whether the company can create a product, and a message if not allowed.</returns>
        /// <response code="200">Returns whether the company can create a product.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by companies.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("can-create-product")]
        [Authorize(Roles = "company")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(CanCreateProductResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CanCreateProduct()
        {
            var companyId = int.Parse(User.FindFirstValue("CompanyId")!);
            var company = (await _dbContext.Companies.Include(e => e.Stocks).Include(e => e.PickUpPoints).FirstOrDefaultAsync(e => e.Id == companyId))!;

            bool canCreate = company.Stocks.Count != 0 && company.PickUpPoints.Count != 0;

            return Ok(new CanCreateProductResponse
            {
                CanCreate = canCreate,
                Message = canCreate ? null : "Перед созданием товара необходимо указать склады и пункты выдачи заказов!"
            });
        }

        public class CanCreateProductResponse
        {
            public bool CanCreate { get; set; }
            public string? Message { get; set; }
        }

    }
}