using System.ComponentModel.DataAnnotations;

namespace backend.Dtos.Company
{
    public class UpdateCompanyDetailsRequest
    {
        [StringLength(200, MinimumLength = 2, ErrorMessage = "{0} должно иметь длину от {2} до {1} символов.")]
        [Display(Name = "Название")]
        public string Name { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "{0} не должно превышать длину в {1} символов.")]
        [Display(Name = "Описание")]
        public string Description { get; set; } = string.Empty;
    }
}