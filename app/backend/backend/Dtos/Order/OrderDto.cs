using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models.Map;

namespace backend.Dtos.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public List<int> TownIds { get; set; }
        public float FinalPrice { get; set; }
        public int Quantity { get; set; }
    }
}