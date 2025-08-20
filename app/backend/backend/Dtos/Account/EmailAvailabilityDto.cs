using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Account
{
    public class EmailAvailabilityDto
    {
        public bool Available { get; set; }
        public string? Message { get; set; }
    }
}