using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.PickUpPoint
{
    public class GetPickUpPointsDto
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public int TownId { get; set; }
    }
}