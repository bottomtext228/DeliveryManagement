using System.ComponentModel.DataAnnotations;


namespace backend.Dtos.Account
{
    public class LoginRequestDto
    {
        [Required]
        [EmailAddress(ErrorMessage = "Неправильный формат почты")]
        [Display(Name = "Почта")]
        public string Email {get; set;} = string.Empty;
        [Required]
        [MinLength(5, ErrorMessage = "Пароль должен содержать как минимум {1} символов. ")]
        [Display(Name = "Пароль")]
        public string Password {get; set;} = string.Empty;
    }
}