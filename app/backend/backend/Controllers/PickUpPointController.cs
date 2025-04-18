using System.Security.Claims;
using backend.Dtos.PickUpPoint;
using backend.Models.Map;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/pickuppoint")]
    public class PickUpPointController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        public PickUpPointController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Gets all pick up points of the company
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "company")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAll()
        {
            var companyId = int.Parse(User.FindFirstValue("CompanyId")!);
            return Ok(await _dbContext.PickUpPoints.Where(p => p.CompanyId == companyId).Select(p =>
            new GetPickUpPointsDto { Id = p.Id, CompanyId = p.CompanyId, TownId = p.TownId }).ToListAsync());
        }

        /// <summary>
        /// Sets all pick up points of the company
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST api/pickuppoint
        ///     [
        ///         1,
        ///         5,
        ///         7
        ///     ]
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

            await _dbContext.PickUpPoints.Where(p => p.CompanyId == companyId).ExecuteDeleteAsync();
            townIds.ForEach(async townId => await _dbContext.PickUpPoints.AddAsync(new PickUpPoint { CompanyId = companyId, TownId = townId }));
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }


        /// <summary>
        /// Get pick up points of the company by company id
        /// </summary>
        [HttpGet("{companyId:int}")]
        [Authorize(Roles = "client")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetByCompanyId(int companyId)
        {
            var pickUpPoints = await _dbContext.PickUpPoints.Where(p => p.CompanyId == companyId).ToListAsync();
            return Ok(pickUpPoints);
        }

    }
}