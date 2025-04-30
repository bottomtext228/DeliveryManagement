using backend.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/company")]
    public class CompanyController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public CompanyController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("{id:int}")]
        [Authorize(Roles = "client")]
        public async Task<IActionResult> Get(int id)
        {
            var company = await _dbContext.Companies.FindAsync(id);
            if (company == null) return BadRequest();

            return Ok(company.ToCompanyDto());
        }
    }
}