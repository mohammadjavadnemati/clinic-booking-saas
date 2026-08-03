namespace ClinicBooking.Application.DTOs.Payments
{
    public class PaymentDto
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? GatewayTransactionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PaidAt { get; set; }
    }

    public class InitiatePaymentRequest
    {
        public Guid BookingId { get; set; }
    }

    public class InitiatePaymentResponse
    {
        public Guid PaymentId { get; set; }
        public string RedirectUrl { get; set; } = string.Empty;
    }
}