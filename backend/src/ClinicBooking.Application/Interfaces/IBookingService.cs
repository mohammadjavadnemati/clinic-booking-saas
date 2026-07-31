using ClinicBooking.Application.DTOs.Bookings;

namespace ClinicBooking.Application.Interfaces
{
    public interface IBookingService
    {
        Task<List<string>> GetAvailableSlotsAsync(AvailableSlotsRequest request);
        Task<BookingDto> CreateBookingAsync(Guid customerId, CreateBookingRequest request);
        Task<List<BookingDto>> GetCustomerBookingsAsync(Guid customerId);
        Task<List<BookingDto>> GetBusinessBookingsAsync(Guid businessId, BookingFilterRequest filter);
        Task<BookingDto> UpdateStatusAsync(Guid bookingId, Guid businessId, UpdateBookingStatusRequest request);
    }
}