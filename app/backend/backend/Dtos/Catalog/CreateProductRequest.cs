using System.ComponentModel.DataAnnotations;


namespace backend.Dtos.Catalog
{
    public class CreateProductRequest
    {
        [Required(ErrorMessage = "{0} не может быть пустым!")]
        [Display(Name = "Название")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "{0} должно иметь длину от {2} до {1} символов.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "{0} не может быть пустым!")]
        [Display(Name = "Описание")]
        [StringLength(2000, ErrorMessage = "{0} не должно превышать длину в {1} символов.")]
        public string Description { get; set; } = string.Empty;

        [Range(0, 1000000.0, ErrorMessage = "{0} должна быть в диапазоне от {1} до {2} рублей.")] // 1 million
        [Required(ErrorMessage = "{0} не может быть пустой!")]
        [Display(Name = "Стоимость")]
        public decimal Price { get; set; }

        [Range(0, 10.0, ErrorMessage = "{0} должна быть в диапазоне от {1} до {2} метров.")]
        [Required(ErrorMessage = "{0} не может быть пустой!")]
        [Display(Name = "Длина")]
        public float SizeX { get; set; }

        [Range(0, 10.0, ErrorMessage = "{0} должна быть в диапазоне от {1} до {2} метров.")]
        [Required(ErrorMessage = "{0} не может быть пустой!")]
        [Display(Name = "Ширина")]
        public float SizeY { get; set; }

        [Range(0, 10.0, ErrorMessage = "{0} должна быть в диапазоне от {1} до {2} метров.")]
        [Required(ErrorMessage = "{0} не может быть пустой!")]
        [Display(Name = "Высота")]
        public float SizeZ { get; set; }

        [Range(0, 1000.0, ErrorMessage = "{0} должен быть в диапазоне от {1} до {2} килограмм.")]
        [Required(ErrorMessage = "{0} не может быть пустым!")]
        [Display(Name = "Вес")]
        public float Weight { get; set; }

        [Required(ErrorMessage = "Изображение обязательно!")]
        [Display(Name = "Изображение")]
        public IFormFile Image { get; set; } = null!;

    }
}