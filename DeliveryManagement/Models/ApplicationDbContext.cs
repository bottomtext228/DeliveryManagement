using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace DeliveryManagement.Models
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<Company> Companies { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlite("Filename=Database.db");
            //options.UseInMemoryDatabase("TestDb");

        }
    }
}
