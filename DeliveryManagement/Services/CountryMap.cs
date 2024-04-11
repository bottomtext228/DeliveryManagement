using DeliveryManagement.DijkstraAlgorith;
using DeliveryManagement.Models.Map;

namespace DeliveryManagement.Services
{
    public class CountryMap
    {
        public List<Town> Towns = new();

        public Graph Graph { get; set; }
        public CountryMap()
        {


            var towns = new[]
            {
                new Town(1, 40, 50, "Москва"),
                new Town(2, 40, 45, "Тверь"),
                new Town(3, 35, 60, "Рязань"),
                new Town(4, 55, 77, "Вологда"),
                new Town(5, 115, 20, "Тавда"),
                new Town(6, 45, 65, "Ярославль"),
                new Town(7, 50, 72, "Рыбинск"),
                new Town(8, 30, 70, "Архангельск"),
                new Town(9, 10, 90, "Санкт-Петербург"),
                new Town(10, 47, 43, "Владимир"),
                new Town (11, 38, 40, "Тула"),
                new Town(12, 120, 40, "Давлеканово")
            };

            Towns.AddRange(towns);



            Graph = new Graph();

            var a = Graph.CreateNode(towns[0]);
            var b = Graph.CreateNode(towns[1]);
            var c = Graph.CreateNode(towns[2]);
            var d = Graph.CreateNode(towns[3]);
            var e = Graph.CreateNode(towns[4]);
            var f = Graph.CreateNode(towns[5]);
            var g = Graph.CreateNode(towns[6]);
            var h = Graph.CreateNode(towns[7]);
            var i = Graph.CreateNode(towns[8]);
            var j = Graph.CreateNode(towns[9]);
            var k = Graph.CreateNode(towns[10]);
            var l = Graph.CreateNode(towns[11]);

            a.AddEdge(b, 150, 3)
             .AddEdge(c, 62, 2);

            b.AddEdge(c, 340, 5)
             .AddEdge(d, 75, 2)
             .AddEdge(g, 150, 7);

            c.AddEdge(e, 84, 2)
             .AddEdge(f, 141, 9);

            d.AddEdge(e, 44, 8)
             .AddEdge(f, 89, 1);

            e.AddEdge(g, 90, 3);

            f.AddEdge(g, 150, 6)
             .AddEdge(h, 100, 7)
             .AddEdge(k, 75, 8);

            g.AddEdge(i, 140, 6)
             .AddEdge(j, 62, 9);

            h.AddEdge(i, 140, 7)
             .AddEdge(j, 75, 2);

            i.AddEdge(k, 40, 4);

            j.AddEdge(k, 55, 6)
             .AddEdge(l, 71, 4);

            k.AddEdge(l, 90, 5);

        }
    }
}
