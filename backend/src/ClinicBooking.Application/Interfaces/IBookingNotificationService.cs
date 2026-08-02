using ClinicBooking.Domain.Entities;

namespace ClinicBooking.Application.Interfaces
{
    public interface IBookingNotificationService
    {
        Task SendBookingCreatedNotificationAsync(Guid bookingId);
        Task SendBookingStatusChangedNotificationAsync(Guid bookingId);
        Task SendBookingReminderAsync(Guid bookingId);
    }
}