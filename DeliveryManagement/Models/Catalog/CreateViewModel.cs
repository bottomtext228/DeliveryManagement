using DeliveryManagement.Attributes;
using System.ComponentModel.DataAnnotations;

namespace DeliveryManagement.Models.Catalog
{
    public class CreateViewModel
    {
   

        [Required]
        [Display(Name = "Название")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Описание")]
        public string Description { get; set; }
        //public string Category { get; set; }

        [Required]
        [Display(Name = "Стоимость")]
        [InvariantCultureParse]
        public string Price { get; set; }


        [Required]
        [Display(Name = "Размеры")]
        [InvariantCultureParse]

        public string SizeX { get; set; }       
             
        [Required]
        [InvariantCultureParse]
        public string SizeY { get; set; }
        [Required]
        [InvariantCultureParse]
        public string SizeZ { get; set; }

        [Required]
        [Display(Name = "Вес")]
        [InvariantCultureParse]
        public string Weight { get; set; }


        [Required]
        [Display(Name = "Изображение")]
        public IFormFile Image { get; set; }

    }
}
