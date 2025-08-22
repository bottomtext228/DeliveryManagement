using backend.Dtos.Order;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing orders made by clients.
    /// </summary>
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Creates a new order for one or more products with a specified pick up point and shipping preference. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="model">Details of the order including product IDs, quantities, and pickup point.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns the created order dto or an error if validation fails.</returns>
        /// <response code="201">Order successfully created.</response>
        /// <response code="400">Validation error or products, pickup point, quantity not found.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by clients.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost]
        [Authorize(Roles = "client")]
        [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto model, CancellationToken cancellationToken)
        {
            var userId = User.GetUserId()!;

            var result = await _orderService.CreateAsync(model, userId, cancellationToken);

            return result.Map(
                onSuccess: value => Created(string.Empty, value),
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }

        /// <summary>
        /// Retrieves all orders made by the authenticated client. Accessible only to users registered as a client.
        /// </summary>
        /// <returns>A list of orders.</returns>
        /// <response code="200">Orders successfully retrieved.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by clients.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        [Authorize(Roles = "client")]
        [ProducesResponseType(typeof(List<OrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            var userId = User.GetUserId()!;

            var result = await _orderService.GetAllAsync(userId, cancellationToken);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }

        /// <summary>
        /// Deletes an order by its ID. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="id">ID of the order to delete.</param>
        /// <param name="cancellationToken"></param>
        /// <returns>No content on success.</returns>
        /// <response code="204">Order successfully deleted.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="403">Forbidden. Method used only by clients.</response>
        /// <response code="404">Order not found.</response>
        /// <response code="500">Internal server error.</response>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "client")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
        {
            var currentUserId = User.GetUserId()!;

            var result = await _orderService.DeleteAsync(id, currentUserId, cancellationToken);

            return result.Map(
                onSuccess: NoContent,
                onFailure: error => ApiResponseHelper.NotFound(HttpContext, error)
            );
        }
    }
}