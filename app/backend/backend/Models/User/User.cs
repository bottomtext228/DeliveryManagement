using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class User : IdentityUser
    {
        public ICollection<Order> Orders { get; set; }
        public User() { }
    }
}
