using backend.Dtos;
using backend.Dtos.Account;

namespace backend.Interfaces.Services
{
    public interface IAccountService
    {
        Task<Result<LoginResult>> RegisterAsync(RegisterDto model, CancellationToken cancellationToken);
        Task<Result<UserDto>> GetMeAsync(string userId, int? companyId, CancellationToken cancellationToken);
        Task<Result<LoginResult>> LoginAsync(LoginRequestDto model, CancellationToken cancellationToken);
        Task<Result<RefreshTokenResult>> RefreshTokenAsync(string? refreshToken, CancellationToken cancellationToken);
        Task<Result> LogoutAsync(string? refreshToken, CancellationToken cancellationToken);
        Task<Result<UserProfileDto>> GetProfileAsync(string userId, CancellationToken cancellationToken);
        Task<EmailAvailabilityDto> IsEmailAvailableAsync(string email, CancellationToken cancellationToken);
    }
}