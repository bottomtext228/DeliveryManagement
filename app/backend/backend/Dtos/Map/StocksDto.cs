using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Map
{
    public class StocksDto
    {
        [Required]
        public List<int> TownIds { get; set; }
    }
}