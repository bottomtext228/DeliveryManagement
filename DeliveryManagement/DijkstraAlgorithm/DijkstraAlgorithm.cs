using DeliveryManagement.Models.Map;

namespace DeliveryManagement.DijkstraAlgorith
{


    public class DijkstraAlgorithm
    {
        public Graph Graph { get; set; }
        public DijkstraAlgorithm(Graph graph)
        {
            Graph = graph;
        }

        public Tuple<int, List<Town>> GetCheapestPath(Town from, Town to)
        {
            var adjacencyMatrix = Graph.CreatePriceAdjacencyMatrix();

            var list = Graph.Dijkstar(adjacencyMatrix, Graph.AllNodes.FindIndex(n => n.Town == from), Graph.AllNodes.FindIndex(n => n.Town == to));
            List<Town> result = new();


            int sum = 0;
            for (int i = 0; i < list.Count - 1; i++)
            {
                result.Add(Graph.AllNodes[list[i]].Town); // end point is not included
                sum += (int)adjacencyMatrix[list[i], list[i + 1]];
            }

            result.Add(to); // add endpoint

            return Tuple.Create(sum, result);
        }




        public Tuple<int, List<Town>> GetFastestPath(Town from, Town to)
        {
            var adjacencyMatrix = Graph.CreateTimeAdjacencyMatrix();

            var list = Graph.Dijkstar(adjacencyMatrix, Graph.AllNodes.FindIndex(n => n.Town == from), Graph.AllNodes.FindIndex(n => n.Town == to));
            List<Town> result = new();


            int sum = 0;
            for (int i = 0; i < list.Count - 1; i++)
            {
                result.Add(Graph.AllNodes[list[i]].Town); // end point is not included
                sum += (int)adjacencyMatrix[list[i], list[i + 1]];
            }

            result.Add(to); // add endpoint

            return Tuple.Create(sum, result);
        }


    }

    public class Edge
    {
        public int PriceWeight;
        public int TimeWeight;
        public Node? Parent;
        public Node? Child;
    }
    public class Node
    {
        public Town Town;
        public Node current_node;
        public List<Edge> Edges = new List<Edge>();

        public Node(Town town)
        {
            Town = town;
            current_node = this;
        }
        public Node AddEdge(Node child, int priceWeight, int timeWeight)
        {
            Edges.Add(new Edge()
            {
                Parent = current_node,
                Child = child,
                PriceWeight = priceWeight,
                TimeWeight = timeWeight
            });
            if (!child.Edges.Exists(a => a.Parent == child && a.Child == current_node))
            {
                child.AddEdge(current_node, priceWeight, timeWeight);
            }
            return current_node;
        }
    }
    public class Graph
    {
        public Node? Root;
        public List<Node> AllNodes = new List<Node>();



        public Node CreateNode(Town town)
        {
            var n = new Node(town);
            AllNodes.Add(n);
            return n;
        }

        public int?[,] CreateAdjacencyMatrix()
        {
            int?[,] adj = new int?[AllNodes.Count, AllNodes.Count];
            for (int i = 0; i < AllNodes.Count; i++)
            {
                Node node1 = AllNodes[i];
                for (int j = 0; j < AllNodes.Count; j++)
                {
                    Node node2 = AllNodes[j];
                    var edge = node1.Edges.FirstOrDefault(a => a.Child == node2);
                    if (edge != null)
                    {
                        adj[i, j] = 1;
                    }
                    else
                    {
                        adj[i, j] = 0;
                    }
                }
            }
            return adj;
        }

