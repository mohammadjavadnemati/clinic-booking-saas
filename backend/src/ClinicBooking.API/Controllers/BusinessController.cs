using System.Security.Claims;
using ClinicBooking.Application.DTOs.Business;
using ClinicBooking.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicBooking.API.Extensions;

namespace ClinicBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusinessController : ControllerBase
    {
        private readonly IBusinessService _businessService;

        public BusinessController(IBusinessService businessService)
        {
            _businessService = businessService;
        }

        // Public: anyone can view a business profile (Customer-facing page)
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(Guid id)
        {
            var business = await _businessService.GetByIdAsync(id);
            if (business == null) return NotFound();
            return Ok(business);
        }

        // Business Owner: get their own business
        [HttpGet("my-business")]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> GetMyBusiness()
        {
            var ownerId = User.GetUserId();

            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null) return NotFound(new { message = "No business found for this owner." });
            return Ok(business);
        }

        [HttpPost]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> Create(CreateBusinessRequest request)
        {
            var ownerId = User.GetUserId();

            var result = await _businessService.CreateAsync(ownerId, request);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var businesses = await _businessService.GetAllAsync();
            return Ok(businesses);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> Update(Guid id, UpdateBusinessRequest request)
        {
            var ownerId = User.GetUserId();

            try
            {
                var result = await _businessService.UpdateAsync(id, ownerId, request);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}