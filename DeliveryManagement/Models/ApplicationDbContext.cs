using DeliveryManagement.Models.Map;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Globalization;


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
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            modelBuilder.Entity<Product>()
                .ComplexProperty(e => e.Size);


            var converter = new ValueConverter<List<int>, string>(
                v => string.Join(";", v),
                v => v.Split(";", StringSplitOptions.RemoveEmptyEntries).Select(value => int.Parse(value, CultureInfo.InvariantCulture)).ToList()
            );


            modelBuilder.Entity<Order>()
                .Property(e => e.TownIds)
                .HasConversion(converter, new ValueComparer<List<int>>(
            (c1, c2) => c1.SequenceEqual(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()));
            base.OnModelCreating(modelBuilder);
        }
    }
}
