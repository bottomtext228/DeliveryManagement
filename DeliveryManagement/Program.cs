using DeliveryManagement.Models;
using Microsoft.AspNetCore.Identity;
using System.Globalization;


CultureInfo culture;
culture = CultureInfo.CreateSpecificCulture("en-US");
Thread.CurrentThread.CurrentCulture = culture;
Thread.CurrentThread.CurrentUICulture = culture;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddAuthentication().AddBearerToken(IdentityConstants.BearerScheme);

builder.Services.AddAuthorization();
builder.Services.AddDbContext<ApplicationDbContext>();
//builder.Services.AddDbContext<CompanyDbContext>();

builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequiredLength = 5;   // минимальная длина
    options.Password.RequireNonAlphanumeric = false;   // требуются ли не алфавитно-цифровые символы
    options.Password.RequireLowercase = false; // требуются ли символы в нижнем регистре
    options.Password.RequireUppercase = false; // требуются ли символы в верхнем регистре
    options.Password.RequireDigit = false; // требуются ли цифры
}).AddEntityFrameworkStores<ApplicationDbContext>();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var userManager = services.GetRequiredService<UserManager<User>>();
        var rolesManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var dbContext = services.GetRequiredService<ApplicationDbContext>();
        await RoleInitializer.InitializeAsync(userManager, rolesManager, dbContext);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }

}

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



