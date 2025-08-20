namespace backend.Errors
{
    public static class PickUpPointErrors
    {
        private const string Prefix = "PickUpPoint";

        public static Error NotFound(int townId)
        {
            return Error.NotFound(Prefix, $"PickUpPoint with Town ID {townId} not found.");
        }
    }
}