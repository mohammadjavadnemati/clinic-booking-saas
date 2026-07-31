using ClinicBooking.Application.DTOs.Bookings;
using ClinicBooking.Application.Interfaces;
using ClinicBooking.Domain.Entities;
using ClinicBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Infrastructure.Services
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;

        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<string>> GetAvailableSlotsAsync(AvailableSlotsRequest request)
        {
            var service = await _context.Services.FindAsync(request.ServiceId);
            if (service == null)
                throw new InvalidOperationException("Service not found.");

            var dayOfWeek = (DayOfWeekEnum)(int)request.Date.DayOfWeek;

            var workingHour = await _context.WorkingHours
                .FirstOrDefaultAsync(w => w.SpecialistId == request.SpecialistId && w.DayOfWeek == dayOfWeek);

            // No working hours configured for this day, or explicitly marked as a day off
            if (workingHour == null || workingHour.IsDayOff)
                return new List<string>();

            var dayStart = request.Date.ToDateTime(TimeOnly.FromTimeSpan(workingHour.StartTime), DateTimeKind.Utc);
            var dayEnd = request.Date.ToDateTime(TimeOnly.FromTimeSpan(workingHour.EndTime), DateTimeKind.Utc);

            var duration = TimeSpan.FromMinutes(service.DurationMinutes);

            // Existing bookings for this specialist on this day (excluding cancelled/rejected)
            var existingBookings = await _context.Bookings
                .Where(b => b.SpecialistId == request.SpecialistId
                    && b.StartTime < dayEnd
                    && b.EndTime > dayStart
                    && b.Status != BookingStatus.Cancelled
                    && b.Status != BookingStatus.Rejected)
                .Select(b => new { b.StartTime, b.EndTime })
                .ToListAsync();

            var slots = new List<string>();
            var now = DateTime.UtcNow;

            var cursor = dayStart;
            while (cursor + duration <= dayEnd)
            {
                var slotStart = cursor;
                var slotEnd = cursor + duration;

                // Skip slots that are already in the past (only relevant if the requested date is today)
                if (slotStart > now)
                {
                    var hasConflict = existingBookings.Any(b =>
                        slotStart < b.EndTime && slotEnd > b.StartTime);

                    if (!hasConflict)
                    {
                        slots.Add(slotStart.ToString("o")); // ISO 8601, e.g. 2026-08-01T09:00:00Z
                    }
                }

                cursor = cursor.Add(duration);
            }

            return slots;
        }

        public async Task<BookingDto> CreateBookingAsync(Guid customerId, CreateBookingRequest request)
        {
            var service = await _context.Services.FindAsync(request.ServiceId);
            if (service == null)
                throw new InvalidOperationException("Service not found.");

            var specialist = await _context.Specialists.FindAsync(request.SpecialistId);
            if (specialist == null)
                throw new InvalidOperationException("Specialist not found.");

            var startTime = DateTime.SpecifyKind(request.StartTime, DateTimeKind.Utc);
            var endTime = startTime.AddMinutes(service.DurationMinutes);

            // Re-validate against conflicts at the moment of booking (race-condition safety net)
            var hasConflict = await _context.Bookings.AnyAsync(b =>
                b.SpecialistId == request.SpecialistId
                && b.Status != BookingStatus.Cancelled
                && b.Status != BookingStatus.Rejected
                && startTime < b.EndTime && endTime > b.StartTime);

            if (hasConflict)
                throw new InvalidOperationException("This time slot is no longer available. Please choose another one.");

            var booking = new Booking
            {
                BusinessId = specialist.BusinessId,
                ServiceId = request.ServiceId,
                SpecialistId = request.SpecialistId,
                CustomerId = customerId,
                StartTime = startTime,
                EndTime = endTime,
                Status = BookingStatus.Pending,
                CustomerNote = request.CustomerNote
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return await MapToDtoAsync(booking);
        }

        public async Task<List<BookingDto>> GetCustomerBookingsAsync(Guid customerId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Service)
                .Include(b => b.Specialist)
                .Include(b => b.Customer)
                .Where(b => b.CustomerId == customerId)
                .OrderByDescending(b => b.StartTime)
                .ToListAsync();

            return bookings.Select(MapToDto).ToList();
        }

        public async Task<List<BookingDto>> GetBusinessBookingsAsync(Guid businessId, BookingFilterRequest filter)
        {
            var query = _context.Bookings
                .Include(b => b.Service)
                .Include(b => b.Specialist)
                .Include(b => b.Customer)
                .Where(b => b.BusinessId == businessId)
                .AsQueryable();

            if (filter.Date.HasValue)
            {
                var dayStart = filter.Date.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
                var dayEnd = dayStart.AddDays(1);
                query = query.Where(b => b.StartTime >= dayStart && b.StartTime < dayEnd);
            }

            if (filter.SpecialistId.HasValue)
            {
                query = query.Where(b => b.SpecialistId == filter.SpecialistId.Value);
            }

            if (!string.IsNullOrEmpty(filter.Status) && Enum.TryParse<BookingStatus>(filter.Status, true, out var statusEnum))
            {
                query = query.Where(b => b.Status == statusEnum);
            }

            var bookings = await query.OrderBy(b => b.StartTime).ToListAsync();
            return bookings.Select(MapToDto).ToList();
        }

        public async Task<BookingDto> UpdateStatusAsync(Guid bookingId, Guid businessId, UpdateBookingStatusRequest request)
        {
            var booking = await _context.Bookings
                .Include(b => b.Service)
                .Include(b => b.Specialist)
                .Include(b => b.Customer)
                .FirstOrDefaultAsync(b => b.Id == bookingId && b.BusinessId == businessId);

            if (booking == null)
                throw new UnauthorizedAccessException("Booking not found or access denied.");

            if (!Enum.TryParse<BookingStatus>(request.Status, true, out var newStatus))
                throw new InvalidOperationException("Invalid status value.");

            booking.Status = newStatus;
            booking.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToDto(booking);
        }

        private async Task<BookingDto> MapToDtoAsync(Booking booking)
        {
            await _context.Entry(booking).Reference(b => b.Service).LoadAsync();
            await _context.Entry(booking).Reference(b => b.Specialist).LoadAsync();
            await _context.Entry(booking).Reference(b => b.Customer).LoadAsync();

            return MapToDto(booking);
        }

        private static BookingDto MapToDto(Booking b) => new()
        {
            Id = b.Id,
            BusinessId = b.BusinessId,
            ServiceId = b.ServiceId,
            ServiceName = b.Service?.Name ?? "",
            SpecialistId = b.SpecialistId,
            SpecialistName = b.Specialist?.FullName ?? "",
            CustomerId = b.CustomerId,
            CustomerName = b.Customer?.FullName ?? "",
            CustomerEmail = b.Customer?.Email ?? "",
            StartTime = b.StartTime,
            EndTime = b.EndTime,
            Status = b.Status.ToString(),
            CustomerNote = b.CustomerNote,
            CreatedAt = b.CreatedAt
        };
    }
}