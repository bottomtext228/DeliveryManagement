using DeliveryManagement.Models.Map;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace DeliveryManagement.Models
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<Company> Companies { get; set; }
        public DbSet<Product> Products { get; set; }

        //public DbSet<Town> Towns { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<PickUpPoint> PickUpPoints { get; set; }

        public DbSet<Order> Orders { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {
            
        }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<User>()
        //        .HasMany(e => e.Orders)
        //        .WithOne(e => e.User)
        //        .HasForeignKey(e => e.UserId)
        //        .HasPrincipalKey(e => e.Id);
        //}
    }
}
