using backend.Dtos.Order;
using backend.Errors;
using backend.Interfaces.Services;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly TownsGraphSearch _graphSearch;
        private readonly CountryMap _countryMap;
        public OrderService(ApplicationDbContext dbContext, TownsGraphSearch graphSearch, CountryMap countryMap)
        {
            _dbContext = dbContext;
            _graphSearch = graphSearch;
            _countryMap = countryMap;
        }

        public async Task<Result<OrderDto>> CreateAsync(CreateOrderDto model, string userId)
        {
            var pickUpPoint = _countryMap.Towns.Find(t => t.Id == model.PickUpPointTownId);
            if (pickUpPoint == null)
            {
                return PickUpPointErrors.NotFound(model.PickUpPointTownId);
            }

            var productIds = model.Products.Select(p => p.ProductId).ToList();

            // Fetch all products in one query
            var products = await _dbContext.Products
                .Include(p => p.Company)
                .ThenInclude(c => c.Stocks)
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            // Check all products exist
            if (products.Count != model.Products.Count)
            {
                // if not then tell the user which products are missing

                var foundProductIds = products.Select(p => p.Id).ToHashSet();
                var missingProductIds = productIds.Where(id => !foundProductIds.Contains(id)).ToList();

                return OrderErrors.MissingProducts(missingProductIds);
            }

            // Check all products belong to the same company
            var distinctCompanyIds = products.Select(p => p.CompanyId).Distinct().ToList();
            if (distinctCompanyIds.Count > 1)
                return OrderErrors.CompanyMismatch();

            var company = products.First().Company;

            // Get towns with stock
            var townIdsWithStock = company.Stocks.Select(s => s.TownId).ToList();
            var towns = townIdsWithStock.Select(id => _countryMap.Towns.Find(t => t.Id == id)!).ToList();

            var route = _graphSearch.ComputeRoute(towns, pickUpPoint);
            var chosenRoute = model.Choice == RouteChoice.Fastest ? route.Fastest : route.Cheapest;

            var order = new Order
            {
                UserId = userId,
                ShippingPrice = chosenRoute.Price,
                ShippingTime = chosenRoute.Time,
                TownIds = chosenRoute.Towns.Select(t => t.Id).ToList(),
                Items = []
            };

            float totalProductPrice = 0;

            foreach (var productOrder in model.Products)
            {
                if (productOrder.Quantity <= 0) return OrderErrors.InvalidQuantity(productOrder.ProductId);

                var product = products.First(p => p.Id == productOrder.ProductId);

                var item = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = productOrder.Quantity,
                    ProductPrice = product.Price
                };

                order.Items.Add(item);
                totalProductPrice += product.Price * productOrder.Quantity;
            }

            order.FinalPrice = totalProductPrice + order.ShippingPrice;

            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();

            return order.ToOrderDto(_countryMap.Towns);
        }

        public async Task<Result<IEnumerable<OrderDto>>> GetAllAsync(string userId)
        {
            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null) return AccountErrors.NotFound(userId);
            
            var orders = await _dbContext.Orders
                .Include(e => e.Items)
                .ThenInclude(e => e.Product)
                .Where(e => e.UserId == userId)
                .Select(e => e.ToOrderDto(_countryMap.Towns))
                .ToListAsync();
            return orders;
        }

        public async Task<Result> DeleteAsync(int orderId, string userId)
        {
            var result = await _dbContext.Orders.Where(e => e.Id == orderId && e.UserId == userId).ExecuteDeleteAsync();
            if (result != 1) return OrderErrors.NotFound(orderId);

            return Result.Success();
        }
    }
}