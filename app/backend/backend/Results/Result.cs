using System.Diagnostics.CodeAnalysis;

namespace backend
{
    public class Result<T>
    {
        protected Result(T value)
        {
            Value = value;
            Error = null;
        }

        protected Result(Error error)
        {
            Value = default;
            Error = error;
        }

        public T? Value { get; }

        public Error? Error { get; }

        [MemberNotNullWhen(true, nameof(Value))]
        [MemberNotNullWhen(false, nameof(Error))]
        public bool IsSuccess => Error == null;

        [MemberNotNullWhen(true, nameof(Error))]
        [MemberNotNullWhen(false, nameof(Value))]
        public bool IsFailure => !IsSuccess;

        public static Result<T> Success(T value) => new(value);
        public static Result<T> Failure(Error error) => new(error);

        public TResult Map<TResult>(Func<T, TResult> onSuccess, Func<Error, TResult> onFailure)
        {
            return IsSuccess ? onSuccess(Value!) : onFailure(Error!);
        }

        public static implicit operator Result<T>(T value) => Success(value);
        public static implicit operator Result<T>(Error error) => Failure(error);

    }

    public class Result
    {
        protected Result()
        {
            Error = null;
        }

        protected Result(Error error)
        {
            Error = error;
        }

        public Error? Error { get; }

        [MemberNotNullWhen(false, nameof(Error))]
        public bool IsSuccess => Error == null;

        [MemberNotNullWhen(true, nameof(Error))]
        public bool IsFailure => !IsSuccess;

        public static Result Success() => new();
        public static Result Failure(Error error) => new(error);

        public TResult Map<TResult>(Func<TResult> onSuccess, Func<Error, TResult> onFailure)
        {
            return IsSuccess ? onSuccess() : onFailure(Error!);
        }

        // not possible
        /* public static implicit operator Result() => Success(); */
        public static implicit operator Result(Error error) => Failure(error);

    }
}