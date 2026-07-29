using ClinicBooking.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<RefreshToken> RefreshTokens { get; set; } = null!;
        public DbSet<Business> Businesses { get; set; } = null!;
        public DbSet<Service> Services { get; set; } = null!;
        public DbSet<Specialist> Specialists { get; set; } = null!;
        public DbSet<WorkingHour> WorkingHours { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Email).IsRequired();
                entity.Property(u => u.PasswordHash).IsRequired();
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasOne(rt => rt.User)
                      .WithMany()
                      .HasForeignKey(rt => rt.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Business>(entity =>
            {
                entity.Property(b => b.Name).IsRequired();
            });

            modelBuilder.Entity<Service>(entity =>
            {
                entity.Property(s => s.Name).IsRequired();
                entity.Property(s => s.Price).HasColumnType("decimal(10,2)");

                entity.HasOne(s => s.Business)
                      .WithMany(b => b.Services)
                      .HasForeignKey(s => s.BusinessId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Specialist>(entity =>
            {
                entity.Property(s => s.FullName).IsRequired();

                entity.HasOne(s => s.Business)
                      .WithMany(b => b.Specialists)
                      .HasForeignKey(s => s.BusinessId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<WorkingHour>(entity =>
            {
                entity.HasOne(w => w.Specialist)
                      .WithMany(s => s.WorkingHours)
                      .HasForeignKey(w => w.SpecialistId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}