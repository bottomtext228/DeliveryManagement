using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using backend.Extensions;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class TokenService
    {
        private readonly IConfiguration _configuration;
        private readonly SymmetricSecurityKey _key;
        private readonly ApplicationDbContext _dbContext;
        public TokenService(IConfiguration configuration, ApplicationDbContext dbContext)
        {
            _configuration = configuration;
            _key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"]!));
            _dbContext = dbContext;
        }

        public string CreateToken(User user, IList<string> roles, int? companyId)
        {
            var claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.NameId, user.Id)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimsIdentity.DefaultRoleClaimType, role)));
            if (companyId != null) claims.Add(new Claim("CompanyId", companyId.ToString()!));

            var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("JWT:AccessTokenExpireTimeInMinutes")),
                SigningCredentials = credentials,
                Issuer = _configuration["JWT:Issuer"],
                Audience = _configuration["JWT:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
        // Issuing new refresh token and storing it in the database and Cookie. Caller must save db changes! 
        public async Task<RefreshToken> IssueRefreshTokenAsync(User user/* , HttpResponse response */)
        {
            var refreshToken = CreateRefreshToken(user);
            await _dbContext.RefreshTokens.AddAsync(refreshToken);
            /* response.SetRefreshToken(refreshToken); */

            await CleanupOldRefreshTokensAsync(user.Id);
            return refreshToken;
        }
        // Rotating old refresh token from the db and saving new version in Cookie. Caller must save db changes!
        public async Task RotateRefreshTokenAsync(RefreshToken existingToken, User user)
        {
            var newToken = CreateRefreshToken(user);

            existingToken.Token = newToken.Token;
            existingToken.ExpiresOn = newToken.ExpiresOn;
            existingToken.CreatedOn = newToken.CreatedOn;

            await CleanupOldRefreshTokensAsync(user.Id);
        }
        public async Task RevokeRefreshTokenAsync(string refreshToken)
        {
            await _dbContext.RefreshTokens.Where(e => e.Token == refreshToken).ExecuteDeleteAsync();
        }
        private RefreshToken CreateRefreshToken(User user)
        {
            return new RefreshToken
            {
                UserId = user.Id,
                Token = GenerateRefreshToken(),
                ExpiresOn = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("JWT:RefreshTokenExpireTimeInDays")),
                CreatedOn = DateTime.UtcNow
            };
        }
        private static string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        }
        private async Task CleanupOldRefreshTokensAsync(string userId, int keepLatest = 5)
        {
            await _dbContext.RefreshTokens
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedOn)
            .Skip(keepLatest)
            .ExecuteDeleteAsync();
        }

    }
}