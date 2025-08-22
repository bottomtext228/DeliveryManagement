using backend.Dtos.Catalog;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing catalog products.
    /// </summary>
    [Route("api/catalog")]
    [ApiController]
    [Authorize]
    public class CatalogController : ControllerBase
    {
        private readonly IProductService _productService;
        public CatalogController(IProductService productService)
        {
            _productService = productService;
        }
        /// <summary>
        /// Retrieves paginated list of products.
        /// If the user is the company, returns only products that belong to the user's company.
        /// Otherwise, returns all products.
        /// </summary>
        /// <param name="query">Pagination parameters: PageNumber and PageSize.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Paginated list of product DTOs.</returns>
        /// <response code="200">Returns list of products.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        [Authorize(Roles = "client,company")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll([FromQuery] ProductQueryDto query, CancellationToken cancellationToken)
        {
            var companyId = User.GetCompanyId();

            var result = await _productService.GetAllAsync(companyId, query, cancellationToken);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }

        /// <summary>
        /// Retrieves a specific product by its ID. Companies can retrieve only products that belong to them.
        /// </summary>
        /// <param name="id">Product ID.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Product details.</returns>
        /// <response code="200">Returns the requested product detail.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="404">Product with the specified ID was not found or it does not belong to the user company.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet("{id:int}")]
        [Authorize(Roles = "client,company")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProductDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
        {
            var companyId = User.GetCompanyId();

            var result = await _productService.GetByIdAsync(id, companyId, cancellationToken);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.NotFound(HttpContext, error)
            );
        }

        /// <summary>
        /// Creates a new product. Accessible only to users registered as a company.
        /// </summary>
        /// <param name="model">Product creation data.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Created product.</returns>
        /// <response code="201">Product successfully created.</response>
        /// <response code="400">Validation error or stocks/pick up points not set.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by companies.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost]
        [Authorize(Roles = "company")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ProductDetailDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromForm] CreateProductRequest model, CancellationToken cancellationToken)
        {
            var companyId = User.GetCompanyId();

            var result = await _productService.CreateAsync(model, companyId!.Value, cancellationToken);

            return result.Map(
                onSuccess: product => CreatedAtAction(nameof(GetById), new { id = product.Id }, product),
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }

        /// <summary>
        /// Edits an existing product owned by the current company. Accessible only to users registered as a company.
        /// </summary>
        /// <param name="id">Product ID.</param>
        /// <param name="model">Updated product data.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>No content.</returns>
        /// <response code="204">Product successfully updated.</response>
        /// <response code="400">Validation error.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by companies.</response>
        /// <response code="404">Product with the specified ID was not found or it does not belong to the user company.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPut("{id:int}")]
        [Authorize(Roles = "company")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromForm] EditProductRequest model, CancellationToken cancellationToken)
        {
            var companyId = User.GetCompanyId();

            var result = await _productService.EditAsync(id, model, companyId!.Value, cancellationToken);

            return result.Map(
                onSuccess: NoContent,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }

        /// <summary>
        /// Deletes a product owned by the current company. Accessible only to users registered as a company.
        /// </summary>
        /// <param name="id">Product ID.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>NoContent if deleted.</returns>
        /// <response code="204">Product successfully deleted.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by companies.</response>
        /// <response code="404">Product with the specified ID was not found or it does not belong to the user company.</response>
        /// <response code="500">Internal server error.</response>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "company")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var companyId = User.GetCompanyId();

            var result = await _productService.DeleteAsync(id, companyId!.Value, cancellationToken);

            return result.Map(
                onSuccess: NoContent,
                onFailure: error => ApiResponseHelper.NotFound(HttpContext, error)
            );
        }
    }
}

