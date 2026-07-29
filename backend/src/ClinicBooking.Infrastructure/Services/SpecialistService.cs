using ClinicBooking.Application.DTOs.Specialists;
using ClinicBooking.Application.DTOs.WorkingHours;
using ClinicBooking.Application.Interfaces;
using ClinicBooking.Domain.Entities;
using ClinicBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Infrastructure.Services
{
    public class SpecialistService : ISpecialistService
    {
        private readonly ApplicationDbContext _context;

        public SpecialistService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SpecialistDto> CreateAsync(Guid businessId, CreateSpecialistRequest request)
        {
            var specialist = new Specialist
            {
                BusinessId = businessId,
                FullName = request.FullName,
                ImageUrl = request.ImageUrl,
                Specialty = request.Specialty,
                Description = request.Description
            };

            _context.Specialists.Add(specialist);
            await _context.SaveChangesAsync();

            return MapToDto(specialist);
        }

        public async Task<List<SpecialistDto>> GetByBusinessIdAsync(Guid businessId)
        {
            return await _context.Specialists
                .Where(s => s.BusinessId == businessId)
                .Select(s => MapToDto(s))
                .ToListAsync();
        }

        public async Task<SpecialistDto?> GetByIdAsync(Guid id)
        {
            var specialist = await _context.Specialists.FindAsync(id);
            return specialist == null ? null : MapToDto(specialist);
        }

        public async Task<SpecialistDto> UpdateAsync(Guid id, Guid businessId, UpdateSpecialistRequest request)
        {
            var specialist = await _context.Specialists
                .FirstOrDefaultAsync(s => s.Id == id && s.BusinessId == businessId);

            if (specialist == null)
                throw new UnauthorizedAccessException("Specialist not found or access denied.");

            specialist.FullName = request.FullName;
            specialist.ImageUrl = request.ImageUrl;
            specialist.Specialty = request.Specialty;
            specialist.Description = request.Description;
            specialist.IsActive = request.IsActive;

            await _context.SaveChangesAsync();

            return MapToDto(specialist);
        }

        public async Task DeleteAsync(Guid id, Guid businessId)
        {
            var specialist = await _context.Specialists
                .FirstOrDefaultAsync(s => s.Id == id && s.BusinessId == businessId);

            if (specialist == null)
                throw new UnauthorizedAccessException("Specialist not found or access denied.");

            _context.Specialists.Remove(specialist);
            await _context.SaveChangesAsync();
        }

        public async Task<List<WorkingHourDto>> GetWorkingHoursAsync(Guid specialistId)
        {
            return await _context.WorkingHours
                .Where(w => w.SpecialistId == specialistId)
                .Select(w => new WorkingHourDto
                {
                    Id = w.Id,
                    DayOfWeek = (int)w.DayOfWeek,
                    StartTime = w.StartTime.ToString(@"hh\:mm"),
                    EndTime = w.EndTime.ToString(@"hh\:mm"),
                    IsDayOff = w.IsDayOff
                })
                .ToListAsync();
        }

        public async Task SetWorkingHoursAsync(Guid specialistId, Guid businessId, SetWorkingHoursRequest request)
        {
            var specialist = await _context.Specialists
                .FirstOrDefaultAsync(s => s.Id == specialistId && s.BusinessId == businessId);

            if (specialist == null)
                throw new UnauthorizedAccessException("Specialist not found or access denied.");

            // Remove existing working hours and replace with new set (simplest approach for now)
            var existing = _context.WorkingHours.Where(w => w.SpecialistId == specialistId);
            _context.WorkingHours.RemoveRange(existing);

            foreach (var wh in request.WorkingHours)
            {
                _context.WorkingHours.Add(new WorkingHour
                {
                    SpecialistId = specialistId,
                    DayOfWeek = (DayOfWeekEnum)wh.DayOfWeek,
                    StartTime = TimeSpan.Parse(wh.StartTime),
                    EndTime = TimeSpan.Parse(wh.EndTime),
                    IsDayOff = wh.IsDayOff
                });
            }

            await _context.SaveChangesAsync();
        }

        private static SpecialistDto MapToDto(Specialist s) => new()
        {
            Id = s.Id,
            BusinessId = s.BusinessId,
            FullName = s.FullName,
            ImageUrl = s.ImageUrl,
            Specialty = s.Specialty,
            Description = s.Description,
            IsActive = s.IsActive
        };
    }
}