using backend.Models;
using backend.Models.Map;
using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public static class DbInitializer
    {
        /// <summary>
        /// Initialize db (check migrations, create roles).
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="roleManager"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public static async Task Initialize(ApplicationDbContext dbContext, RoleManager<IdentityRole> roleManager, ILogger logger)
        {
            logger.LogInformation("Initializing database.");

            // ensure DB is up to date
            await dbContext.Database.MigrateAsync();

            // role seeding
            if (!await roleManager.RoleExistsAsync("client"))
            {
                await roleManager.CreateAsync(new IdentityRole("client"));
            }

            if (!await roleManager.RoleExistsAsync("company"))
            {
                await roleManager.CreateAsync(new IdentityRole("company"));
            }
        }

        /// <summary>
        /// Seed database with test data (companies, clients, products).
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="userManager"></param>
        /// <param name="shouldSeedTestData"></param>
        /// <param name="logger"></param>
        /// <returns></returns>
        public static async Task Seed(ApplicationDbContext dbContext, UserManager<User> userManager, bool shouldSeedTestData, ILogger logger)
        {
            if (!shouldSeedTestData)
            {
                logger.LogInformation("Skipping database seeding. ShouldSeedTestData == false");
                return;
            }

            if (await dbContext.Users.AnyAsync())
            {
                logger.LogInformation("Skipping database seeding. The database is already seeded.");
                return;
            }

            logger.LogInformation("Seeding database with test data.");

            // companies
            var companyFaker = new Faker<Company>()
                .RuleFor(c => c.Name, f => f.Company.CompanyName())
                .RuleFor(c => c.Description, f => f.Company.CatchPhrase());

            // users
            var userFaker = new Faker<User>()
                .RuleFor(u => u.UserName, f => f.Internet.UserName())
                .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.UserName));
            string password = "123123";

            var townIds = Enumerable.Range(1, 17).ToList();

            // products
            var productImagePaths = new List<string>{
                "test/bolt-m16.jpg",
                "test/bolt-m6.png",
                "test/dupel-gvozd.jpg",
                "test/dupel.jpeg",
                "test/gajka-shestigrannaya.png",
                "test/gvozd-toleviy.jpg",
                "test/gvozd.jpg",
                "test/rim-bolt-m6.jpg",
                "test/shaiba.jpg",
                "test/shurup.jpg",
                "test/ugol.png",
                "test/ugolok.jpg",
                "test/vint.jpg",
                "test/chain.jpg",
                "test/cronshtein.jpg",
                "test/shpilka_m16.jpg",
                "test/shponka.jpg",
                "test/shtift.jpg"
            };

            var products = new List<Product>
            {
                new() { Name = "Болт М16", Description = "Стальной болт диаметром 16 мм для крепежных работ.", Price = 20m, Size = new Vector(0.01f, 0.02f, 0.01f), Weight = 0.001f, Image = productImagePaths[0] },
                new() { Name = "Болт М6", Description = "Надёжный болт диаметром 6 мм для мелких конструкций.", Price = 10m, Size = new Vector(0.005f, 0.01f, 0.005f), Weight = 0.0005f, Image = productImagePaths[1] },
                new() { Name = "Дупель гвоздь", Description = "Пластиковый дупель для крепления гвоздей и шурупов.", Price = 5m, Size = new Vector(0.02f, 0.03f, 0.01f), Weight = 0.002f, Image = productImagePaths[2] },
                new() { Name = "Дупель", Description = "Качественный крепёжный дупель для стен и гипсокартона.", Price = 4m, Size = new Vector(0.02f, 0.03f, 0.01f), Weight = 0.002f, Image = productImagePaths[3] },
                new() { Name = "Гайка шестигранная", Description = "Стальная шестигранная гайка для болтов.", Price = 2m, Size = new Vector(0.01f, 0.01f, 0.01f), Weight = 0.0005f, Image = productImagePaths[4] },
                new() { Name = "Гвоздь толевый", Description = "Толевый гвоздь для строительных и отделочных работ.", Price = 6m, Size = new Vector(0.02f, 0.05f, 0.002f), Weight = 0.001f, Image = productImagePaths[5] },
                new() { Name = "Гвоздь", Description = "Универсальный строительный гвоздь.", Price = 5m, Size = new Vector(0.02f, 0.04f, 0.002f), Weight = 0.001f, Image = productImagePaths[6] },
                new() { Name = "Рим болт М6", Description = "Болт с кольцом М6 для крепления подвесных конструкций.", Price = 12m, Size = new Vector(0.01f, 0.02f, 0.01f), Weight = 0.001f, Image = productImagePaths[7] },
                new() { Name = "Шайба", Description = "Металлическая шайба для распределения нагрузки болтов и гаек.", Price = 1m, Size = new Vector(0.01f, 0.01f, 0.001f), Weight = 0.0001f, Image = productImagePaths[8] },
                new() { Name = "Шуруп", Description = "Самонарезающий шуруп для дерева и пластика.", Price = 3m, Size = new Vector(0.01f, 0.03f, 0.01f), Weight = 0.0005f, Image = productImagePaths[9] },
                new() { Name = "Угол", Description = "Металлический уголок для усиления конструкций.", Price = 8m, Size = new Vector(0.05f, 0.05f, 0.01f), Weight = 0.01f, Image = productImagePaths[10] },
                new() { Name = "Уголок", Description = "Прочный уголок для крепления и соединения деталей.", Price = 9m, Size = new Vector(0.05f, 0.05f, 0.01f), Weight = 0.01f, Image = productImagePaths[11] },
                new() { Name = "Винт", Description = "Классический винт для сборки мебели и каркасов.", Price = 2.5m, Size = new Vector(0.005f, 0.02f, 0.005f), Weight = 0.0003f, Image = productImagePaths[12] },
                new() { Name = "Цепь", Description = "Цель стальная для крепления.", Price = 255m, Size = new Vector(3f, 0.02f, 0.01f), Weight = 50, Image = productImagePaths[13]},
                new() { Name = "Кронштейн", Description = "Металлический кронштейн для крепления конструкций на стену.", Price = 15m, Size = new Vector(0.1f, 0.05f, 0.01f), Weight = 0.5f, Image = productImagePaths[14] },
                new() { Name = "Шпилька М16", Description = "Длинная стальная шпилька диаметром 16 мм для сборки конструкций.", Price = 18m, Size = new Vector(0.02f, 0.16f, 0.02f), Weight = 0.3f, Image = productImagePaths[15] },
                new() { Name = "Шпонка", Description = "Металлическая шпонка для соединения валов и шестерен.", Price = 7m, Size = new Vector(0.01f, 0.05f, 0.01f), Weight = 0.05f, Image = productImagePaths[16] },
                new() { Name = "Штифт", Description = "Стальной штифт для фиксации деталей.", Price = 3m, Size = new Vector(0.005f, 0.02f, 0.005f), Weight = 0.01f, Image = productImagePaths[17] }
            };

            // generate fake clients
            var fakeClients = userFaker.Generate(20);

            foreach (var clientUser in fakeClients)
            {
                var result = await userManager.CreateAsync(clientUser, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(clientUser, "client");
                }
            }

            // generate fake companies
            var fakeCompanyUsers = userFaker.Generate(10);
            var companies = companyFaker.Generate(10);
            for (int i = 0; i < fakeCompanyUsers.Count; i++)
            {
                var companyUser = fakeCompanyUsers[i];
                var company = companies[i];

                var result = await userManager.CreateAsync(companyUser, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(companyUser, "company");

                    company.UserId = companyUser.Id;
                    dbContext.Add(company);
                    await dbContext.SaveChangesAsync();

                    var random = new Random();

                    var uniqueTownIdsForStocks = townIds
                        .OrderBy(_ => random.Next())
                        .Take(random.Next(2, 5))
                        .ToList();

                    foreach (var townId in uniqueTownIdsForStocks)
                    {
                        var stock = new Stock
                        {
                            CompanyId = company.Id,
                            TownId = townId
                        };
                        dbContext.Stocks.Add(stock);
                    }

                    var uniqueTownIdsForPickUpPoints = townIds
                        .OrderBy(_ => random.Next())
                        .Take(random.Next(2, 5))
                        .ToList();

                    foreach (var townId in uniqueTownIdsForPickUpPoints)
                    {
                        var pickUpPoint = new PickUpPoint
                        {
                            CompanyId = company.Id,
                            TownId = townId
                        };
                        dbContext.PickUpPoints.Add(pickUpPoint);
                    }

                    var fakeProducts = products.OrderBy(e => random.Next()).Take(random.Next(3, 8)).ToList();

                    foreach (var product in fakeProducts)
                    {
                        var copy = new Product
                        {
                            Name = product.Name,
                            Description = product.Description,
                            Price = product.Price,
                            Size = product.Size,
                            Weight = product.Weight,
                            Image = product.Image,
                            CompanyId = company.Id
                        };
                        dbContext.Products.Add(copy);
                    }
                }
            }

            // create client and company users with known login data
            string userEmail = "client@mail.com";
            if (await userManager.FindByNameAsync(userEmail) == null)
            {
                var clientUser = new User { Email = userEmail, UserName = userEmail };
                var result = await userManager.CreateAsync(clientUser, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(clientUser, "client");
                }
            }

            string companyEmail = "company@mail.com";
            if (await userManager.FindByNameAsync(companyEmail) == null)
            {
                var companyUser = new User { Email = companyEmail, UserName = companyEmail };
                var result = await userManager.CreateAsync(companyUser, password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(companyUser, "company");

                    var company = new Company
                    {
                        UserId = companyUser.Id,
                        Description = "АО «Научно-производственная корпорация „Уралвагонзавод“ имени Ф. Э. Дзержинского» — советская и российская корпорация, занимающаяся разработкой и производством военной техники, дорожно-строительных машин, железнодорожных вагонов. В корпорацию входят научно-исследовательские институты, конструкторские бюро и производственные предприятия. Головное предприятие — завод «Уралвагонзавод», расположенный в Нижнем Тагиле Свердловской области.",
                        Name = "УралВагонЗавод"
                    };

                    dbContext.Companies.Add(company);
                    await dbContext.SaveChangesAsync();

                    var random = new Random();

                    var uniqueTownIdsForStocks = townIds
                        .OrderBy(_ => random.Next())
                        .Take(random.Next(2, 5))
                        .ToList();

                    foreach (var townId in uniqueTownIdsForStocks)
                    {
                        var stock = new Stock
                        {
                            CompanyId = company.Id,
                            TownId = townId
                        };
                        dbContext.Stocks.Add(stock);
                    }

                    var uniqueTownIdsForPickUpPoints = townIds
                        .OrderBy(_ => random.Next())
                        .Take(random.Next(2, 5))
                        .ToList();

                    foreach (var townId in uniqueTownIdsForPickUpPoints)
                    {
                        var pickUpPoint = new PickUpPoint
                        {
                            CompanyId = company.Id,
                            TownId = townId
                        };
                        dbContext.PickUpPoints.Add(pickUpPoint);
                    }


                    var fakeProducts = products.OrderBy(e => random.Next()).Take(10).ToList();

                    foreach (var product in fakeProducts)
                    {
                        var copy = new Product
                        {
                            Name = product.Name,
                            Description = product.Description,
                            Price = product.Price,
                            Size = product.Size,
                            Weight = product.Weight,
                            Image = product.Image,
                            CompanyId = company.Id
                        };
                        dbContext.Products.Add(copy);
                    }
                }
            }

            await dbContext.SaveChangesAsync();

            logger.LogInformation("Finished seeding database.");
        }
    }
}