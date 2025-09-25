namespace backend.Dtos.Account
{
    public class CompanyProfileDto
    {
        public int OrdersCount { get; set; }

        public int OrderedProductsCount { get; set; }

        public int PickUpPointsCount { get; set; }

        public int StocksCount { get; set; }
        
        public int ProductsCount { get; set; }
    }
}