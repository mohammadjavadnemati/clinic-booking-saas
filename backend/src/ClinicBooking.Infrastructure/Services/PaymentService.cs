using ClinicBooking.Application.DTOs.Payments;
using ClinicBooking.Application.Interfaces;
using ClinicBooking.Domain.Entities;
using ClinicBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ClinicBooking.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPaymentGateway _paymentGateway;
        private readonly IConfiguration _configuration;

        public PaymentService(ApplicationDbContext context, IPaymentGateway paymentGateway, IConfiguration configuration)
        {
            _context = context;
            _paymentGateway = paymentGateway;
            _configuration = configuration;
        }

        public async Task<InitiatePaymentResponse> InitiatePaymentAsync(Guid customerId, InitiatePaymentRequest request)
        {
            var booking = await _context.Bookings
                .Include(b => b.Service)
                .FirstOrDefaultAsync(b => b.Id == request.BookingId && b.CustomerId == customerId);

            if (booking == null)
                throw new InvalidOperationException("Booking not found or access denied.");

            // Prevent creating a duplicate payment if one already succeeded
            var existingPayment = await _context.Payments
                .Where(p => p.BookingId == booking.Id)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            if (existingPayment != null && existingPayment.Status == PaymentStatus.Succeeded)
                throw new InvalidOperationException("This booking has already been paid for.");

            var payment = new Payment
            {
                BookingId = booking.Id,
                Amount = booking.Service.Price,
                Currency = "USD",
                Status = PaymentStatus.Pending,
                GatewayName = _paymentGateway.GatewayName
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            var frontendCallbackUrl = _configuration["Frontend:PaymentCallbackUrl"]!;

            var initiation = await _paymentGateway.InitiatePaymentAsync(
                payment.Id, payment.Amount, payment.Currency, frontendCallbackUrl);

            if (!initiation.Success)
                throw new InvalidOperationException(initiation.ErrorMessage ?? "Failed to initiate payment.");

            payment.GatewayTransactionId = initiation.GatewayReferenceId;
            await _context.SaveChangesAsync();

            return new InitiatePaymentResponse
            {
                PaymentId = payment.Id,
                RedirectUrl = initiation.RedirectUrl!
            };
        }

        public async Task<PaymentDto> HandleCallbackAsync(Guid paymentId, IDictionary<string, string> callbackParameters)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null)
                throw new InvalidOperationException("Payment not found.");

            var verification = await _paymentGateway.VerifyPaymentAsync(
                payment.GatewayTransactionId ?? "", callbackParameters);

            if (verification.Success)
            {
                payment.Status = PaymentStatus.Succeeded;
                payment.PaidAt = DateTime.UtcNow;
                payment.GatewayTransactionId = verification.TransactionId;
            }
            else
            {
                payment.Status = PaymentStatus.Failed;
            }

            await _context.SaveChangesAsync();

            return MapToDto(payment);
        }

        public async Task<PaymentDto?> GetByBookingIdAsync(Guid bookingId)
        {
            var payment = await _context.Payments
                .Where(p => p.BookingId == bookingId)
                .OrderByDescending(p => p.CreatedAt)
                .FirstOrDefaultAsync();

            return payment == null ? null : MapToDto(payment);
        }

        private static PaymentDto MapToDto(Payment p) => new()
        {
            Id = p.Id,
            BookingId = p.BookingId,
            Amount = p.Amount,
            Currency = p.Currency,
            Status = p.Status.ToString(),
            GatewayTransactionId = p.GatewayTransactionId,
            CreatedAt = p.CreatedAt,
            PaidAt = p.PaidAt
        };
    }
}