using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.PickUpPoint;
using backend.Models.Map;

namespace backend.Mappers
{
    public static class PickUpPointMapper
    {
        public static PickUpPointDto ToPickUpPointDto(this PickUpPoint pickUpPoint, List<Town> towns)
        {
            return new PickUpPointDto
            {
                Id = pickUpPoint.Id,
                CompanyId = pickUpPoint.CompanyId,
                TownId = pickUpPoint.TownId,
                TownName = towns.Find(e => e.Id == pickUpPoint.TownId)!.Name
            };
        }
    }
}