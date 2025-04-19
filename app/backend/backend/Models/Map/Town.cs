namespace backend.Models.Map
{
    public class Town
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public Vector2 Position { get; set; }

        public Town(int id, float x, float y, string name)
        {
            Id = id;
            Position = new Vector2(x, y);
            Name = name;
        }
    }
}
