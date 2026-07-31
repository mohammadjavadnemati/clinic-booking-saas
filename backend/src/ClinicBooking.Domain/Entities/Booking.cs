namespace ClinicBooking.Domain.Entities
{
    public enum BookingStatus
    {
        Pending = 1,
        Confirmed = 2,
        Cancelled = 3,
        Completed = 4,
        Rejected = 5
    }

    public class Booking
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BusinessId { get; set; }
        public Guid ServiceId { get; set; }
        public Guid SpecialistId { get; set; }
        public Guid CustomerId { get; set; } // User.Id of the Customer

        public DateTime StartTime { get; set; } // UTC
        public DateTime EndTime { get; set; }   // UTC, calculated from Service.DurationMinutes

        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public string? CustomerNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public Business Business { get; set; } = null!;
        public Service Service { get; set; } = null!;
        public Specialist Specialist { get; set; } = null!;
        public User Customer { get; set; } = null!;
    }
}