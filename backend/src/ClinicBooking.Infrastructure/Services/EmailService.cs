using ClinicBooking.Application.Interfaces;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace ClinicBooking.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _configuration["Smtp:FromName"],
                _configuration["Smtp:FromEmail"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html") { Text = htmlBody };

            using var client = new SmtpClient();
            try
            {
                var host = _configuration["Smtp:Host"]!;
                var port = int.Parse(_configuration["Smtp:Port"]!);
                var useSsl = bool.Parse(_configuration["Smtp:UseSsl"]!);

                await client.ConnectAsync(host, port, useSsl);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                // Log but don't throw — a failed email should never break the booking flow
                _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            }
        }
    }
}