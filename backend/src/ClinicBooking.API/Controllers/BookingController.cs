using ClinicBooking.API.Extensions;
using ClinicBooking.Application.DTOs.Bookings;
using ClinicBooking.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IBusinessService _businessService;

        public BookingController(IBookingService bookingService, IBusinessService businessService)
        {
            _bookingService = bookingService;
            _businessService = businessService;
        }

        // Public: anyone (even not logged in) can check available slots before deciding to log in/register
        [HttpGet("available-slots")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvailableSlots(
            [FromQuery] Guid specialistId,
            [FromQuery] Guid serviceId,
            [FromQuery] DateOnly date)
        {
            var slots = await _bookingService.GetAvailableSlotsAsync(new AvailableSlotsRequest
            {
                SpecialistId = specialistId,
                ServiceId = serviceId,
                Date = date
            });

            return Ok(slots);
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Create(CreateBookingRequest request)
        {
            var customerId = User.GetUserId();
            try
            {
                var result = await _bookingService.CreateBookingAsync(customerId, request);
                return CreatedAtAction(nameof(GetMyBookings), result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("my-bookings")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyBookings()
        {
            var customerId = User.GetUserId();
            var bookings = await _bookingService.GetCustomerBookingsAsync(customerId);
            return Ok(bookings);
        }

        [HttpGet("business-bookings")]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> GetBusinessBookings(
            [FromQuery] DateOnly? date,
            [FromQuery] Guid? specialistId,
            [FromQuery] string? status)
        {
            var ownerId = User.GetUserId();
            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null) return Ok(new List<BookingDto>());

            var bookings = await _bookingService.GetBusinessBookingsAsync(business.Id, new BookingFilterRequest
            {
                Date = date,
                SpecialistId = specialistId,
                Status = status
            });

            return Ok(bookings);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "BusinessOwner")]
        public async Task<IActionResult> UpdateStatus(Guid id, UpdateBookingStatusRequest request)
        {
            var ownerId = User.GetUserId();
            var business = await _businessService.GetByOwnerIdAsync(ownerId);
            if (business == null) return Forbid();

            try
            {
                var result = await _bookingService.UpdateStatusAsync(id, business.Id, request);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}