using System.ComponentModel.DataAnnotations;

namespace backend.Options
{
    public class JwtOptions
    {
        [Required]
        public string Issuer { get; set; } = string.Empty;
        [Required]
        public string Audience { get; set; } = string.Empty;
        [Required]
        [MinLength(32, ErrorMessage = "JWT SecretKey must be at least 32 characters long.")]
        public string SecretKey { get; set; } = string.Empty;
        [Range(1, 60, ErrorMessage = "Access token expiration must be between 1 and 60 minutes.")]
        public int AccessTokenExpireTimeInMinutes { get; set; }

        [Range(1, 30, ErrorMessage = "Refresh token expiration must be between 1 and 30 days.")]
        public int RefreshTokenExpireTimeInDays { get; set; }
    }
}