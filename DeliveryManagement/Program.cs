using DeliveryManagement.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DeliveryManagement.Services;
using DeliveryManagement.GraphSearch;


//CultureInfo culture = CultureInfo.CreateSpecificCulture("en-US");

//CultureInfo.DefaultThreadCurrentCulture = culture;
//CultureInfo.DefaultThreadCurrentUICulture = culture;

//Thread.CurrentThread.CurrentCulture = culture;
//Thread.CurrentThread.CurrentUICulture = culture;

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
    options.Password.RequiredLength = 5;   // минимальная длина
    options.Password.RequireNonAlphanumeric = false;   // требуются ли не алфавитно-цифровые символы
    options.Password.RequireLowercase = false; // требуются ли символы в нижнем регистре
    options.Password.RequireUppercase = false; // требуются ли символы в верхнем регистре
    options.Password.RequireDigit = false; // требуются ли цифры
}).AddEntityFrameworkStores<ApplicationDbContext>();
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
 * make order products
 * fix all html
 * make better map
 * 
*/

//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;

//    var map = services.GetRequiredService<CountryMap>();
//    var graphSearch = services.GetRequiredService<TownsGraphSearch>();

//    var dbContext = services.GetRequiredService<ApplicationDbContext>();


//    string[] labels = map.Graph.AllNodes.Select(s => s.Town.Name).ToArray();

//    int?[,] adj = map.Graph.CreateTimeAdjacencyMatrix();

//    map.Graph.PrintMatrix(ref adj, labels, map.Graph.AllNodes.Count);

//    map.Graph.PrintPath(ref adj, labels, "Рязань", "Санкт-Петербург");

//    var company = dbContext.Companies.Include(c => c.Stocks).FirstOrDefault();
//    var town = map.Towns.ToList()[10];
    


//}


//string[] labels = graph.AllNodes.Select(s => s.Town.Name).ToArray();

//int?[,] adj = graph.CreatePriceAdjacencyMatrix();

//graph.PrintMatrix(ref adj, labels, graph.AllNodes.Count);

//graph.PrintPath(ref adj, labels, "Москва", "Давлеканово");

//Console.WriteLine("-------------------------");


//adj = graph.CreateTimeAdjacencyMatrix();

//graph.PrintMatrix(ref adj, labels, graph.AllNodes.Count);

//graph.PrintPath(ref adj, labels, "Москва", "Давлеканово");


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



