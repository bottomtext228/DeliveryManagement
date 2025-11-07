using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Account
{
    public class LoginRequest
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
    }
}