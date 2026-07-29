namespace ClinicBooking.Domain.Entities
{
    public class Specialist
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid BusinessId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Specialty { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Business Business { get; set; } = null!;
        public ICollection<WorkingHour> WorkingHours { get; set; } = new List<WorkingHour>();
    }
}