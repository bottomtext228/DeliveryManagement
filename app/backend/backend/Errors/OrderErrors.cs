using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Errors
{
    public static class OrderErrors
    {
        private const string Prefix = "Order";
        public static Error MissingProducts(IEnumerable<int> productIds)
        {
            return Error.BadRequest(Prefix, $"The following products with IDs not found: {string.Join(", ", productIds)}");
        }

        public static Error CompanyMismatch()
        {
            return Error.BadRequest(Prefix, "All products must belong to the same company");
        }

        public static Error InvalidQuantity(int productId)
        {
            return Error.BadRequest(Prefix, $"Invalid quantity for product {productId}.");
        }

        public static Error NotFound(int orderId)
        {
            return Error.NotFound(Prefix, $"Order with ID {orderId} not found.");
        }
    }
}