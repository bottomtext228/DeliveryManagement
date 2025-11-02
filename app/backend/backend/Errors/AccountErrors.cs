using backend.Dtos;
using backend.Models;

namespace backend.Errors
{
    public class AccountErrors
    {
        private const string Prefix = "Account";

        public static Error NotFound(string userId)
        {
            return Error.NotFound(Prefix, $"Пользователь с ID {userId} не найден.");
        }

        public static Error TakenEmail(string email)
        {
            return Error.Validation(Prefix, $"Email '{email}' уже занят.");
        }

        public static Error InvalidCredentials()
        {
            return Error.BadRequest(Prefix, "Неправильный логин или пароль.");
        }

        public static Error MissingRefreshToken()
        {
            return Error.BadRequest(Prefix, "Отсутствует refresh token.");
        }

        public static Error ExpiredRefreshToken()
        {
            return Error.BadRequest(Prefix, "Срок действия refresh token истёк.");
        }

        public static Error NullCompanyName()
        {
            return Error.Validation(Prefix, $"Поле '{nameof(RegisterDto.CompanyName)}' не может быть пустым, пока поле '{nameof(RegisterDto.AsCompany)}' равняется true");
        }

        public static Error NullCompanyDescription()
        {
            return Error.Validation(Prefix, $"Поле '{nameof(RegisterDto.CompanyDescription)}' не может быть пустым, пока поле '{nameof(RegisterDto.AsCompany)}' равняется true");
        }

        public static Error TakenCompanyName(string name)
        {
            return Error.Validation(Prefix, $"Название компании'{name}' уже занято.");
        }
    }
}