using ClinicBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using ClinicBooking.Application.Interfaces;
using ClinicBooking.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi;
using Hangfire;
using Hangfire.PostgreSql;
using ClinicBooking.Infrastructure.Payments;


var builder = WebApplication.CreateBuilder(args);
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.MapInboundClaims = false;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});
builder.Services.AddAuthorization();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<IBusinessService, BusinessService>();
builder.Services.AddScoped<IServiceManagementService, ServiceManagementService>();
builder.Services.AddScoped<ISpecialistService, SpecialistService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IPaymentGateway, MockPaymentGateway>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Enter JWT token"
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
        });
});
// builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddScoped<IBookingService, BookingService>();
// Register application services
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IBookingNotificationService, BookingNotificationService>();
builder.Services.AddScoped<IScheduledJobsService, ScheduledJobsService>();

// Configure Hangfire with PostgreSQL storage
builder.Services.AddHangfire(config => config
    .UsePostgreSqlStorage(options =>
        options.UseNpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"))));

builder.Services.AddHangfireServer();
var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
// }
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");
app.UseAuthentication();   
app.UseAuthorization();
// Hangfire Dashboard (accessible at /hangfire) — for monitoring jobs during development
app.UseHangfireDashboard("/hangfire");

// Register recurring jobs
RecurringJob.AddOrUpdate<IScheduledJobsService>(
    "send-upcoming-reminders",
    service => service.SendUpcomingRemindersAsync(),
    "0 * * * *"); // every hour, at minute 0

RecurringJob.AddOrUpdate<IScheduledJobsService>(
    "cleanup-expired-pending-bookings",
    service => service.CleanupExpiredPendingBookingsAsync(),
    "*/30 * * * *"); // every 30 minutes
app.MapControllers();

app.Run();

// Admin@12345
// admin@enterprisecommerce.com

// {
//   "fullName": "علی رضایی",
//   "email": "ali@test.com",
//   "password": "Test1234!"
// }