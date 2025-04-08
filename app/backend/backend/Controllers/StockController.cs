using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Dtos.Map;
using backend.Dtos.Stock;
using backend.Models.Map;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/stock")]
    [Authorize]

    public class StockController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public StockController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Gets all stocks of the company
        /// </summary>
        /// 
        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAll()
        {
            var companyId = int.Parse(User.FindFirstValue("CompanyId")!);
            var stocks = _dbContext.Stocks.Where(s => s.CompanyId == companyId).Select(s => new GetStocksDto { Id = s.Id, CompanyId = s.CompanyId, TownId = s.TownId });
            var list = await stocks.ToListAsync();
            return Ok(list);
        }

        /// <summary>
        /// Sets all pick up points of the company
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST api/stock
        ///     [
        ///         1,
        ///         5,
        ///         7
        ///     ]
        ///
        /// </remarks>
        [HttpPut]
        [Authorize(Roles = "company")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Consumes("application/json")]
        public async Task<IActionResult> Set([FromBody] List<int> townIds)
        {
            // TODO: check that town exists
            var companyId = int.Parse(User.FindFirstValue("CompanyId")!);

            await _dbContext.Stocks.Where(p => p.CompanyId == companyId).ExecuteDeleteAsync();
            townIds.ForEach(async townId => await _dbContext.Stocks.AddAsync(new Stock { CompanyId = companyId, TownId = townId }));
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

    }
}