
using backend.Dtos.Company;

namespace backend.Dtos.Account
{
    public class UserDto
    {
        public string Email { get; set; } = string.Empty;

        public List<string> Roles { get; set; } = [];

        public CompanyDto? Company { get; set; } = null; // not null if user is company
    }
}