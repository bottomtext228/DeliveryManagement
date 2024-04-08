using System.Numerics;

namespace DeliveryManagement.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        //public string Category { get; set; }

        public int Price { get; set; }

        public record Vector(float x, float y, float z);
        public Vector Size { get; set; }

        public int Weight {  get; set; }

        //public string Image {  get; set; }


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
