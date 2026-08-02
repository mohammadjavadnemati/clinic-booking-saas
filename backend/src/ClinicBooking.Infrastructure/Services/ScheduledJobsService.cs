using ClinicBooking.Application.Interfaces;
using ClinicBooking.Domain.Entities;
using ClinicBooking.Infrastructure.Persistence;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ClinicBooking.Infrastructure.Services
{
    public class ScheduledJobsService : IScheduledJobsService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ScheduledJobsService> _logger;

        public ScheduledJobsService(ApplicationDbContext context, ILogger<ScheduledJobsService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Finds confirmed bookings starting within the next 24 hours that haven't been reminded yet
        public async Task SendUpcomingRemindersAsync()
        {
            var now = DateTime.UtcNow;
            var reminderWindowEnd = now.AddHours(24);

            var upcomingBookings = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Confirmed
                    && !b.ReminderSent
                    && b.StartTime > now
                    && b.StartTime <= reminderWindowEnd)
                .Select(b => b.Id)
                .ToListAsync();

            _logger.LogInformation("Found {Count} bookings needing reminders", upcomingBookings.Count);

            foreach (var bookingId in upcomingBookings)
            {
                BackgroundJob.Enqueue<IBookingNotificationService>(
                    service => service.SendBookingReminderAsync(bookingId));
            }
        }

        // Automatically cancels Pending bookings whose time has already passed
        // (the business never responded in time)
        public async Task CleanupExpiredPendingBookingsAsync()
        {
            var now = DateTime.UtcNow;

            var expiredBookings = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Pending && b.StartTime < now)
                .ToListAsync();

            foreach (var booking in expiredBookings)
            {
                booking.Status = BookingStatus.Cancelled;
                booking.UpdatedAt = now;
            }

            if (expiredBookings.Count > 0)
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Auto-cancelled {Count} expired pending bookings", expiredBookings.Count);
            }
        }
    }
}