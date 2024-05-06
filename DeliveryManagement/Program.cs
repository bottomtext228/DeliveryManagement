using DeliveryManagement.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DeliveryManagement.Services;
using DeliveryManagement.GraphSearch;
using System.Globalization;
using DeliveryManagement.Localisation;


//CultureInfo culture = CultureInfo.CreateSpecificCulture("en-US");

//CultureInfo.DefaultThreadCurrentCulture = culture;
//CultureInfo.DefaultThreadCurrentUICulture = culture;

//Thread.CurrentThread.CurrentCulture = culture;
//Thread.CurrentThread.CurrentUICulture = culture;
CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<CountryMap>();
builder.Services.AddScoped<TownsGraphSearch>();
builder.Services.AddControllersWithViews();

builder.Services.AddAuthentication().AddBearerToken(IdentityConstants.BearerScheme);

builder.Services.AddAuthorization();
builder.Services.AddDbContext<ApplicationDbContext>(builder =>
{
    builder.UseSqlite("Filename=db.db");
});
//builder.Services.AddDbContext<CompanyDbContext>();

builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    // if password requirements changed here
    // then password validation attributes in ViewModels must be changed too 
    options.Password.RequiredLength = 5;   // минимальная длина
    options.Password.RequireNonAlphanumeric = false;   // требуются ли не алфавитно-цифровые символы
    options.Password.RequireLowercase = false; // требуются ли символы в нижнем регистре
    options.Password.RequireUppercase = false; // требуются ли символы в верхнем регистре
    options.Password.RequireDigit = false; // требуются ли цифры

}).AddEntityFrameworkStores<ApplicationDbContext>()
.AddErrorDescriber<CustomIdentityErrorDescriber>();

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var userManager = services.GetRequiredService<UserManager<User>>();
        var rolesManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var dbContext = services.GetRequiredService<ApplicationDbContext>();

        if (dbContext.Database.GetPendingMigrations().Any())
        {
            dbContext.Database.Migrate();
        }

        await RoleInitializer.InitializeAsync(userManager, rolesManager, dbContext);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }


}

/**
 * 
 * TODO:
 * fix bug when deleting product it's still shown in Catalog/All
 * fix all html
 * make better map
 * 
*/



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

