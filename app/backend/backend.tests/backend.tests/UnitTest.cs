
using backend.Models.Map;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Moq;
using Microsoft.AspNetCore.Identity;
namespace backend.tests;

public class UnitTest
{
    private readonly CountryMap _countryMap;
    private readonly Mock<TownsGraphSearch> _graphSearch = new Mock<TownsGraphSearch>();

    private readonly ApplicationDbContext _dbContext;
/*     public UnitTest()
    {

        _graphSearch.Setup
        _dbContext = GetInMemoryDbContext();
        _countryMap = Helper.GetRequiredServices<CountryMap>(); ;
        _graphSearch = Helper.GetRequiredServices<TownsGraphSearch>();
    }

    [Fact]
    public void Test()
    {
        var town1 = _countryMap.Towns[0];
        var town2 = _countryMap.Towns[1];
        var town3 = _countryMap.Towns[2];

        var result = _graphSearch.ComputeRoute([town1, town2], town3);
        Console.WriteLine(result.Item1.Item1);
        Assert.True(true);
    }
 */


    /*  [Fact]
     public void Test()
     {
         var user = new User { Email = "test@gmail.com", PasswordHash = "228" };


     }


     private ApplicationDbContext GetInMemoryDbContext()
     {
         var options = new DbContextOptionsBuilder<ApplicationDbContext>()
             .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // New DB per test
             .Options;

         return new ApplicationDbContext(options);
     } */


    [Fact]
    public async Task CreateUser_ShouldSucceed()
    {
        // Arrange
        var mockUserManager = GetMockUserManager();
        var testUser = new User { Email = "test@example.com" };

        // Simulate success result
        mockUserManager
            .Setup(x => x.CreateAsync(It.IsAny<IdentityUser>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await mockUserManager.Object.CreateAsync(testUser, "Test@123");

        // Assert
        Assert.True(result.Succeeded);
    }
    private Mock<UserManager<IdentityUser>> GetMockUserManager()
    {
        var store = new Mock<IUserStore<IdentityUser>>();

        return new Mock<UserManager<IdentityUser>>(
            store.Object,
            null, null, null, null, null, null, null, null
        );
    }
}
