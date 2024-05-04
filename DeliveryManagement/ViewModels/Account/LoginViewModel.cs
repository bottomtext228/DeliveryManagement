using System.ComponentModel.DataAnnotations;

namespace DeliveryManagement.ViewModels.Account
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Почта обязательна!")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Неправильный формат почты!")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Пароль обязателен!")]
        [DataType(DataType.Password)]
        [MinLength(5, ErrorMessage = "Пароль должен содержать как минимум {1} символов. ")]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

    }
}
