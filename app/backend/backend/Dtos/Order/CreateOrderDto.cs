using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Order
{
    public class CreateOrderDto
    {
        public int ProductId { get; set; }
        public int StockId { get; set; }
        public int PickUpPointId { get; set; }

   /*      public int Quantity { get; set; } */

    }
}