        public int?[,] CreatePriceAdjacencyMatrix()
        {
            int?[,] adj = new int?[AllNodes.Count, AllNodes.Count];
            for (int i = 0; i < AllNodes.Count; i++)
            {
                Node node1 = AllNodes[i];
                for (int j = 0; j < AllNodes.Count; j++)
                {
                    Node node2 = AllNodes[j];
                    var edge = node1.Edges.FirstOrDefault(a => a.Child == node2);
                    if (edge != null)
                    {
                        adj[i, j] = edge.PriceWeight;
                    }
                    else
                    {
                        adj[i, j] = 0;
                    }
                }
            }
            return adj;
        }
        public int?[,] CreateTimeAdjacencyMatrix()
        {
            int?[,] adj = new int?[AllNodes.Count, AllNodes.Count];
            for (int i = 0; i < AllNodes.Count; i++)
            {
                Node node1 = AllNodes[i];
                for (int j = 0; j < AllNodes.Count; j++)
                {
                    Node node2 = AllNodes[j];
                    var edge = node1.Edges.FirstOrDefault(a => a.Child == node2);
                    if (edge != null)
                    {
                        adj[i, j] = edge.TimeWeight;
                    }
                    else
                    {
                        adj[i, j] = 0;
                    }
                }
            }
            return adj;
        }
        public int getNearestNode(int[] distance, bool[] tset)
        {
            int minimum = int.MaxValue;
            int index = 0;
            for (int k = 0; k < distance.Length; k++)
            {
                if (!tset[k] && distance[k] <= minimum)
                {
                    minimum = distance[k];
                    index = k;
                }
            }
            return index;
        }
        public List<int> Dijkstar(int?[,] graph, int src, int dest)
        {
            int length = graph.GetLength(0);
            int[] distance = new int[length];
            bool[] used = new bool[length];
            int[] prev = new int[length];

            for (int i = 0; i < length; i++)
            {
                distance[i] = int.MaxValue;
                used[i] = false;
                prev[i] = -1;
            }
            distance[src] = 0;

            for (int k = 0; k < length - 1; k++)
            {
                int minNode = getNearestNode(distance, used);
                used[minNode] = true;
                for (int i = 0; i < length; i++)
                {
                    if (graph[minNode, i] > 0)
                    {
                        int shortestToMinNode = distance[minNode];
                        int? distanceToNextNode = (int?)graph[minNode, i];
                        int? totalDistance = shortestToMinNode + distanceToNextNode;
                        if (totalDistance < distance[i])
                        {
                            distance[i] = (int)totalDistance;
                            prev[i] = minNode;
                        }
                    }
                }
            }
            if (distance[dest] == int.MaxValue)
            {
                return new List<int>();
            }
            var path = new LinkedList<int>();
            int currentNode = dest;
            while (currentNode != -1)
            {
                path.AddFirst(currentNode);
                currentNode = prev[currentNode];
            }
            return path.ToList();
        }
        public void PrintMatrix(ref int?[,] matrix, string[] labels, int count)
        {
            Console.Write("       ");
            for (int i = 0; i < count; i++)
            {
                Console.Write($" {labels[i]} ");
            }
            Console.WriteLine();

            for (int i = 0; i < count; i++)
            {
                Console.Write($" {labels[i]} | [ ");

                for (int j = 0; j < count; j++)
                {
                    if (matrix[i, j] == null)
                    {
                        Console.Write(" ,");
                    }
                    else
                    {
                        Console.Write($" {matrix[i, j]},");
                    }

                }
                Console.Write(" ]\r\n");
            }
            Console.Write("\r\n");
        }
        public void PrintPath(ref int?[,] graph, string[] labels, string src, string dest)
        {
            int source = Array.IndexOf(labels, src);
            int destination = Array.IndexOf(labels, dest);

            Console.Write($" Shortest Path of [{src} -> {dest}] is : ");
            var paths = Dijkstar(graph, source, destination);

            if (paths.Count > 0)
            {
                int? path_length = 0;
                for (int i = 0; i < paths.Count - 1; i++)
                {
                    int? length = graph[paths[i], paths[i + 1]];
                    path_length += length;
                    Console.Write($"{labels[paths[i]]} [{length}] -> ");
                }
                Console.WriteLine($"{labels[destination]} (Sum of weights: {path_length})");
            }
            else
            {
                Console.WriteLine("No Path");
            }
        }
    }

}
