using ClinicBooking.Application.DTOs.Services;

namespace ClinicBooking.Application.Interfaces
{
    public interface IServiceManagementService
    {
        Task<ServiceDto> CreateAsync(Guid businessId, CreateServiceRequest request);
        Task<List<ServiceDto>> GetByBusinessIdAsync(Guid businessId);
        Task<ServiceDto?> GetByIdAsync(Guid id);
        Task<ServiceDto> UpdateAsync(Guid id, Guid businessId, UpdateServiceRequest request);
        Task DeleteAsync(Guid id, Guid businessId);
    }
}