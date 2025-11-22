using System.Globalization;
using System.Net;
using backend;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using backend.Localisation;
using backend.Interfaces;
using backend.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using backend.Helpers;
using System.Text.Json.Serialization;
using backend.Interfaces.Services;
using backend.Options;
using Microsoft.AspNetCore.HttpOverrides;


CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Delivery Management", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });

    var xmlFile = "backend.xml"; // Adjust path if needed
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    option.IncludeXmlComments(xmlPath);
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });


// handle 500 status code
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails(); // needed for exception handler

builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    // if password requirements changed here
    // then password validation attributes in ViewModels must be changed too 
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireDigit = false;

}).AddEntityFrameworkStores<ApplicationDbContext>()
.AddErrorDescriber<CustomIdentityErrorDescriber>();

builder.Services
    .AddOptions<JwtOptions>()
    .Bind(builder.Configuration.GetSection("JWT"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

// AddAuthentication must be below AddIdentity!
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultScheme =
    options.DefaultForbidScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    // parsing options again because we can't take it using DI now
    var jwtOptions = builder.Configuration.GetSection("JWT").Get<JwtOptions>()!;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtOptions.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtOptions.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),
        ClockSkew = TimeSpan.FromSeconds(15)
    };
    options.Events = new JwtBearerEvents
    {
        // handle 401 status code
        OnChallenge = JwtBearerEventHandlers.HandleOnChallenge,
        // handle 403 status code
        OnForbidden = JwtBearerEventHandlers.HandleOnForbidden
    };
});


builder.Services.AddAuthorization();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = RateLimiterHandlers.OnRejected;

    options.AddPolicy("per-user", RateLimiterHandlers.PerUserPolicy);
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        {
            policy.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
        }
    });
});

if (!builder.Environment.IsDevelopment())
{
    var proxyOptions = builder.Configuration.GetSection("Proxy").Get<ProxyOptions>()
     ?? throw new Exception("Proxy options must not be null.");

    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        options.ForwardLimit = proxyOptions.ForwardLimit;

        if (proxyOptions.KnownProxies != null)
        {
            foreach (var ip in proxyOptions.KnownProxies)
            {
                options.KnownProxies.Add(IPAddress.Parse(ip));
            }
        }
    });
}

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var title = "Произошла одна или несколько ошибок валидации.";

        // convert ModelState to Dictonary<string, string[]>
        var errors = context.ModelState
            .Where(ms => ms.Value!.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
            );

        return ApiResponseHelper.ValidationProblem(context.HttpContext, errors, title);
    };
});

// Services
builder.Services.AddHealthChecks();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddSingleton<IFileService>(sp =>
{
    var logger = sp.GetRequiredService<ILogger<FileService>>();
    string saveDirectory = Path.Combine(builder.Environment.WebRootPath, "images");
    string[] allowedExtensions = [".jpg", ".jpeg", ".png"];
    int maxFileSizeInBytes = 10_000_000;

    return new FileService(logger, saveDirectory, allowedExtensions, maxFileSizeInBytes);
});
builder.Services.AddSingleton<CountryMap>();
builder.Services.AddScoped<TownsGraphSearch>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IMapService, MapService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPickUpPointService, PickUpPointService>();
builder.Services.AddScoped<IStockService, StockService>();
builder.Services.AddScoped<ICartService, CartService>();

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var dbContext = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<User>>();
        var rolesManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        // always ensure migrations & roles
        await DbInitializer.Initialize(dbContext, rolesManager, logger);

        // read env variable
        bool shouldSeedTestData = builder.Configuration.GetValue<bool>("SEED_TEST_DATA");

        // seed test data if needed
        await DbInitializer.Seed(dbContext, userManager, shouldSeedTestData, logger);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing/seeding the database.");
    }
}


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseForwardedHeaders();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// needed for exception handler
app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

app.UseRateLimiter();

app.MapControllers().RequireRateLimiting("per-user");

app.MapHealthChecks("/health");

app.UseStaticFiles();

// Handle 404 status code
app.UseMiddleware<NotFoundMiddleware>();
app.UseMiddleware<TaskCancellationHandlingMiddleware>();

app.Run();

