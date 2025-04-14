namespace backend.Interfaces
{
    public interface IFileService
    {
        public Task<string> SaveFileAsync(IFormFile file);
        public void DeleteFile(string fileName);
    }
}
