namespace backend.Interfaces
{
    public interface IFileService
    {
        Task<Result<string>> SaveFileAsync(IFormFile file);
        void DeleteFile(string fileName);
    }
}
