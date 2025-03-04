using System.ComponentModel.DataAnnotations;

namespace backend.Dtos
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Почта обязательна!")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress(ErrorMessage = "Неправильный формат почты!")]
        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Пароль обязателен!")]
        [DataType(DataType.Password)]
        [MinLength(5, ErrorMessage = "Пароль должен содержать как минимум {1} символов. ")]
        [Display(Name = "Пароль")]
        public string Password { get; set; } = string.Empty;

        [Display(Name = "Вы - компания?")]
        public bool AsCompany { get; set; } = false;

        //[Required(ErrorMessage = "Название обязательно!")]
        [Display(Name = "Название компании")]
        public string? CompanyName { get; set; }
        //[Required(ErrorMessage = "Описание обязательно!")]
        [Display(Name = "Описание компании")]
        public string? CompanyDescription { get; set; }
    }
}