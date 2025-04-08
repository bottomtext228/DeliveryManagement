using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Catalog
{
    public class EditProductDto
    {
        [Required(ErrorMessage = "Название не может быть пустым!")]
        [Display(Name = "Название")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Описание не может быть пустым!")]
        [Display(Name = "Описание")]
        public string Description { get; set; } = string.Empty;

         [Range(0, 1000000.0, ErrorMessage = "Стоимость не может быть больше 1 миллиона рублей!")] // 1 million
        [Required(ErrorMessage = "Стоимость не может быть пустой!")]
        [Display(Name = "Стоимость")]
        public float Price { get; set; }

        [Range(0, 10.0, ErrorMessage = "Длина не может быть больше 10 метров!")]
        [Required(ErrorMessage = "Длина не может быть пустой!")]
        [Display(Name = "Длина")]
        public float SizeX { get; set; }

        [Range(0, 10.0, ErrorMessage = "Ширина не может быть больше 10 метров!")]
        [Required(ErrorMessage = "Ширина не может быть пустой!")]
        [Display(Name = "Ширина")]
        public float SizeY { get; set; }

        [Range(0, 10.0, ErrorMessage = "Высота не может быть больше 10 метров!")]
        [Required(ErrorMessage = "Высота не может быть пустой!")]
        [Display(Name = "Высота")]
        public float SizeZ { get; set; }

        [Range(0, 1000.0, ErrorMessage = "Вес не может быть больше 1000 килограмм!")]
        [Required(ErrorMessage = "Вес не может быть пустым!")]
        [Display(Name = "Вес")]
        public float Weight { get; set; }

        //[Required(ErrorMessage = "Изображение обязательно!")]
        [Display(Name = "Изображение")]
        public IFormFile? Image { get; set; }

    }
}