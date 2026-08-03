using ClinicBooking.Application.DTOs.Business;

namespace ClinicBooking.Application.Interfaces
{
    public interface IBusinessService
    {
        Task<BusinessDto> CreateAsync(Guid ownerId, CreateBusinessRequest request);
        Task<BusinessDto?> GetByIdAsync(Guid id);
        Task<BusinessDto?> GetByOwnerIdAsync(Guid ownerId);
        Task<BusinessDto> UpdateAsync(Guid id, Guid ownerId, UpdateBusinessRequest request);
        Task<List<BusinessDto>> GetAllAsync();
    }
}