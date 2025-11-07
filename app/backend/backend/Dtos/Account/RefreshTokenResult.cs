using backend.Models.RefreshToken;

namespace backend.Dtos.Account
{
    public class RefreshTokenResult
    {
        public string Token { get; set; } = string.Empty;
        public RefreshToken RefreshToken { get; set; }
    }
}