namespace ClinicBooking.Application.DTOs.Services
{
    public class ServiceDto
    {
        public Guid Id { get; set; }
        public Guid BusinessId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateServiceRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int DurationMinutes { get; set; }
    }

    public class UpdateServiceRequest : CreateServiceRequest
    {
        public bool IsActive { get; set; }
    }
}