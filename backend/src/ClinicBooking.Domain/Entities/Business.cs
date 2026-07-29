namespace ClinicBooking.Domain.Entities
{
    public class Business
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid OwnerId { get; set; } // User.Id of the BusinessOwner
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? LogoUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Service> Services { get; set; } = new List<Service>();
        public ICollection<Specialist> Specialists { get; set; } = new List<Specialist>();
    }
}