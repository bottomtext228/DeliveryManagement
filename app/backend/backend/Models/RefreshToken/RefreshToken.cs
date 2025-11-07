using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace backend.Models.RefreshToken
{
    [Index(nameof(Token), IsUnique = true)]
    public class RefreshToken
    {
        public int Id { get; set; }
        [MaxLength(200)]
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; }
        public DateTime ExpiresOn { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}