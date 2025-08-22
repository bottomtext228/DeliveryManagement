namespace backend.Dtos.Account
{
    public class LoginResponse
    {
        public UserDto User { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}