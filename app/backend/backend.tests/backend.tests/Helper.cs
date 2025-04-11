using backend.Services;
using Microsoft.Extensions.DependencyInjection;

namespace backend.tests
{
    public static class Helper
    {
        private static IServiceProvider Provider() {
            var services = new ServiceCollection();

            services.AddSingleton<CountryMap>();
            services.AddScoped<TownsGraphSearch>();
            return services.BuildServiceProvider();
        }

        public static T GetRequiredServices<T>() {
            var provider = Provider();


            return provider.GetRequiredService<T>();
        }
    }
}