using Microsoft.AspNetCore.Identity;

namespace DeliveryManagement.Models
{
    public class User : IdentityUser
    {
        public ICollection<Order> Orders { get; set; }
        public User() { }
    }
}
