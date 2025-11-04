namespace backend.Dtos.Account
{
    public class ClientProfileDto
    {
        public int OrdersCount { get; set; }

        public float OrdersCost { get; set; }

        public int ProductsInCartCount { get; set; }
    }
}