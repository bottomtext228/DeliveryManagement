using backend.Dtos.Cart;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing client cart.
    /// </summary>
    [ApiController]
    [Route("api/cart")]
    [Authorize(Roles = "client")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        /// <summary>
        /// Gets the cart of the currently authenticated user. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns cart</returns>
        /// <response code="200">Cart information.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpGet]
        public async Task<IActionResult> GetByUserId(CancellationToken cancellationToken)
        {
            var userId = User.GetUserId()!;

            var result = await _cartService.GetCartByUserIdAsync(userId, cancellationToken);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.NotFound(HttpContext, error)
            );
        }

        /// <summary>
        /// Sets or updates cart item in the cart of the currently authenticated user. Accessible only to users registered as a client.
        /// </summary>
        /// <param name="model">
        /// Cart item data. 
        /// The <c>Quantity</c> must be in range [1, 99]. 
        /// Set <c>Quantity</c> = 0 to remove the product from the cart.
        /// </param>
        /// <param name="cancellationToken"></param>
        /// <returns>Returns cart</returns>
        /// <response code="200">Cart information.</response>
        /// <response code="400">Bad request or product in cart item is not found.</response>
        /// <response code="401">Unauthorized.</response>
        /// <response code="500">Internal server error.</response>
        [HttpPost]
        public async Task<IActionResult> SetItem([FromBody] CartItemDto model, CancellationToken cancellationToken)
        {
            var userId = User.GetUserId()!;

            var result = await _cartService.SetItemAsync(userId, model, cancellationToken);

            return result.Map(
                onSuccess: Ok,
                onFailure: error => ApiResponseHelper.BadRequest(HttpContext, error)
            );
        }
    }
}