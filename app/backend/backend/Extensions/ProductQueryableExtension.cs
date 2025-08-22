using backend.Dtos.Catalog;
using backend.Dtos.Common;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Extensions
{
    public static class ProductQueryableExtension
    {
        public static IQueryable<Product> ApplyFiltering(this IQueryable<Product> queryable, ProductQueryDto query)
        {
            if (!string.IsNullOrEmpty(query.Name))
            {
                queryable = queryable.Where(e => EF.Functions.ILike(e.Name, $"%{query.Name}%"));
            }

            if (query.MinPrice.HasValue)
            {
                queryable = queryable.Where(e => e.Price >= query.MinPrice);
            }

            if (query.MaxPrice.HasValue)
            {
                queryable = queryable.Where(e => e.Price <= query.MaxPrice);
            }

            return queryable;
        }

        public static IQueryable<Product> ApplySorting(this IQueryable<Product> queryable, ProductQueryDto query)
        {
            queryable = query.SortBy switch
            {
                ProductSortBy.Price => query.IsDescending ? queryable.OrderByDescending(e => e.Price) : queryable.OrderBy(e => e.Price),
                ProductSortBy.Name => query.IsDescending ? queryable.OrderByDescending(e => e.Name) : queryable.OrderBy(e => e.Name),
                _ => queryable.OrderBy(e => e.Id)
            };

            return queryable;
        }

        public static async Task<PaginatedResponse<ProductDto>> ToPaginationResponseAsync(this IQueryable<Product> queryable, ProductQueryDto query, CancellationToken cancellationToken = default)
        {
            var totalCount = await queryable.CountAsync(cancellationToken);
            var totalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize);

            var products = await queryable
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(p => p.ToProductDto())
                .ToListAsync(cancellationToken);

            var response = new PaginatedResponse<ProductDto>
            {
                Data = products,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
            return response;
        }

    }
}