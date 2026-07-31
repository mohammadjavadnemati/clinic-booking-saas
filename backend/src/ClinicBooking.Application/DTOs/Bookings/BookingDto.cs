namespace ClinicBooking.Application.DTOs.Bookings
{
    public class BookingDto
    {
        public Guid Id { get; set; }
        public Guid BusinessId { get; set; }
        public Guid ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public Guid SpecialistId { get; set; }
        public string SpecialistName { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? CustomerNote { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateBookingRequest
    {
        public Guid ServiceId { get; set; }
        public Guid SpecialistId { get; set; }
        public DateTime StartTime { get; set; } // UTC, sent from frontend
        public string? CustomerNote { get; set; }
    }

    public class UpdateBookingStatusRequest
    {
        public string Status { get; set; } = string.Empty; // "Confirmed", "Cancelled", "Rejected", "Completed"
    }

    public class AvailableSlotsRequest
    {
        public Guid SpecialistId { get; set; }
        public Guid ServiceId { get; set; }
        public DateOnly Date { get; set; } // The day to check, in the business's local context
    }

    public class BookingFilterRequest
    {
        public DateOnly? Date { get; set; }
        public Guid? SpecialistId { get; set; }
        public string? Status { get; set; }
    }
}