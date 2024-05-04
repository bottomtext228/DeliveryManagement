using System.ComponentModel.DataAnnotations;

namespace DeliveryManagement.ViewModels.Account
{
    public class RegisterViewModel
    {
        [Required (ErrorMessage = "Почта обязательна!")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Неправильный формат почты!")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required (ErrorMessage = "Пароль обязателен!")]
        [DataType(DataType.Password)]
        [MinLength(5, ErrorMessage = "Пароль должен содержать как минимум {1} символов. ")]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [Display(Name = "Вы - компания?")]
        public bool AsCompany { get; set; }

        [Required(ErrorMessage = "Название обязательно!")]
        [Display(Name = "Название")]
        public string? CompanyName { get; set; }
        [Required(ErrorMessage = "Описание обязательно!")]
        [Display(Name = "Описание")]
        public string? CompanyDescription { get; set; }
    }
}
