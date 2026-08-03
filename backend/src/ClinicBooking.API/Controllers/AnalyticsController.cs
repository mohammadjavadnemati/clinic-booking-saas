using ClinicBooking.API.Extensions;
using ClinicBooking.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "BusinessOwner")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly IBusinessService _businessService;

        public AnalyticsController(IAnalyticsService analyticsService, IBusinessService businessService)
        {
            _analyticsService = analyticsService;
            _businessService = businessService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var ownerId = User.GetUserId();
            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null)
                return NotFound(new { message = "No business found for this owner." });

            var stats = await _analyticsService.GetDashboardStatsAsync(business.Id);
            return Ok(stats);
        }
    }
}