namespace ClinicBooking.Application.DTOs.WorkingHours
{
    public class WorkingHourDto
    {
        public Guid Id { get; set; }
        public int DayOfWeek { get; set; }
        public string StartTime { get; set; } = string.Empty; // "09:00"
        public string EndTime { get; set; } = string.Empty;   // "17:00"
        public bool IsDayOff { get; set; }
    }

    public class SetWorkingHoursRequest
    {
        public List<WorkingHourDto> WorkingHours { get; set; } = new();
    }
}