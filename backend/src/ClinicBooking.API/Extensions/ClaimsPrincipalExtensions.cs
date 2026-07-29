using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace ClinicBooking.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var value = user.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (value == null)
                throw new UnauthorizedAccessException("User ID not found in token.");

            return Guid.Parse(value);
        }
    }
}