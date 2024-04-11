using Microsoft.AspNetCore.Mvc;

namespace DeliveryManagement.Controllers
{
    public class MapController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Get()
        {

            return Ok();
        }
    }
}
