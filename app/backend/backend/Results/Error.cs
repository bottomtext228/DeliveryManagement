namespace backend
{
    public class Error
    {
        public string Code { get; }
        public string Message { get; }
        public IDictionary<string, object>? Metadata { get; }

        public bool HasMetadata => Metadata is { Count: > 0 };

        protected Error(string code, string message, IDictionary<string, object>? metadata = null)
        {
            Code = code;
            Message = message;
            Metadata = metadata;
        }

        // Factory methods for common error types
        public static Error Validation(string prefix, string message, IDictionary<string, object>? metadata = null)
            => new($"{prefix}.ValidationError", message, metadata);

        public static Error NotFound(string prefix, string message, IDictionary<string, object>? metadata = null)
            => new($"{prefix}.NotFound", message, metadata);

        public static Error BadRequest(string prefix, string message, IDictionary<string, object>? metadata = null)
            => new($"{prefix}.BadRequest", message, metadata);

       /*  public static Error Custom(string code, string message, IDictionary<string, object>? metadata = null)
            => new(code, message, metadata); */
    }
}