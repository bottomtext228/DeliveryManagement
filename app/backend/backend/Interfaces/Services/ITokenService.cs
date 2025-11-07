using backend.Models;
using backend.Models.RefreshToken;

namespace backend.Interfaces.Services
{
    public interface ITokenService
    {
        string CreateToken(User user, IList<string> roles, int? companyId);
        Task<RefreshToken> IssueRefreshTokenAsync(User user, CancellationToken cancellationToken = default);
        Task RotateRefreshTokenAsync(RefreshToken existingToken, User user, CancellationToken cancellationToken = default);
        Task RevokeRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    }
}