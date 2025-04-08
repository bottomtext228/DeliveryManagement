
namespace backend.Dtos.Account
{
    public class NewLoginDto
    {
        public string Email { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = [];
        public string Token { get; set; } = string.Empty;
    }
}