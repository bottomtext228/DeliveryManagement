using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DeliveryManagement.Models.Account
{
    public class UserViewModel
    {

        [Display(Name = "Имя")]
        public string Name { get; set; }
        [Display(Name = "Почта")]
        public string Email { get; set; }

        public bool isCompany { get; set; }

        public string companyDesciption { get; set; }



    }
}
