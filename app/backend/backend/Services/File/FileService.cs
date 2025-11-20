

using backend.Errors;
using backend.Interfaces;

namespace backend.Services
{
    public class FileService : IFileService
    {

        private readonly string _saveDirectory;
        
        private readonly string[] _allowedExtensions;

        private readonly int _maxFileSizeInBytes;

        private readonly ILogger<FileService> _logger;

        public FileService(ILogger<FileService> logger, string saveDirectory, string[] allowedExtensions, int maxFileSizeInBytes)
        {
            _logger = logger;
            _saveDirectory = saveDirectory;
            _allowedExtensions = allowedExtensions;
            _maxFileSizeInBytes = maxFileSizeInBytes;
        }

        public async Task<Result<string>> SaveFileAsync(IFormFile file)
        {
            if (file.Length > _maxFileSizeInBytes)
            {
                return FileErrors.InvalidSize(_maxFileSizeInBytes);
            }

            if (!HasValidImageSignature(file))
            {
                return FileErrors.InvalidFormat(_allowedExtensions);
            }

            try
            {
                if (!Directory.Exists(_saveDirectory))
                {
                    Directory.CreateDirectory(_saveDirectory);
                }

                var extension = Path.GetExtension(file.FileName);

                if (!_allowedExtensions.Contains(extension))
                {
                    return FileErrors.InvalidFormat(_allowedExtensions);
                }

                var fileName = $"{Guid.NewGuid()}{extension}";
                var fullFileName = Path.Combine(_saveDirectory, fileName);

                using var stream = new FileStream(fullFileName, FileMode.Create);
                await file.CopyToAsync(stream);

                return fileName;
            }
            catch (Exception e)
            {
                _logger.LogError("Failed to save file. Reason: {ExceptionMessage}", e.Message);
                return FileErrors.FailedToSave();
            }

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

        private static bool HasValidImageSignature(IFormFile file)
        {
            // JPEG: FF D8 FF
            byte[] jpeg = [0xFF, 0xD8, 0xFF];
            // PNG: 89 50 4E 47
            byte[] png = [0x89, 0x50, 0x4E, 0x47, 0xD, 0xA, 0x1A, 0xA];

            using var br = new BinaryReader(file.OpenReadStream());
            byte[] header = br.ReadBytes(8); // read once, 8 is for png signature

            // JPG/JPEG
            if (header.Take(3).SequenceEqual(jpeg))
            {
                return true;
            }

            // PNG
            if (header.SequenceEqual(png))
            {
                return true;
            }

            return false;
        }
    }
}