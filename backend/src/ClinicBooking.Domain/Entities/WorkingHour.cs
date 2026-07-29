namespace ClinicBooking.Domain.Entities
{
    public enum DayOfWeekEnum
    {
        Sunday = 0,
        Monday = 1,
        Tuesday = 2,
        Wednesday = 3,
        Thursday = 4,
        Friday = 5,
        Saturday = 6
    }

    public class WorkingHour
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SpecialistId { get; set; }
        public DayOfWeekEnum DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool IsDayOff { get; set; } = false;

        public Specialist Specialist { get; set; } = null!;
    }
}