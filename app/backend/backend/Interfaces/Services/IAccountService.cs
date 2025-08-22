using backend.Dtos;
using backend.Dtos.Account;

namespace backend.Interfaces.Services
{
    public interface IAccountService
    {
        Task<Result<LoginResult>> RegisterAsync(RegisterDto model, CancellationToken cancellationToken = default);
        Task<Result<UserDto>> GetMeAsync(string userId, int? companyId, CancellationToken cancellationToken = default);
        Task<Result<LoginResult>> LoginAsync(LoginRequestDto model, CancellationToken cancellationToken = default);
        Task<Result<RefreshTokenResult>> RefreshTokenAsync(string? refreshToken, CancellationToken cancellationToken = default);
        Task<Result> LogoutAsync(string? refreshToken, CancellationToken cancellationToken = default);
        Task<Result<UserProfileDto>> GetProfileAsync(string userId, CancellationToken cancellationToken = default);
        Task<EmailAvailabilityDto> IsEmailAvailableAsync(string email, CancellationToken cancellationToken = default);
    }
}