using ClinicBooking.API.Extensions;
using ClinicBooking.Application.DTOs.Specialists;
using ClinicBooking.Application.DTOs.WorkingHours;
using ClinicBooking.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecialistController : ControllerBase
    {
        private readonly ISpecialistService _specialistService;
        private readonly IBusinessService _businessService;

        public SpecialistController(ISpecialistService specialistService, IBusinessService businessService)
        {
            _specialistService = specialistService;
            _businessService = businessService;
        }

        [HttpGet("business/{businessId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByBusiness(Guid businessId)
        {
            var specialists = await _specialistService.GetByBusinessIdAsync(businessId);
            return Ok(specialists);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var specialist = await _specialistService.GetByIdAsync(id);
            if (specialist == null) return NotFound();
            return Ok(specialist);
        }

        [HttpGet("{id}/working-hours")]
        [AllowAnonymous]
        public async Task<IActionResult> GetWorkingHours(Guid id)
        {
            var hours = await _specialistService.GetWorkingHoursAsync(id);
            return Ok(hours);
        }

        [HttpPost]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> Create(CreateSpecialistRequest request)
        {
            var ownerId = User.GetUserId();
            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null) return BadRequest(new { message = "You don't have a business yet." });

            var result = await _specialistService.CreateAsync(business.Id, request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> Update(Guid id, UpdateSpecialistRequest request)
        {
            var ownerId = User.GetUserId();
            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null) return Forbid();

            try
            {
                var result = await _specialistService.UpdateAsync(id, business.Id, request);
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
                await _specialistService.DeleteAsync(id, business.Id);
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPut("{id}/working-hours")]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> SetWorkingHours(Guid id, SetWorkingHoursRequest request)
        {
            var ownerId = User.GetUserId();
            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null) return Forbid();

            try
            {
                await _specialistService.SetWorkingHoursAsync(id, business.Id, request);
                return Ok(new { message = "Working hours updated successfully." });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}