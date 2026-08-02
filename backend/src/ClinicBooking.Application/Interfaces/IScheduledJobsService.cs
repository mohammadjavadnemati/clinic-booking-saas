namespace ClinicBooking.Application.Interfaces
{
    public interface IScheduledJobsService
    {
        Task SendUpcomingRemindersAsync();
        Task CleanupExpiredPendingBookingsAsync();
    }
}