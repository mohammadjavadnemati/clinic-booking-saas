namespace ClinicBooking.Application.DTOs.Business
{
    public class BusinessDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? LogoUrl { get; set; }
    }

    public class CreateBusinessRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? LogoUrl { get; set; }
    }

    public class UpdateBusinessRequest : CreateBusinessRequest
    {
    }
}