using Microsoft.EntityFrameworkCore;

namespace DeliveryManagement.Models
{
    public class CompanyDbContext : DbContext
    {
        public DbSet<Company> Companies { get; set; }
        public CompanyDbContext(DbContextOptions<CompanyDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseInMemoryDatabase("TestDb");

        }
    }
}
