namespace ClinicBooking.Application.DTOs.Analytics
{
    public class DashboardStatsDto
    {
        public int TotalBookings { get; set; }
        public int PendingBookings { get; set; }
        public int ConfirmedBookings { get; set; }
        public int CompletedBookings { get; set; }
        public int CancelledOrRejectedBookings { get; set; }

        public decimal TotalRevenue { get; set; } // from Completed bookings only
        public int NewCustomersThisMonth { get; set; }

        public List<BookingsPerDayDto> BookingsLast30Days { get; set; } = new();
        public List<PopularServiceDto> TopServices { get; set; } = new();
    }

    public class BookingsPerDayDto
    {
        public string Date { get; set; } = string.Empty; // "yyyy-MM-dd"
        public int Count { get; set; }
    }

    public class PopularServiceDto
    {
        public string ServiceName { get; set; } = string.Empty;
        public int BookingCount { get; set; }
    }
}