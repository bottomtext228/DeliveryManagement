//using DeliveryManagement.Models;
//using Microsoft.AspNetCore.Authentication;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc.Filters;
//using System.Security.Claims;

//namespace DeliveryManagement.Filters
//{
//    public class ValidateUserFilter : IAsyncAuthorizationFilter
//    {
//        private readonly UserManager<User> _userManager;
//        private readonly SignInManager<User> _signInManager;
//        private const string Scheme = "Bearer";
//        public ValidateUserFilter(UserManager<User> useManager, SignInManager<User> signInManager)
//        {
//            _userManager = useManager;
//            _signInManager = signInManager;
//        }

//        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
//        {
//            var currentUser = context.HttpContext.User;
//            if (currentUser != null && currentUser.Identity.IsAuthenticated)
//            {
//                var user = await _userManager.FindByIdAsync(currentUser.FindFirstValue(ClaimTypes.NameIdentifier));

//                if (user == null)
//                {
//                    return 
//                }
//                else
//                {

//                    var claims = new[]
//        {
//            new Claim(ClaimTypes.NameIdentifier, user.Id),
//            new Claim(ClaimTypes.Name, user.UserName)
//        };

//                    var identity = new ClaimsIdentity(claims, Scheme);

//                    var principal = new ClaimsPrincipal(identity);

//                    var ticket = new AuthenticationTicket(principal, Scheme);

//                    var authenticateResult = AuthenticateResult.Success(ticket);

//                    return authenticateResult;


//                }


//            } else
//            {
//                return AuthenticateResult.Fail("No token");
//            }

//        }
//    }
//}
