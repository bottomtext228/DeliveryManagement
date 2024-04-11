namespace DeliveryManagement.Models.Map
{
    public class PickUpPoint
    {
        public int Id { get; set; }

        public int TownId {  get; set; }
        //public Town Town { get; set; }

        public int CompanyId {  get; set; }
        public Company Company { get; set; }
    }
}
