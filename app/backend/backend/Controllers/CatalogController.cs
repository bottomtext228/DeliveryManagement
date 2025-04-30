using System.Security.Claims;
using backend.Dtos.Catalog;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/catalog")]
    [ApiController]
    [Authorize]
    public class CatalogController : ControllerBase
    {

        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly IFileService _fileService;
        public CatalogController(UserManager<User> userManager, ApplicationDbContext dbContext, IFileService fileService)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (User.IsInRole("client"))
            {
                var products = await _dbContext.Products.Select(p => p.ToProductDto()).ToListAsync();
                return Ok(products);
            }

            if (User.IsInRole("company"))
            {
                // company of the current user;
                var company = await _dbContext.Companies.Include(e => e.Products).FirstOrDefaultAsync(c => c.UserId == User.FindFirstValue(ClaimTypes.NameIdentifier));

                if (company != null)
                {
                    var products = company.Products.Select(p => p.ToProductDto());
                    return Ok(products);
                }

            }
            return BadRequest();
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {

            var product = await _dbContext.Products.Include(e => e.Company).FirstOrDefaultAsync(e => e.Id == id);
            if (product != null)
            {
                if (User.IsInRole("company"))
                {
                    var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    var company = await _dbContext.Companies.Include(c => c.Products).FirstOrDefaultAsync(c => c.UserId == currentUserId);
                    if (company != null && !company.Products.Any(p => p == product)) // check that company has product with that id
                    {
                        return NotFound(); // do not allow other companies to see product.
                    }
                } // while usual user can see all products.

                return Ok(product.ToProductDetailDto());
            }

            return NotFound();
        }

        [HttpPost]
        [Authorize(Roles = "company")]
        public async Task<IActionResult> Create([FromForm] CreateProductDto model)
        {
            var company = await _dbContext.Companies.Include(c => c.Products).FirstOrDefaultAsync(e => e.UserId == User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (company == null) return BadRequest();

            var fileName = await _fileService.SaveFileAsync(model.Image);




            var product = new Product
            {
                Name = model.Name,
                Description = model.Description,
                Size = new Vector(model.SizeX, model.SizeY, model.SizeZ),
                Weight = model.Weight,
                Price = model.Price,
                Image = fileName
            };



            await _dbContext.Products.AddAsync(product);
            company.Products.Add(product);
            await _dbContext.SaveChangesAsync();
            return Created();
        }


        /*   [HttpPost]
          [Authorize(Roles = "company")]
          public async Task<IActionResult> Create([FromForm]CreateProductDto model)
          {
              var company = await _dbContext.Companies.Include(c => c.Products).FirstOrDefaultAsync(e => e.UserId == User.FindFirstValue(ClaimTypes.NameIdentifier));
              if (company == null) return BadRequest();

              var Image = model.Image;

              if (Image.Length <= 0 || !(
                  Image.ContentType.Equals("image/png", StringComparison.OrdinalIgnoreCase) ||
                  Image.ContentType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase) ||
                  Image.ContentType.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase)))
                  return Problem("Bad image value", statusCode: StatusCodes.Status400BadRequest);

              //Convert Image to byte and save to database
              byte[]? ImageBytes = null;
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
                  Size = new Vector(model.SizeX, model.SizeY, model.SizeZ),
                  Weight = model.Weight,
                  Price = model.Price,
                  Image = ImageBytes
              };



              await _dbContext.Products.AddAsync(product);
              company.Products.Add(product);
              await _dbContext.SaveChangesAsync();
              return Created();
          } */
        [HttpPut("{id:int}")]
        [Authorize(Roles = "company")]
        public async Task<IActionResult> Edit([FromRoute] int id, [FromForm] EditProductDto model)
        {
            var product = await _dbContext.Products.FindAsync(id);
            if (product == null) return NotFound();


            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var company = await _dbContext.Companies.Include(c => c.Products).FirstOrDefaultAsync(c => c.UserId == userId);
            if (company == null) return BadRequest();
            if (company.Products.FirstOrDefault(p => p.Id == id) == null) return BadRequest(); // check that company edits its own product

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.Weight = model.Weight;
            product.Size = new Vector(model.SizeX, model.SizeY, model.SizeZ);

            if (model.Image != null)
            {
                var fileName = await _fileService.SaveFileAsync(model.Image);
                product.Image = fileName;
            }

            /*          var Image = model.Image;
                     if (Image != null)
                     {

                         if (Image.Length <= 0 || !(
                             Image.ContentType.Equals("image/png", StringComparison.OrdinalIgnoreCase) ||
                             Image.ContentType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase) ||
                             Image.ContentType.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase)))
                             return Problem("Bad image value", statusCode: StatusCodes.Status400BadRequest);
                         //Convert Image to byte and save to database
                         byte[]? ImageBytes = null;
                         using (var fs1 = Image.OpenReadStream())
                         using (var ms1 = new MemoryStream())
                         {
                             fs1.CopyTo(ms1);
                             ImageBytes = ms1.ToArray();
                         }
                         product.Image = ImageBytes;
                     }
          */
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "company")]
        public async Task<IActionResult> Delete(int id)
        {

            var product = await _dbContext.Products.FindAsync(id);
            if (product == null) return NotFound();

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier); // get current logged-in user
            if (currentUserId != null)
            {
                // get company of that user and check if it has product with that id
                var currentCompany = await _dbContext.Companies.Include(c => c.Products).FirstOrDefaultAsync(c => c.UserId == currentUserId);
                if (currentCompany != null && currentCompany.Products.FirstOrDefault(p => p.Id == id) != null)
                {
                    _dbContext.Products.Remove(product); // delete it
                    await _dbContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }

        /*   public IActionResult All()
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
                  Price = product.Price,
                  Weight = product.Weight,
                  SizeX = product.Size.X,
                  SizeY = product.Size.Y,
                  SizeZ = product.Size.Z,
                  OldImageBase64 = Convert.ToBase64String(product.Image)
              };

              return View(model);
          }
          [HttpPost]
          [Authorize(Roles = "company")]
          public IActionResult Edit(int? id, EditViewModel model)
          {

              if (id == null)
                  return View();

              var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
              var company = _dbContext.Companies.Include(c => c.Products).FirstOrDefault(c => c.UserId == userId);
              if (company == null)
                  return BadRequest();
              var product = company.Products.FirstOrDefault(p => p.Id == id);
              if (product == null)
                  return View();

              if (!ModelState.IsValid)
                  return View(model);



              product.Name = model.Name;
              product.Description = model.Description;
              product.Price = model.Price;
              product.Weight = model.Weight;
              product.Size = new Vector(model.SizeX, model.SizeY, model.SizeZ);

              var Image = model.Image;


              if (Image != null)
              {

                  if (Image.Length <= 0 || !(
                      Image.ContentType.Equals("image/png", StringComparison.OrdinalIgnoreCase) ||
                      Image.ContentType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase) ||
                      Image.ContentType.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase)))
                      return BadRequest();
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

                  var Image = model.Image;

                  if (Image.Length <= 0 || !(
                      Image.ContentType.Equals("image/png", StringComparison.OrdinalIgnoreCase) ||
                      Image.ContentType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase) ||
                      Image.ContentType.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase)))
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
                      Size = new Vector(model.SizeX, model.SizeY, model.SizeZ),
                      Weight = model.Weight,
                      Price = model.Price,
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
                          return RedirectToAction("All");
                      }
                  }
              }
              return View(model);


          } */

    }
}
