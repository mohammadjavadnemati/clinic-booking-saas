namespace ClinicBooking.Application.DTOs.Specialists
{
    public class SpecialistDto
    {
        public Guid Id { get; set; }
        public Guid BusinessId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Specialty { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateSpecialistRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Specialty { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateSpecialistRequest : CreateSpecialistRequest
    {
        public bool IsActive { get; set; }
    }
}