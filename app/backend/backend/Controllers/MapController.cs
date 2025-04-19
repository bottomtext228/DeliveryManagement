using System.Security.Claims;
using backend.Dtos.Map;
using backend.Services;
using backend.Models.Map;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/map")]
    [Authorize]
    public class MapController : ControllerBase
    {
        private readonly CountryMap _countryMap;
        private readonly TownsGraphSearch _graphSearch;
        private readonly ApplicationDbContext _dbContext;
        public MapController(CountryMap countryMap, TownsGraphSearch graphSearch, ApplicationDbContext dbContext)
        {
            _countryMap = countryMap;
            _graphSearch = graphSearch;
            _dbContext = dbContext;
        }

        [HttpGet("towns")]
        public IActionResult GetMap()
        {
            return Ok(_countryMap.Towns);
        }
        [HttpGet("roads")]
        public IActionResult GetRoads()
        {


            int[,] array = _countryMap.Graph.CreateAdjacencyMatrix();

            // Convert to jagged array for JSON serialization
            var jaggedArray = new int[array.GetLength(0)][];
            for (int i = 0; i < array.GetLength(0); i++)
            {
                jaggedArray[i] = new int[array.GetLength(1)];
                for (int j = 0; j < array.GetLength(1); j++)
                {
                    jaggedArray[i][j] = array[i, j];
                }
            }

            return Ok(jaggedArray);
        }

        [HttpPost("stocks")]
        [Authorize(Roles = "company")]
        public async Task<IActionResult> SetCompanyStocks([FromBody] StocksDto dto)
        {

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var company = await _dbContext.Companies.Include(c => c.Products).FirstOrDefaultAsync(c => c.UserId == currentUserId);

            company.Stocks.Clear();
            dto.TownIds.ToList().ForEach(townId => company.Stocks.Add(new Stock { Company = company, TownId = townId }));
            await _dbContext.SaveChangesAsync();
            return Ok();
        }


        [HttpPost("pickuppoints")]
        [Authorize(Roles = "company")]
        public async Task<IActionResult> SetCompanyPickUpPoints([FromBody] PickUpPointsDto dto)
        {

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var company = await _dbContext.Companies.Include(c => c.Products).FirstOrDefaultAsync(c => c.UserId == currentUserId);

            company.PickUpPoints.Clear();
            dto.TownIds.ToList().ForEach(townId => company.PickUpPoints.Add(new PickUpPoint { Company = company, TownId = townId }));
            await _dbContext.SaveChangesAsync();
            return Ok();
        }



    }
}