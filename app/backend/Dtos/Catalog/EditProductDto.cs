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

        [Required(ErrorMessage = "Стоимость не может быть пустой!")]
        [Display(Name = "Стоимость")]
        public float Price { get; set; }

        [Required(ErrorMessage = "Длина не может быть пустой!")]
        [Display(Name = "Длина")]
        public float SizeX { get; set; }

        [Required(ErrorMessage = "Ширина не может быть пустой!")]
        [Display(Name = "Ширина")]
        public float SizeY { get; set; }

        [Required(ErrorMessage = "Высота не может быть пустой!")]
        [Display(Name = "Высота")]
        public float SizeZ { get; set; }

        [Required(ErrorMessage = "Вес не может быть пустым!")]
        [Display(Name = "Вес")]
        public float Weight { get; set; }


        //[Required(ErrorMessage = "Изображение обязательно!")]
        [Display(Name = "Изображение")]
        public IFormFile? Image { get; set; }

    }
}