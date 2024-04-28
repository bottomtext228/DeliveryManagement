using Microsoft.AspNetCore.Mvc;
using DeliveryManagement.Models;
using System.Numerics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Linq.Expressions;
using System.Globalization;
using System.Diagnostics.Eventing.Reader;
using DeliveryManagement.ViewModels.Catalog;

namespace DeliveryManagement.Controllers
{
    [Authorize]
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
            if (User.IsInRole("client"))
            {
                var products = _dbContext.Products.ToList();
                AllProductViewModel allProductViewModel = new AllProductViewModel();
                foreach (var product in products)
                {
                    allProductViewModel.Products.Add(new ProductSmallViewModel { Id = product.Id, Name = product.Name, Price = product.Price, ImageBase64 = Convert.ToBase64String(product.Image) });
                }
                return View(allProductViewModel);
            }

            if (User.IsInRole("company"))
            {
                // company of the current user;
                var company = _dbContext.Companies.Include(e => e.Products).FirstOrDefault(c => c.UserId == User.FindFirstValue(ClaimTypes.NameIdentifier));

                if (company != null)
                {
                    var products = company.Products.ToList();
                    AllProductViewModel allProductViewModel = new AllProductViewModel();
                    foreach (var product in products)
                    {
                        allProductViewModel.Products.Add(new ProductSmallViewModel { Id = product.Id, Name = product.Name, Price = product.Price, ImageBase64 = Convert.ToBase64String(product.Image) });
                    }
                    return View(allProductViewModel);
                }
                // display company products. button to add new

            }
            return View();
        }

        [HttpGet]
        public IActionResult Get(int? id)
        {
            if (id != null)
            {
                var product = _dbContext.Products.FirstOrDefault(p => p.Id == id);
                if (product != null)
                {
                    if (User.IsInRole("company"))
                    {
                        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                        var company = _dbContext.Companies.Include(c => c.Products).FirstOrDefault(c => c.UserId == currentUserId);
                        if (company != null && !company.Products.Any(p => p == product))
                        {
                            return View(); // do not allow other companies to see product.
                        }
                    } // while usual user can see all products.

                    GetProductViewModel model = new GetProductViewModel
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Description = product.Description,
                        Price = product.Price,
                        Weight = product.Weight,
                        Size = product.Size,
                        ImageBase64 = Convert.ToBase64String(product.Image),
                        IsCompany = User.IsInRole("company")
                    };
                    return View(model);
                }
            }
            return View();
        }

        [HttpGet]
        [Authorize(Roles = "company")]
        public IActionResult Edit(int? id)
        {

            if (id == null)
                return BadRequest();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var company = _dbContext.Companies.Include(c => c.Products).FirstOrDefault(c => c.UserId == userId);
            if (company == null)
                return BadRequest();
            var product = company.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return View();


            EditViewModel model = new EditViewModel
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price.ToString(),
                Weight = product.Weight.ToString(),
                SizeX = product.Size.X.ToString(),
                SizeY = product.Size.Y.ToString(),
                SizeZ = product.Size.Z.ToString(),
            };
            ViewData["ImageBase64"] = Convert.ToBase64String(product.Image);
            //RedirectToAction("Edit");
            //return Ok();
            return View(model);
        }
        [HttpPost]
        [Authorize(Roles = "company")]
        public IActionResult Edit(int? id, EditViewModel model)
        {

            if (id == null || !ModelState.IsValid)
                return BadRequest();
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var company = _dbContext.Companies.Include(c => c.Products).FirstOrDefault(c => c.UserId == userId);
            if (company == null)
                return BadRequest();
            var product = company.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
                return BadRequest();



            Vector3 productSize;
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


            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = price;
            product.Weight = weight;
            product.Size = productSize;

            var Image = model.Image;

            if (Image != null && Image.Length > 0)
            {
                //Convert Image to byte and save to database

                byte[] ImageBytes = null;
                using (var fs1 = Image.OpenReadStream())
                using (var ms1 = new MemoryStream())
                {
                    fs1.CopyTo(ms1);
                    ImageBytes = ms1.ToArray();
                }

                product.Image = ImageBytes;
            }

            _dbContext.SaveChanges();

            return RedirectToAction("Get", "Catalog", new { id = product.Id });
        }
        [HttpPost]
        [Authorize(Roles = "company")]
        public IActionResult Delete(int? id)
        {
            if (id != null)
            {
                var product = _dbContext.Products.FirstOrDefault(p => p.Id == id); // get product from request id

                var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier); // get current logged-in user
                if (currentUserId != null)
                {
                    // get company of that user and check if it has product with that id
                    var currentCompany = _dbContext.Companies.Include(c => c.Products).FirstOrDefault(c => c.UserId == currentUserId);
                    if (currentCompany != null && currentCompany.Products.FirstOrDefault(p => p.Id == id) != null)
                    {
                        _dbContext.Products.Remove(product); // delete it
                        _dbContext.SaveChanges();
                        return Ok();
                    }
                }
            }
            return BadRequest();
        }
        [Authorize(Roles = "company")]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [Authorize(Roles = "company")]
        public async Task<IActionResult> Create(CreateViewModel model)
        {
            if (ModelState.IsValid)
            {

                Vector3 productSize;
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

                if (Image.Length <= 0)
                    return BadRequest();

                //Convert Image to byte and save to database
                byte[] ImageBytes = null;
                using (var fs1 = Image.OpenReadStream())
                using (var ms1 = new MemoryStream())
                {
                    fs1.CopyTo(ms1);
                    ImageBytes = ms1.ToArray();
                }

                var product = new Product
                {
                    Name = model.Name,
                    Description = model.Description,
                    Size = productSize,              
                    Weight = weight,
                    Price = price,
                    Image = ImageBytes
                };

                var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
                if (user != null)
                {
                    var company = _dbContext.Companies.Include(c => c.Products).FirstOrDefault(e => e.UserId == user.Id);
                    if (company != null)
                    {
                        _dbContext.Products.Add(product);
                        company.Products.Add(product);
                        _dbContext.SaveChanges();
                    }
                }
            }

            return RedirectToAction("All");

        }

    }
}
