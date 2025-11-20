namespace backend.Errors
{
    public class FileErrors
    {
        private const string Prefix = "File";

        public static Error InvalidSize(int maxFileSize)
        {
            return Error.BadRequest(Prefix, $"Размер файла не должен превышать {maxFileSize} байт.");
        }

        public static Error InvalidFormat(string[] allowedExtensions)
        {
            return Error.BadRequest(Prefix, $"Файл не является допустимым форматом изображения. Допустимы только {string.Join(",", allowedExtensions)}.");
        }

        public static Error FailedToSave()
        {
            return Error.Internal(Prefix, "Не удалось сохранить файл.");
        }
    }
}