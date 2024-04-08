using DeliveryManagement.Models;
using DeliveryManagement.Models.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DeliveryManagement.Controllers
{
    public class AccountController : Controller
    {

        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly CompanyDbContext _dbContext;
        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, CompanyDbContext dbContext)
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
        public async Task<IActionResult> Register(RegisterViewModel model) 
        {
            if (ModelState.IsValid)
            {
                User user = new User { Email = model.Email, UserName = model.Email };
                // добавляем пользователя
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
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
            var result = await _userManager.FindByEmailAsync(User.Identity.Name);

      
            if (User.Identity.IsAuthenticated)
            {

                if (User.IsInRole("company"))
                {

                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    var userName = User.FindFirstValue(ClaimTypes.Name);
                    var email = User.FindFirstValue(ClaimTypes.Email);



                    var company = _dbContext.Companies.FirstOrDefault(e => e.User == result);
                    return View(new UserViewModel 
                    { Name = company.Name, Email = email, companyDesciption = company.Description, isCompany = true});


                }

                return View(new UserViewModel { Name = result.UserName, Email = result.UserName, isCompany = false });
             
            }
            return RedirectToAction("Register", "Account");
        }

        [HttpGet]
        public IActionResult Login(string returnUrl = null)
        {
            returnUrl = "Home/Index";
            return View(new LoginViewModel{ ReturnUrl = returnUrl});
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);

                Console.WriteLine(result.Succeeded);
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
            } else
            {
                Console.WriteLine("Invalid");
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
