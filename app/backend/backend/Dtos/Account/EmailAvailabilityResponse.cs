namespace backend.Dtos.Account
{
    public class EmailAvailabilityResponse
    {
        public bool Available { get; set; }
        public string? Message { get; set; }
    }
}