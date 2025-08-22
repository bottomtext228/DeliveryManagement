namespace backend.Dtos.Stock
{
    public class GetStocksDto
    {
        public int Id { get; set; }
        public int TownId { get; set; }
        public int CompanyId { get; set; }
    }
}