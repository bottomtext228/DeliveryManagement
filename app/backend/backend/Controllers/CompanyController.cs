using backend.Dtos.Company;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces.Services;
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
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        /// <summary>
        /// Retrieves a company by its ID. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="id">The ID of the company to retrieve.</param>
        /// <param name="cancellationToken"></param>
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
        public async Task<IActionResult> Get(int id, CancellationToken cancellationToken)
        {
            var result = await _companyService.GetByIdAsync(id, cancellationToken);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.NotFound(HttpContext, error)
            );
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "company")]
        public async Task<IActionResult> UpdateDetails([FromRoute] int id, [FromForm] UpdateCompanyDetailsRequest model, CancellationToken cancellationToken)
        {
            var result = await _companyService.UpdateDetails(id, model, cancellationToken);

            return result.Map(
                onSuccess: NoContent,
                onFailure: error => ApiResponseHelper.NotFound(HttpContext, error)
            );

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
        public async Task<IActionResult> CanCreateProduct(CancellationToken cancellationToken)
        {
            var companyId = User.GetCompanyId();

            var result = await _companyService.CanCreateProductAsync(companyId!.Value, cancellationToken);

            return Ok(new CanCreateProductResponse
            {
                CanCreate = result.IsSuccess,
                Message = result.IsFailure ? result.Error!.Message : null
            });
        }

        public class CanCreateProductResponse
        {
            public bool CanCreate { get; set; }
            public string? Message { get; set; }
        }

    }
}