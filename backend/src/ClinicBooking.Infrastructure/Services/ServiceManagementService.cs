using ClinicBooking.Application.DTOs.Services;
using ClinicBooking.Application.Interfaces;
using ClinicBooking.Domain.Entities;
using ClinicBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Infrastructure.Services
{
    public class ServiceManagementService : IServiceManagementService
    {
        private readonly ApplicationDbContext _context;

        public ServiceManagementService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceDto> CreateAsync(Guid businessId, CreateServiceRequest request)
        {
            var service = new Service
            {
                BusinessId = businessId,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                DurationMinutes = request.DurationMinutes
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return MapToDto(service);
        }

        public async Task<List<ServiceDto>> GetByBusinessIdAsync(Guid businessId)
        {
            return await _context.Services
                .Where(s => s.BusinessId == businessId)
                .Select(s => MapToDto(s))
                .ToListAsync();
        }

        public async Task<ServiceDto?> GetByIdAsync(Guid id)
        {
            var service = await _context.Services.FindAsync(id);
            return service == null ? null : MapToDto(service);
        }

        public async Task<ServiceDto> UpdateAsync(Guid id, Guid businessId, UpdateServiceRequest request)
        {
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == id && s.BusinessId == businessId);

            if (service == null)
                throw new UnauthorizedAccessException("Service not found or access denied.");

            service.Name = request.Name;
            service.Description = request.Description;
            service.Price = request.Price;
            service.DurationMinutes = request.DurationMinutes;
            service.IsActive = request.IsActive;

            await _context.SaveChangesAsync();

            return MapToDto(service);
        }

        public async Task DeleteAsync(Guid id, Guid businessId)
        {
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.Id == id && s.BusinessId == businessId);

            if (service == null)
                throw new UnauthorizedAccessException("Service not found or access denied.");

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
        }

        private static ServiceDto MapToDto(Service s) => new()
        {
            Id = s.Id,
            BusinessId = s.BusinessId,
            Name = s.Name,
            Description = s.Description,
            Price = s.Price,
            DurationMinutes = s.DurationMinutes,
            IsActive = s.IsActive
        };
    }
}