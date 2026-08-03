using ClinicBooking.API.Extensions;
using ClinicBooking.Application.DTOs.Payments;
using ClinicBooking.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("initiate")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Initiate(InitiatePaymentRequest request)
        {
            var customerId = User.GetUserId();
            try
            {
                var result = await _paymentService.InitiatePaymentAsync(customerId, request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Called by the frontend's mock payment page after the "customer" clicks Pay/Cancel
        [HttpPost("{paymentId}/callback")]
        [AllowAnonymous]
        public async Task<IActionResult> Callback(Guid paymentId, [FromBody] Dictionary<string, string> callbackParameters)
        {
            try
            {
                var result = await _paymentService.HandleCallbackAsync(paymentId, callbackParameters);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("booking/{bookingId}")]
        [Authorize]
        public async Task<IActionResult> GetByBooking(Guid bookingId)
        {
            var payment = await _paymentService.GetByBookingIdAsync(bookingId);
            if (payment == null) return NotFound();
            return Ok(payment);
        }
    }
}