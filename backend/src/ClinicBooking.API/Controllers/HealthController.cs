using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "Backend is running", timestamp = DateTime.UtcNow });
        }
    }
}