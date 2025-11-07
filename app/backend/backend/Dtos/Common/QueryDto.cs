using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Common
{
    public class QueryDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Номер страницы должен быть как минимум {1}.")]
        public int PageNumber { get; set; } = 1;
        [Range(1, 100, ErrorMessage = "Размер страницы должен быть между {1} и {2}.")]
        public int PageSize { get; set; } = 20;
    }
}