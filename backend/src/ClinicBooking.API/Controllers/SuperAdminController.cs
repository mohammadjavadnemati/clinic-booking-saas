using ClinicBooking.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminController : ControllerBase
    {
        private readonly IBusinessService _businessService;

        public SuperAdminController(IBusinessService businessService)
        {
            _businessService = businessService;
        }

        // Lists every business on the platform — useful for a future "platform owner" dashboard
        [HttpGet("businesses")]
        public async Task<IActionResult> GetAllBusinesses()
        {
            var businesses = await _businessService.GetAllAsync();
            return Ok(businesses);
        }
    }
}