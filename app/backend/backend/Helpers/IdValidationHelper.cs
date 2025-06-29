namespace backend.Helpers
{
    public class IdValidationHelper
    {
        /// <summary>
        /// Сhecks if inputIds has no duplicates and every element in inputIds is present in existingIds
        /// </summary>
        /// <param name="inputIds"></param>
        /// <param name="existingIds"></param>
        /// <returns></returns>
        public static (List<int> duplicates, List<int> missing) ValidateIds(IEnumerable<int> inputIds, IEnumerable<int> existingIds)
        {
            var duplicates = inputIds.GroupBy(id => id).Where(g => g.Count() > 1).Select(g => g.Key).ToList();
            var missing = inputIds.Where(id => !existingIds.Contains(id)).Distinct().ToList();
            return (duplicates, missing);
        }
    }
}