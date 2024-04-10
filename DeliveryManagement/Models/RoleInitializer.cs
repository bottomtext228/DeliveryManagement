using Microsoft.AspNetCore.Identity;

namespace DeliveryManagement.Models
{
    public class RoleInitializer
    {
        public static async Task InitializeAsync(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext dbContext)
        {
     

            if (await roleManager.FindByNameAsync("company") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("company"));
            }
            if (await roleManager.FindByNameAsync("client") == null)
            {
                await roleManager.CreateAsync(new IdentityRole("client"));
            }



            string userEmail = "yarik.popov1942@gmail.com";
            string password = "123123";
            if (await userManager.FindByNameAsync(userEmail) == null)
            {
                User user = new User { Email = userEmail, UserName = userEmail };
                IdentityResult result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "client");
                }
            }



            string adminEmail = "yarik.popov2015@yandex.ru";
            password = "123123";


            if (await userManager.FindByNameAsync(adminEmail) == null)
            {
                User admin = new User { Email = adminEmail, UserName = adminEmail };
                IdentityResult result = await userManager.CreateAsync(admin, password);
           
                if (result.Succeeded)
                {
           
                    var user = await userManager.FindByEmailAsync(adminEmail);

                    await userManager.AddToRoleAsync(user, "company");


                   
                    var company = new Company { UserId = user.Id, Description = "Empty description.", Name = "УралВагонЗавод" };

                    dbContext.Companies.Add(company);
                    dbContext.SaveChanges();
               

                }
            }


        }
    }
}
