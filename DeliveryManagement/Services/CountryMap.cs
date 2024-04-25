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
                new Town(1, 250, 13, "Санкт-Петербург"),
                new Town(2, 198, 162, "Калуга"),
                new Town(3, 163, 221, "Тула"),
                new Town(4, 126, 273, "Тамбов"),
                new Town(5, 313, 78, "Тверь"),
                new Town(6, 247, 225, "Рязань"),
                new Town(7, 305, 149, "Москва"),
                new Town(8, 78, 347, "Ростов-на-Дону"),
                new Town(9, 205, 379, "Волгоград"),
                new Town(10, 415, 118, "Ярославль"),
                new Town (11, 332, 276, "Новгород"),
                new Town(12, 278, 353, "Саратов"),
                new Town(13, 460, 54, "Вологда"),
                new Town(14, 464, 159, "Иваново"),
                new Town(15, 426, 213, "Владимир"),
                new Town(16, 437, 315, "Казань"),
                new Town(17, 525, 338, "Ижевск"),
                //new Town(18, 527, 418, "Ярославль"),
            };
            Towns.AddRange(towns);



            Graph = new Graph();

            var SaintPetersburg = Graph.CreateNode(towns[0]);
            var Kaluga = Graph.CreateNode(towns[1]);
            var Tula = Graph.CreateNode(towns[2]);
            var Tambov = Graph.CreateNode(towns[3]);
            var Tver = Graph.CreateNode(towns[4]);
            var Ryazan = Graph.CreateNode(towns[5]);
            var Moscow = Graph.CreateNode(towns[6]);
            var RostovNaDonu = Graph.CreateNode(towns[7]);
            var Volgograd = Graph.CreateNode(towns[8]);
            var Yaroslavl = Graph.CreateNode(towns[9]);
            var Novgorod = Graph.CreateNode(towns[10]);
            var Saratov = Graph.CreateNode(towns[11]);
            var Vologda = Graph.CreateNode(towns[12]);
            var Ivanovo = Graph.CreateNode(towns[13]);
            var Vladimir = Graph.CreateNode(towns[14]);
            var Kazan = Graph.CreateNode(towns[15]);
            var Ijevsk = Graph.CreateNode(towns[16]);

            SaintPetersburg.AddEdge(Tver, 150, 4);
            Tver.AddEdge(Moscow, 200, 2)
                .AddEdge(Yaroslavl, 130, 2)
                .AddEdge(Vologda, 140, 3);
            Vologda.AddEdge(Yaroslavl, 100, 2);
            Yaroslavl.AddEdge(Moscow, 240, 4);
            Moscow.AddEdge(Kaluga, 170, 2)
                .AddEdge(Ivanovo, 180, 4)
                .AddEdge(Vladimir, 220, 5)
                .AddEdge(Ryazan, 350, 2);
            Ryazan.AddEdge(Tula, 110, 2)
                .AddEdge(Novgorod, 360, 5)
                .AddEdge(Vladimir, 300, 2)
                .AddEdge(Kaluga, 60, 4);

            Novgorod.AddEdge(Kazan, 70, 2)
                .AddEdge(Saratov, 150, 3);
            Kazan.AddEdge(Ijevsk, 235, 3);

            Saratov.AddEdge(Volgograd, 90, 2);
            Volgograd.AddEdge(RostovNaDonu, 340, 5);
            RostovNaDonu.AddEdge(Tambov, 500, 6);
            Tambov.AddEdge(Tula, 135, 3);



            //a.AddEdge(b, 150, 3)
            // .AddEdge(c, 62, 2);

            //b.AddEdge(c, 340, 5)
            // .AddEdge(d, 75, 2)
            // .AddEdge(g, 150, 7);

            //c.AddEdge(e, 84, 2)
            // .AddEdge(f, 141, 9);

            //d.AddEdge(e, 44, 8)
            // .AddEdge(f, 89, 1);

            //e.AddEdge(g, 90, 3);

            //f.AddEdge(g, 150, 6)
            // .AddEdge(h, 100, 7)
            // .AddEdge(k, 75, 8);

            //g.AddEdge(i, 140, 6)
            // .AddEdge(j, 62, 9);

            //h.AddEdge(i, 140, 7)
            // .AddEdge(j, 75, 2);

            //i.AddEdge(k, 40, 4);

            //j.AddEdge(k, 55, 6)
            // .AddEdge(l, 71, 4);

            //k.AddEdge(l, 90, 5);

        }
    }
}
