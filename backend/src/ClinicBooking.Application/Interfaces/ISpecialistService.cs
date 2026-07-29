using ClinicBooking.Application.DTOs.Specialists;
using ClinicBooking.Application.DTOs.WorkingHours;

namespace ClinicBooking.Application.Interfaces
{
    public interface ISpecialistService
    {
        Task<SpecialistDto> CreateAsync(Guid businessId, CreateSpecialistRequest request);
        Task<List<SpecialistDto>> GetByBusinessIdAsync(Guid businessId);
        Task<SpecialistDto?> GetByIdAsync(Guid id);
        Task<SpecialistDto> UpdateAsync(Guid id, Guid businessId, UpdateSpecialistRequest request);
        Task DeleteAsync(Guid id, Guid businessId);

        Task<List<WorkingHourDto>> GetWorkingHoursAsync(Guid specialistId);
        Task SetWorkingHoursAsync(Guid specialistId, Guid businessId, SetWorkingHoursRequest request);
    }
}