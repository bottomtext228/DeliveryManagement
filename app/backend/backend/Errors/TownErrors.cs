namespace backend.Errors
{
    public class TownErrors
    {
        private const string Prefix = "Town";
        public static Error NoTownsProvided()
        {
            return Error.BadRequest(Prefix, "Как минимум один город должен быть указан.");
        }

        public static Error DuplicateTowns(IEnumerable<int> duplicates)
        {
            return Error.BadRequest(Prefix, $"Найдены дубликаты ID городов: {string.Join(", ", duplicates)}.");
        }

        public static Error TownsNotFound(IEnumerable<int> missing)
        {
            return Error.BadRequest(Prefix, $"Города со следующими ID не найдены: {string.Join(", ", missing)}.");
        }
    }
}