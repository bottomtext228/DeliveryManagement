namespace backend.Dtos.Company
{
    public class UpdateCompanyDetailsRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}