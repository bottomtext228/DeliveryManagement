namespace backend.Dtos.Account
{
    public class EmailAvailabilityRequest
    {
        public bool Available { get; set; }
        public string? Message { get; set; }
    }
}