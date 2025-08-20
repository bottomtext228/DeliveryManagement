namespace backend.Errors
{
    public class TownErrors
    {
        private const string Prefix = "Town";
        public static Error NoTownsProvided()
        {
            return Error.BadRequest(Prefix, "At least one town must be provided.");
        }

        public static Error DuplicateTowns(IEnumerable<int> duplicates)
        {
            return Error.BadRequest(Prefix, $"Duplicate town IDs found: {string.Join(", ", duplicates)}");
        }

        public static Error TownsNotFound(IEnumerable<int> missing)
        {
            return Error.BadRequest(Prefix, $"The following towns with IDs not found: {string.Join(", ", missing)}");
        }
    }
}