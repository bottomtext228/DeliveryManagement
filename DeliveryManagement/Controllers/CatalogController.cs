using DeliveryManagement.Models.Catalog;
using Microsoft.AspNetCore.Mvc;
using DeliveryManagement.Models;
using System.Numerics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Linq.Expressions;
using System.Globalization;

namespace DeliveryManagement.Controllers
{
    public class CatalogController : Controller
    {

        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _dbContext;
        public CatalogController(UserManager<User> userManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }
        public IActionResult All()
        {
            return View();
        }

        [Authorize]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateViewModel model)
        {
            if (ModelState.IsValid)
            {

                (float, float, float) productSize;
                float weight;
                float price;
                try
                {                  
                    // server-side checking values
                    productSize = new(float.Parse(model.SizeX, CultureInfo.InvariantCulture), float.Parse(model.SizeY, CultureInfo.InvariantCulture), float.Parse(model.SizeZ, CultureInfo.InvariantCulture));
                    weight = float.Parse(model.Weight, CultureInfo.InvariantCulture);
                    price = float.Parse(model.Price, CultureInfo.InvariantCulture);
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("", "Поля с десятичной дробью содержат ошибки.");
                    return BadRequest(ex.Message);
                }

                var Image = model.Image;

                // if (Image.Length > 0)

                //Convert Image to byte and save to database

                //{

                byte[] p1 = null;
                using (var fs1 = Image.OpenReadStream())
                using (var ms1 = new MemoryStream())
                {
                    fs1.CopyTo(ms1);
                    p1 = ms1.ToArray();
                }

                var product = new Product
                {
                    Name = model.Name,
                    Description = model.Description,
                    SizeX = productSize.Item1,
                    SizeY = productSize.Item2,
                    SizeZ = productSize.Item3,
                    Weight = weight,
                    Price = price,
                    Image = p1
                };

                var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
                if (user != null)
                {
                    if (User.IsInRole("company"))
                    {
                        
                        var company = _dbContext.Companies.FirstOrDefault(e => e.UserId == user.Id);
                        if (company != null)
                        {
                            company.Products.Add(product); // DeliveryManagement.Models.Company.Products.get returned null.
                            _dbContext.SaveChanges();
                        }
                    }


                }
            }

            return View();

        }

    }
}
