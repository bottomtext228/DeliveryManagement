namespace backend.Dtos.PickUpPoint
{
    public class PickUpPointDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int TownId { get; set; }
        public string TownName { get; set; } = string.Empty;
    }
}