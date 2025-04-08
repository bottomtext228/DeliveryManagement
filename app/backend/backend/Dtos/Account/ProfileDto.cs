
namespace backend.Dtos.Account
{
    public class ProfileDto
    {
        public string Email {get; set;} = string.Empty;

        public List<string> Roles {get; set;} = [];
        public bool IsCompany { get; set; }
        public string? CompanyName {get; set; } = string.Empty;
        public string? CompanyDescription {get; set;} = string.Empty;


    }
}