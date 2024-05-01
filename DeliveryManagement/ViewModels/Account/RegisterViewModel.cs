﻿using System.ComponentModel.DataAnnotations;

namespace DeliveryManagement.ViewModels.Account
{
    public class RegisterViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [Display(Name = "Вы - компания?")]
        public bool AsCompany { get; set; }

        [Display(Name = "Название")]
        public string? CompanyName { get; set; }
        [Display(Name = "Описание")]
        public string? CompanyDescription { get; set; }
    }
}
