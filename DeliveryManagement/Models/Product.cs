using System.Numerics;

namespace DeliveryManagement.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        //public string Category { get; set; }

        public float Price { get; set; }

        public float SizeX { get; set; } // can't map vector3 or tuple to database
        public float SizeY { get; set; }
        public float SizeZ { get; set; }
        public float Weight { get; set; }

        public byte[] Image { get; set; }


        public int CompanyId { get; set; }
        public Company Company { get; set; }
       
        //        Минимальный набор информационных полей из которых состоит
        //сущность “Изделие производства”
        //● Название изделия
        //● Фотография
        //● Стоимость
        //● Размеры
        //● Масса
        //● Описание
    }
}
