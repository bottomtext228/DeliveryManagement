using backend.Results;

namespace backend
{
    public class Error
    {
        public string Code { get; }
        public string Message { get; }
        public ErrorType Type { get; }
        public IDictionary<string, object>? Metadata { get; }

        public bool HasMetadata => Metadata is { Count: > 0 };

        protected Error(string code, string message, ErrorType type, IDictionary<string, object>? metadata = null)
        {
            Code = code;
            Message = message;
            Type = type;
            Metadata = metadata;
        }

        // Factory methods for common error types
        public static Error Validation(string prefix, string message, IDictionary<string, object>? metadata = null)
            => new($"{prefix}.ValidationError", message, ErrorType.BadRequest, metadata);

        public static Error NotFound(string prefix, string message, IDictionary<string, object>? metadata = null)
            => new($"{prefix}.NotFound", message, ErrorType.NotFound, metadata);

        public static Error BadRequest(string prefix, string message, IDictionary<string, object>? metadata = null)
            => new($"{prefix}.BadRequest", message, ErrorType.BadRequest, metadata);

         public static Error Internal(string prefix, string message, IDictionary<string, object>? metadata = null)
            => new($"{prefix}.InternalServerError", message, ErrorType.Internal, metadata);
    }
}