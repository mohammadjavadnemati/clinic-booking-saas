using ClinicBooking.Application.DTOs.Payments;

namespace ClinicBooking.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<InitiatePaymentResponse> InitiatePaymentAsync(Guid customerId, InitiatePaymentRequest request);
        Task<PaymentDto> HandleCallbackAsync(Guid paymentId, IDictionary<string, string> callbackParameters);
        Task<PaymentDto?> GetByBookingIdAsync(Guid bookingId);
    }
}