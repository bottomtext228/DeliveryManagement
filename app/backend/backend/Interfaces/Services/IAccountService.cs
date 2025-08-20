using backend.Dtos;
using backend.Dtos.Account;

namespace backend.Interfaces.Services
{
    public interface IAccountService
    {
        Task<Result<LoginResult>> RegisterAsync(RegisterDto model, CancellationToken ct = default);
        Task<Result<UserDto>> GetMeAsync(string userId, int? companyId/* , CancellationToken ct = default */);
        Task<Result<LoginResult>> LoginAsync(LoginRequestDto model/* , CancellationToken ct = default */);
        Task<Result<RefreshTokenResult>> RefreshTokenAsync(string? refreshToken/* , CancellationToken ct = default */);
        Task<Result> LogoutAsync(string? refreshToken);
        Task<Result<UserProfileDto>> GetProfileAsync(string userId);
        Task<EmailAvailabilityDto> IsEmailAvailableAsync(string email);
    }
}