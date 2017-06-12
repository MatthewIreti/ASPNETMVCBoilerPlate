using System.Web.Mvc;
using BoilerPlate.Models;

namespace BoilerPlate.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page"; 
            return View();
        } 
    }
}
