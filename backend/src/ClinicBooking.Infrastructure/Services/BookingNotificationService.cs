using ClinicBooking.Application.Interfaces;
using ClinicBooking.Domain.Entities;
using ClinicBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Infrastructure.Services
{
    public class BookingNotificationService : IBookingNotificationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public BookingNotificationService(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task SendBookingCreatedNotificationAsync(Guid bookingId)
        {
            var booking = await LoadBookingWithDetailsAsync(bookingId);
            if (booking == null) return;

            // Email to the customer
            var customerHtml = $@"
                <h2>Booking Request Received</h2>
                <p>Hi {booking.Customer.FullName},</p>
                <p>Your booking request has been submitted and is now <strong>pending confirmation</strong>.</p>
                <ul>
                    <li><strong>Business:</strong> {booking.Business.Name}</li>
                    <li><strong>Service:</strong> {booking.Service.Name}</li>
                    <li><strong>Specialist:</strong> {booking.Specialist.FullName}</li>
                    <li><strong>Date & Time:</strong> {booking.StartTime:MMMM d, yyyy HH:mm} (UTC)</li>
                </ul>
                <p>We'll notify you as soon as the business confirms your appointment.</p>";

            await _emailService.SendEmailAsync(booking.Customer.Email, "Booking Request Received", customerHtml);

            // Email to the business owner
            var owner = await _context.Users.FindAsync(booking.Business.OwnerId);
            if (owner != null)
            {
                var ownerHtml = $@"
                    <h2>New Booking Request</h2>
                    <p>You have a new booking request from {booking.Customer.FullName}.</p>
                    <ul>
                        <li><strong>Service:</strong> {booking.Service.Name}</li>
                        <li><strong>Specialist:</strong> {booking.Specialist.FullName}</li>
                        <li><strong>Date & Time:</strong> {booking.StartTime:MMMM d, yyyy HH:mm} (UTC)</li>
                    </ul>
                    <p>Log in to your dashboard to confirm or reject this request.</p>";

                await _emailService.SendEmailAsync(owner.Email, "New Booking Request", ownerHtml);
            }
        }

        public async Task SendBookingStatusChangedNotificationAsync(Guid bookingId)
        {
            var booking = await LoadBookingWithDetailsAsync(bookingId);
            if (booking == null) return;

            var statusMessage = booking.Status switch
            {
                BookingStatus.Confirmed => "Your booking has been confirmed!",
                BookingStatus.Cancelled => "Your booking has been cancelled.",
                BookingStatus.Rejected => "Unfortunately, your booking request was not accepted.",
                BookingStatus.Completed => "Thank you for visiting us!",
                _ => "Your booking status has been updated."
            };

            var html = $@"
                <h2>{statusMessage}</h2>
                <p>Hi {booking.Customer.FullName},</p>
                <ul>
                    <li><strong>Business:</strong> {booking.Business.Name}</li>
                    <li><strong>Service:</strong> {booking.Service.Name}</li>
                    <li><strong>Specialist:</strong> {booking.Specialist.FullName}</li>
                    <li><strong>Date & Time:</strong> {booking.StartTime:MMMM d, yyyy HH:mm} (UTC)</li>
                    <li><strong>Status:</strong> {booking.Status}</li>
                </ul>";

            await _emailService.SendEmailAsync(booking.Customer.Email, $"Booking {booking.Status}", html);
        }

        public async Task SendBookingReminderAsync(Guid bookingId)
        {
            var booking = await LoadBookingWithDetailsAsync(bookingId);
            if (booking == null) return;

            var html = $@"
                <h2>Appointment Reminder</h2>
                <p>Hi {booking.Customer.FullName},</p>
                <p>This is a reminder for your upcoming appointment:</p>
                <ul>
                    <li><strong>Business:</strong> {booking.Business.Name}</li>
                    <li><strong>Service:</strong> {booking.Service.Name}</li>
                    <li><strong>Specialist:</strong> {booking.Specialist.FullName}</li>
                    <li><strong>Date & Time:</strong> {booking.StartTime:MMMM d, yyyy HH:mm} (UTC)</li>
                </ul>
                <p>We look forward to seeing you!</p>";

            await _emailService.SendEmailAsync(booking.Customer.Email, "Appointment Reminder", html);

            booking.ReminderSent = true;
            await _context.SaveChangesAsync();
        }

        private async Task<Booking?> LoadBookingWithDetailsAsync(Guid bookingId)
        {
            return await _context.Bookings
                .Include(b => b.Business)
                .Include(b => b.Service)
                .Include(b => b.Specialist)
                .Include(b => b.Customer)
                .FirstOrDefaultAsync(b => b.Id == bookingId);
        }
    }
}