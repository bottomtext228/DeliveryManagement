using backend.Dtos.Cart;
using backend.Extensions;
using backend.Helpers;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
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