using ClinicBooking.Application.DTOs.Business;
using ClinicBooking.Application.Interfaces;
using ClinicBooking.Domain.Entities;
using ClinicBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Infrastructure.Services
{
    public class BusinessService : IBusinessService
    {
        private readonly ApplicationDbContext _context;

        public BusinessService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BusinessDto> CreateAsync(Guid ownerId, CreateBusinessRequest request)
        {
            var existing = await _context.Businesses.AnyAsync(b => b.OwnerId == ownerId);
            if (existing)
                throw new InvalidOperationException("You already have a business registered under your account.");

            var business = new Business
            {
                OwnerId = ownerId,
                Name = request.Name,
                Description = request.Description,
                Address = request.Address,
                PhoneNumber = request.PhoneNumber,
                LogoUrl = request.LogoUrl
            };

            _context.Businesses.Add(business);
            await _context.SaveChangesAsync();

            return MapToDto(business);
        }

        public async Task<BusinessDto?> GetByIdAsync(Guid id)
        {
            var business = await _context.Businesses.FindAsync(id);
            return business == null ? null : MapToDto(business);
        }

        public async Task<BusinessDto?> GetByOwnerIdAsync(Guid ownerId)
        {
            var business = await _context.Businesses.FirstOrDefaultAsync(b => b.OwnerId == ownerId);
            return business == null ? null : MapToDto(business);
        }

        public async Task<BusinessDto> UpdateAsync(Guid id, Guid ownerId, UpdateBusinessRequest request)
        {
            var business = await _context.Businesses.FirstOrDefaultAsync(b => b.Id == id && b.OwnerId == ownerId);
            if (business == null)
                throw new UnauthorizedAccessException("Business not found or access denied.");

            business.Name = request.Name;
            business.Description = request.Description;
            business.Address = request.Address;
            business.PhoneNumber = request.PhoneNumber;
            business.LogoUrl = request.LogoUrl;

            await _context.SaveChangesAsync();

            return MapToDto(business);
        }
        public async Task<List<BusinessDto>> GetAllAsync()
        {
            var businesses = await _context.Businesses.ToListAsync();
            return businesses.Select(MapToDto).ToList();
        }

        private static BusinessDto MapToDto(Business b) => new()
        {
            Id = b.Id,
            Name = b.Name,
            Description = b.Description,
            Address = b.Address,
            PhoneNumber = b.PhoneNumber,
            LogoUrl = b.LogoUrl
        };
    }
}