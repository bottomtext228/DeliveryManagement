
namespace backend.Dtos.Account
{
    public class NewLoginDto
    {
        public UserDto User { get; set; }
        public string Token { get; set; } = string.Empty;
     /*    public string RefreshToken { get; set; } = string.Empty; */
    }
}