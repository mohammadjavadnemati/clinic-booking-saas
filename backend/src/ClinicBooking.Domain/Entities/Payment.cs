namespace ClinicBooking.Domain.Entities
{
    public enum PaymentStatus
    {
        Pending = 1,
        Succeeded = 2,
        Failed = 3
    }

    public class Payment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BookingId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        // Identifier returned by the payment gateway (mock or real)
        public string? GatewayTransactionId { get; set; }
        public string? GatewayName { get; set; } = "Mock";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }

        public Booking Booking { get; set; } = null!;
    }
}