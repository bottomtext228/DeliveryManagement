using backend.Dtos.Company;
using backend.Models;

namespace backend.Mappers
{
    public static class CompanyMapper
    {
        public static CompanyDto ToCompanyDto(this Company company)
        {
            return new CompanyDto
            {
                Id = company.Id,
                Name = company.Name,
                Description = company.Description
            };
        }
    }
}