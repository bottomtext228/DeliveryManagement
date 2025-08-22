namespace backend.Dtos.Map
{
    public class ComputeRouteResponse
    {
        public float ShippingPrice { get; set; }
        public float ShippingTime { get; set; }
        public List<string> Towns { get; set; } = [];
        public bool IsRoutesEqual { get; set; }
    }
}