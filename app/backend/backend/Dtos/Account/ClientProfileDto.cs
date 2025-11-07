namespace backend.Dtos.Account
{
    public class ClientProfileDto
    {
        public int OrdersCount { get; set; }

        public decimal OrdersCost { get; set; }

        public int ProductsInCartCount { get; set; }
    }
}