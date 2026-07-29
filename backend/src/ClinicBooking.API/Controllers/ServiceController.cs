using ClinicBooking.API.Extensions;
using ClinicBooking.Application.DTOs.Services;
using ClinicBooking.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceManagementService _serviceManagementService;
        private readonly IBusinessService _businessService;

        public ServiceController(IServiceManagementService serviceManagementService, IBusinessService businessService)
        {
            _serviceManagementService = serviceManagementService;
            _businessService = businessService;
        }

        // Public: list services for a given business (Customer-facing)
        [HttpGet("business/{businessId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByBusiness(Guid businessId)
        {
            var services = await _serviceManagementService.GetByBusinessIdAsync(businessId);
            return Ok(services);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var service = await _serviceManagementService.GetByIdAsync(id);
            if (service == null) return NotFound();
            return Ok(service);
        }

        [HttpPost]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> Create(CreateServiceRequest request)
        {
            var ownerId = User.GetUserId();
            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null) return BadRequest(new { message = "You don't have a business yet." });

            var result = await _serviceManagementService.CreateAsync(business.Id, request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> Update(Guid id, UpdateServiceRequest request)
        {
            var ownerId = User.GetUserId();
            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null) return Forbid();

            try
            {
                var result = await _serviceManagementService.UpdateAsync(id, business.Id, request);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var ownerId = User.GetUserId();
            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null) return Forbid();

            try
            {
                await _serviceManagementService.DeleteAsync(id, business.Id);
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}