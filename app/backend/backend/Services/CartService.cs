using backend.Dtos.Cart;
using backend.Errors;
using backend.Interfaces.Services;
using backend.Mappers;
using backend.Models.Cart;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CartService : ICartService
    {
        private readonly ApplicationDbContext _dbContext;
        public CartService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Result<CartDto>> GetCartByUserIdAsync(string userId, CancellationToken cancellationToken = default)
        {
            var cart = await _dbContext.Carts
                .Where(e => e.UserId == userId)
                .Include(e => e.CartItems.OrderBy(e => e.Id))
                .FirstOrDefaultAsync(cancellationToken);
            if (cart is null)
            {
                // create empty card
                cart = new Cart
                {
                    UserId = userId
                };
                _dbContext.Carts.Add(cart);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }

            // check if products in cart were deleted
            var productIds = cart.CartItems.Select(e => e.ProductId).ToList();

            var existingProductIds = await _dbContext.Products
                .Where(e => productIds.Contains(e.Id))
                .Select(e => e.Id)
                .ToListAsync(cancellationToken);

            var invalidItems = cart.CartItems
                .Where(e => !existingProductIds.Contains(e.ProductId))
                .ToList();

            if (invalidItems.Count > 0)
            {
                _dbContext.CartItems.RemoveRange(invalidItems);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }

            return cart.ToCartDto();
        }

        public async Task<Result<CartDto>> SetItemAsync(string userId, CartItemDto item, CancellationToken cancellationToken = default)
        {
            // check if product exists
            var product = await _dbContext.Products.FindAsync([item.ProductId], cancellationToken);
            if (product is null) return ProductErrors.NotFound(item.ProductId);

            // quantity checked via Data Annotations in dto class

            // check cart existance for specified user
            var cart = await _dbContext.Carts
                .Include(e => e.CartItems.OrderBy(e => e.Id))
                .FirstOrDefaultAsync(e => e.UserId == userId, cancellationToken);
            if (cart is null)
            {
                // create new cart and place cart item there
                var cartItem = new CartItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                };

                cart = new Cart
                {
                    UserId = userId,
                    CartItems = [cartItem]
                };

                _dbContext.Add(cart);
            }
            else
            {
                var oldCartItem = cart.CartItems.FirstOrDefault(e => e.ProductId == item.ProductId);

                if (oldCartItem is null)
                {
                    // create new cart item if not present in cart
                    if (item.Quantity > 0)
                    {
                        var cartItem = new CartItem
                        {
                            ProductId = item.ProductId,
                            Quantity = item.Quantity
                        };

                        cart.CartItems.Add(cartItem);
                    }
                }
                else
                {
                    // otherwise just update the old cart item
                    if (item.Quantity == 0)
                    {
                        cart.CartItems.Remove(oldCartItem);
                    }
                    else
                    {
                        oldCartItem.Quantity = item.Quantity;
                    }
                }
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            return cart.ToCartDto();
        }
    }
}