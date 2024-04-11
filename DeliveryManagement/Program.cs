using DeliveryManagement.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using DeliveryManagement.Models.Map;
using DeliveryManagement.DijkstraAlgorith;
using DeliveryManagement.Services;

CultureInfo culture = CultureInfo.CreateSpecificCulture("en-US");

CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

Thread.CurrentThread.CurrentCulture = culture;
Thread.CurrentThread.CurrentUICulture = culture;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<CountryMap>();

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
    options.Password.RequiredLength = 5;   // ����������� �����
    options.Password.RequireNonAlphanumeric = false;   // ��������� �� �� ���������-�������� �������
    options.Password.RequireLowercase = false; // ��������� �� ������� � ������ ��������
    options.Password.RequireUppercase = false; // ��������� �� ������� � ������� ��������
    options.Password.RequireDigit = false; // ��������� �� �����
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



//string[] labels = graph.AllNodes.Select(s => s.Town.Name).ToArray();

//int?[,] adj = graph.CreatePriceAdjacencyMatrix();

//graph.PrintMatrix(ref adj, labels, graph.AllNodes.Count);

//graph.PrintPath(ref adj, labels, "������", "�����������");

//Console.WriteLine("-------------------------");


//adj = graph.CreateTimeAdjacencyMatrix();

//graph.PrintMatrix(ref adj, labels, graph.AllNodes.Count);

//graph.PrintPath(ref adj, labels, "������", "�����������");


//var pathSystem = new DijkstraAlgorithm(graph);
//var chepestPath = pathSystem.GetCheapestPath(towns[0], towns[^1]);

//chepestPath.Item2.ForEach(e => Console.WriteLine(e.Name));

//Console.WriteLine("-------------------------");
//var fastestPath = pathSystem.GetFastestPath(towns[0], towns[^1]);
//fastestPath.Item2.ForEach(e => Console.WriteLine(e.Name));



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



