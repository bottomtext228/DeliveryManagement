using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Account
{
    public class ProfileDto
    {
        public string Email {get; set;} = string.Empty;
        public bool IsCompany { get; set; }
        public string? CompanyName {get; set; } = string.Empty;
        public string? CompanyDescription {get; set;} = string.Empty;


    }
}