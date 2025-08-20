using backend.Models;

namespace backend.Dtos.Account
{
    public class LoginResult
    {
        public UserDto User { get; set; }
        public string Token { get; set; } = string.Empty;
        public RefreshToken RefreshToken { get; set; }
    }
}