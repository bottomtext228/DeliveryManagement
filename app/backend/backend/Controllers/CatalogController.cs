using System.Security.Claims;
using backend.Dtos.Catalog;
using backend.Helpers;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
        private readonly ApplicationDbContext _dbContext;
        private readonly IFileService _fileService;
        public CatalogController(ApplicationDbContext dbContext, IFileService fileService)
        {
            _dbContext = dbContext;
            _fileService = fileService;
        }

        /// <summary>
        /// Retrieves all products if user is a client or only products that belong to the company if user is a company.
        /// </summary>
        /// <returns>List of product DTOs.</returns>
        /// <response code="200">Returns list of products.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        [Authorize(Roles = "client,company")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll()
        {
            if (User.IsInRole("client"))
            {
                var products = await _dbContext.Products.Select(p => p.ToProductDto()).ToListAsync();
                return Ok(products);
            }

            if (User.IsInRole("company"))
            {
                // company of the current user;
                var company = await _dbContext.Companies.Include(e => e.Products).FirstOrDefaultAsync(c => c.UserId == User.FindFirstValue(ClaimTypes.NameIdentifier));

                if (company != null)
                {
                    var products = company.Products.Select(p => p.ToProductDto());
                    return Ok(products);
                }

            }
            return ApiResponseHelper.Unauthorized(HttpContext, "Only clients and companies are allowed to see catalog.");
        }

        /// <summary>
        /// Retrieves a specific product by its ID. Companies can retrieve only products that belong to them.
        /// </summary>
        /// <param name="id">Product ID.</param>
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
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _dbContext.Products.Include(e => e.Company).FirstOrDefaultAsync(e => e.Id == id);
            if (product == null)
            {
                return ApiResponseHelper.NotFound(HttpContext, $"Product with ID {id} not found.");
            }

            if (User.IsInRole("company"))
            {
                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var company = await _dbContext.Companies
                    .Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.UserId == currentUserId);

                if (company != null && !company.Products.Any(p => p == product)) // check if user company has that product
                {
                    return ApiResponseHelper.NotFound(HttpContext, $"Product with ID {id} not found.");
                }
            }

            return Ok(product.ToProductDetailDto());
        }

        /// <summary>
        /// Creates a new product. Accessible only to users registered as a company.
        /// </summary>
        /// <param name="model">Product creation data.</param>
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
        public async Task<IActionResult> Create([FromForm] CreateProductDto model)
        {
            var company = (await _dbContext.Companies
                .Include(c => c.Stocks)
                .Include(c => c.PickUpPoints)
                .Include(c => c.Products)
                .FirstOrDefaultAsync(e => e.UserId == User.FindFirstValue(ClaimTypes.NameIdentifier))
            )!;

            if (company.Stocks.Count == 0 || company.PickUpPoints.Count == 0)
            {
                return ApiResponseHelper.BadRequest(HttpContext, "The company must set stocks and pick up points before creating a product.");
            }

            var fileName = await _fileService.SaveFileAsync(model.Image);

            var product = new Product
            {
                Name = model.Name,
                Description = model.Description,
                Size = new Vector(model.SizeX, model.SizeY, model.SizeZ),
                Weight = model.Weight,
                Price = model.Price,
                Image = fileName
            };

            await _dbContext.Products.AddAsync(product);
            company.Products.Add(product);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product.ToProductDetailDto());
        }

        /// <summary>
        /// Edits an existing product owned by the current company. Accessible only to users registered as a company.
        /// </summary>
        /// <param name="id">Product ID.</param>
        /// <param name="model">Updated product data.</param>
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
        public async Task<IActionResult> Edit([FromRoute] int id, [FromForm] EditProductDto model)
        {
            throw new System.Exception("vasya");
            var product = await _dbContext.Products.FindAsync(id);
            if (product == null) return ApiResponseHelper.NotFound(HttpContext, $"Product with ID {id} not found.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var company = await _dbContext.Companies.Include(c => c.Products).FirstOrDefaultAsync(c => c.UserId == userId);
            // check that company edits its own product
            if (company == null || company.Products.FirstOrDefault(p => p.Id == id) == null) return ApiResponseHelper.NotFound(HttpContext, $"Product with ID {id} not found.");

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.Weight = model.Weight;
            product.Size = new Vector(model.SizeX, model.SizeY, model.SizeZ);

            if (model.Image != null)
            {
                var fileName = await _fileService.SaveFileAsync(model.Image);
                product.Image = fileName;
            }

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Deletes a product owned by the current company. Accessible only to users registered as a company.
        /// </summary>
        /// <param name="id">Product ID.</param>
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
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _dbContext.Products.FindAsync(id);
            if (product == null) return ApiResponseHelper.NotFound(HttpContext, $"Product with ID {id} not found.");

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var currentCompany = await _dbContext.Companies
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.UserId == currentUserId);

            if (currentCompany == null || !currentCompany.Products.Any(p => p.Id == id))
            {
                return ApiResponseHelper.NotFound(HttpContext, $"Product with ID {id} not found.");
            }

            _dbContext.Products.Remove(product);
            _fileService.DeleteFile(product.Image);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}

