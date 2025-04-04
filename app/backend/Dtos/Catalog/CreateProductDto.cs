using System.ComponentModel.DataAnnotations;


namespace backend.Dtos.Catalog
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Название не может быть пустым!")]
        [Display(Name = "Название")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Описание не может быть пустым!")]
        [Display(Name = "Описание")]
        public string Description { get; set; } = string.Empty;

        [Range(0, float.MaxValue)]
        [Required(ErrorMessage = "Стоимость не может быть пустой!")]
        [Display(Name = "Стоимость")]
        public float Price { get; set; }

        [Range(0, float.MaxValue)]
        [Required(ErrorMessage = "Длина не может быть пустой!")]
        [Display(Name = "Длина")]
        public float SizeX { get; set; }

        [Range(0, float.MaxValue)]
        [Required(ErrorMessage = "Ширина не может быть пустой!")]
        [Display(Name = "Ширина")]
        public float SizeY { get; set; }

        [Range(0, float.MaxValue)]
        [Required(ErrorMessage = "Высота не может быть пустой!")]
        [Display(Name = "Высота")]
        public float SizeZ { get; set; }

        [Range(0, float.MaxValue)]
        [Required(ErrorMessage = "Вес не может быть пустым!")]
        [Display(Name = "Вес")]
        public float Weight { get; set; }

        [Required(ErrorMessage = "Изображение обязательно!")]
        [Display(Name = "Изображение")]
        public IFormFile Image { get; set; } = null!;

    }
}