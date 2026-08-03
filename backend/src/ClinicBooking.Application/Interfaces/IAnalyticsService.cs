using ClinicBooking.Application.DTOs.Analytics;

namespace ClinicBooking.Application.Interfaces
{
    public interface IAnalyticsService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync(Guid businessId);
    }
}