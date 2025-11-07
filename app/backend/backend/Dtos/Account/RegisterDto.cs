using System.ComponentModel.DataAnnotations;

namespace backend.Dtos
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "{0} обязательна.")]
        [EmailAddress(ErrorMessage = "Неправильный формат почты")]
        [StringLength(254, ErrorMessage = "{0} не должна превышать длину в {1} символов.")]
        [Display(Name = "Почта")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "{0} обязателен.")]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "{0} должен иметь длину от {2} до {1} символов.")]
        [Display(Name = "Пароль")]
        public string Password { get; set; } = string.Empty;

        [Display(Name = "Вы - компания?")]
        public bool AsCompany { get; set; } = false;

        //[Required(ErrorMessage = "Название обязательно!")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "{0} должно иметь длину от {2} до {1} символов.")]
        [Display(Name = "Название компании")]
        public string? CompanyName { get; set; }

        //[Required(ErrorMessage = "Описание обязательно!")]
        [StringLength(2000, ErrorMessage = "{0} не должно превышать длину в {1} символов.")]
        [Display(Name = "Описание компании")]
        public string? CompanyDescription { get; set; }
    }
}