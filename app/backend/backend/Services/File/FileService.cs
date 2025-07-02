

using backend.Interfaces;

namespace backend.Services
{
    public class FileService : IFileService
    {

        private readonly string _saveDirectory;
        private readonly string[] _allowedExtensions;

        public FileService(string saveDirectory, string[] allowedExtensions)
        {
            _saveDirectory = saveDirectory;
            _allowedExtensions = allowedExtensions;
        }

        public async Task<string> SaveFileAsync(IFormFile file)
        {

            if (!Directory.Exists(_saveDirectory))
            {
                Directory.CreateDirectory(_saveDirectory);
            }

            var extension = Path.GetExtension(file.FileName);

            if (!_allowedExtensions.Contains(extension))
            {
                throw new ArgumentException($"Only {string.Join(", ", _allowedExtensions)} are allowed.");
            }

            var fileName = $"{Guid.NewGuid()}{extension}";
            var fullFileName = Path.Combine(_saveDirectory, fileName);

            using var stream = new FileStream(fullFileName, FileMode.Create);
            await file.CopyToAsync(stream);

            return fileName;

        }
        public void DeleteFile(string fileName)
        {
            var fullFileName = Path.Combine(_saveDirectory, fileName);
            if (!File.Exists(fullFileName))
            {
                throw new ArgumentException($"File {fileName} does not exist.");
            }

            File.Delete(fullFileName);
        }
    }
}