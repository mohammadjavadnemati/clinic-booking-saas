using ClinicBooking.Application.DTOs.Analytics;
using ClinicBooking.Application.Interfaces;
using ClinicBooking.Domain.Entities;
using ClinicBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Infrastructure.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync(Guid businessId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Service)
                .Where(b => b.BusinessId == businessId)
                .ToListAsync();

            var stats = new DashboardStatsDto
            {
                TotalBookings = bookings.Count,
                PendingBookings = bookings.Count(b => b.Status == BookingStatus.Pending),
                ConfirmedBookings = bookings.Count(b => b.Status == BookingStatus.Confirmed),
                CompletedBookings = bookings.Count(b => b.Status == BookingStatus.Completed),
                CancelledOrRejectedBookings = bookings.Count(b =>
                    b.Status == BookingStatus.Cancelled || b.Status == BookingStatus.Rejected),

                TotalRevenue = bookings
                    .Where(b => b.Status == BookingStatus.Completed)
                    .Sum(b => b.Service.Price)
            };

            // New customers this month (first-ever booking created within the current month)
            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var customerFirstBookingDates = bookings
                .GroupBy(b => b.CustomerId)
                .Select(g => g.Min(b => b.CreatedAt))
                .ToList();

            stats.NewCustomersThisMonth = customerFirstBookingDates.Count(d => d >= startOfMonth);

            // Bookings per day, last 30 days (for the chart)
            var thirtyDaysAgo = now.Date.AddDays(-29); // include today => 30 days total
            var last30DaysBookings = bookings
                .Where(b => b.CreatedAt.Date >= thirtyDaysAgo)
                .GroupBy(b => b.CreatedAt.Date)
                .ToDictionary(g => g.Key, g => g.Count());

            var bookingsPerDay = new List<BookingsPerDayDto>();
            for (var day = thirtyDaysAgo; day <= now.Date; day = day.AddDays(1))
            {
                bookingsPerDay.Add(new BookingsPerDayDto
                {
                    Date = day.ToString("yyyy-MM-dd"),
                    Count = last30DaysBookings.TryGetValue(day, out var count) ? count : 0
                });
            }
            stats.BookingsLast30Days = bookingsPerDay;

            // Top 5 most popular services (by booking count)
            stats.TopServices = bookings
                .GroupBy(b => b.Service.Name)
                .Select(g => new PopularServiceDto { ServiceName = g.Key, BookingCount = g.Count() })
                .OrderByDescending(s => s.BookingCount)
                .Take(5)
                .ToList();

            return stats;
        }
    }
}