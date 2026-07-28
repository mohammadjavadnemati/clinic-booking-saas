using ClinicBooking.Application.DTOs.Auth;
using ClinicBooking.Application.Interfaces;
using ClinicBooking.Domain.Entities;
using ClinicBooking.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ClinicBooking.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenService _jwtTokenService;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthService(ApplicationDbContext context, JwtTokenService jwtTokenService)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
                throw new InvalidOperationException("This email address is already registered.");

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Role = UserRole.Customer 
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return await GenerateTokensAsync(user);
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                throw new UnauthorizedAccessException("The email or password is incorrect.");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Failed)
                throw new UnauthorizedAccessException("The email or password is incorrect.");

            return await GenerateTokensAsync(user);
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiresAt < DateTime.UtcNow)
                throw new UnauthorizedAccessException("The refresh token is invalid or has expired.");

            storedToken.IsRevoked = true;

            var response = await GenerateTokensAsync(storedToken.User);
            await _context.SaveChangesAsync();

            return response;
        }

        public async Task RevokeRefreshTokenAsync(string refreshToken)
        {
            var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);
            if (storedToken != null)
            {
                storedToken.IsRevoked = true;
                await _context.SaveChangesAsync();
            }
        }

        private async Task<AuthResponse> GenerateTokensAsync(User user)
        {
            var accessToken = _jwtTokenService.GenerateAccessToken(user);
            var refreshTokenValue = _jwtTokenService.GenerateRefreshToken();

            var refreshToken = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenValue,
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtTokenService.GetRefreshTokenExpirationDays())
            };

            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshTokenValue,
                AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(_jwtTokenService.GetAccessTokenExpirationMinutes())
            };
        }
    }
}