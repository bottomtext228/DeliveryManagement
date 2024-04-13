using DeliveryManagement.Models;
using DeliveryManagement.ViewModels.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DeliveryManagement.Controllers
{
    public class AccountController : Controller
    {

        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _dbContext;
        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromForm]RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                User user = new User { Email = model.Email, UserName = model.Email };
                // добавляем пользователя
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {

                    await _userManager.AddToRoleAsync(user, model.AsCompany ? "company" : "client");


                    if (model.AsCompany)
                    {
                        var _user = await _userManager.FindByEmailAsync(model.Email);
                        if (_user != null)
                        {
                            _dbContext.Companies.Add(new Company { Name = model.CompanyName, Description = model.CompanyDescription, UserId = _user.Id });
                            _dbContext.SaveChanges();
                        }
                    }

                    // установка куки
                    await _signInManager.SignInAsync(user, false);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
            }
            return View(model);
        }


        [Authorize]
        public async Task<IActionResult> Profile()
        {


            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (user != null)
            {
                if (User.IsInRole("company"))
                {

                    var company = _dbContext.Companies.FirstOrDefault(e => e.UserId == user.Id);

                    return View(new UserViewModel
                    { Name = company.Name, Email = user.Email, companyDesciption = company.Description, isCompany = true });


                }
                else
                {
                    return View(new UserViewModel { Name = user.UserName, Email = user.UserName, isCompany = false });
                }
            }
            else
            {
                return RedirectToAction("Register", "Account");
            }



        }

        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {
            returnUrl = "Home/Index";
            return View(new LoginViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, true, false);


                if (result.Succeeded)
                {
                    // проверяем, принадлежит ли URL приложению
                    if (!string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl))
                    {
                        return Redirect(model.ReturnUrl);
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Неправильный логин и (или) пароль");
                }
            }

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            // удаляем аутентификационные куки
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
