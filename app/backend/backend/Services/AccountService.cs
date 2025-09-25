using backend.Dtos;
using backend.Dtos.Account;
using backend.Errors;
using backend.Interfaces.Services;
using backend.Mappers;
using backend.Models;
using backend.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _dbContext;
        private readonly ITokenService _tokenService;

        public AccountService(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            ApplicationDbContext dbContext,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
            _tokenService = tokenService;
        }

        public async Task<Result<LoginResult>> RegisterAsync(RegisterDto model, CancellationToken cancellationToken = default)
        {
            if (model.AsCompany)
            {
                Dictionary<string, string> errors = [];

                if (string.IsNullOrEmpty(model.CompanyName))
                    errors.Add(nameof(model.CompanyName), AccountErrors.NullCompanyName().Message);
                if (string.IsNullOrEmpty(model.CompanyDescription))
                    errors.Add(nameof(model.CompanyDescription), AccountErrors.NullCompanyDescription().Message);

                if (errors.Count != 0) return new ValidationError(errors);

                bool companyExists = await _dbContext.Companies
                    .AnyAsync(c => c.Name == model.CompanyName, cancellationToken);

                if (companyExists)
                    return new ValidationError(nameof(model.CompanyName), AccountErrors.TakenCompanyName(model.CompanyName!).Message);
            }

            var user = new User
            {
                Email = model.Email,
                UserName = model.Email,
            };

            var createResult = await _userManager.CreateAsync(user, model.Password);

            if (!createResult.Succeeded)
            {
                return ValidationError.FromIdentityErrors(createResult.Errors);
            }

            var role = model.AsCompany ? "company" : "client";
            await _userManager.AddToRoleAsync(user, role);

            Company? company = null;
            if (model.AsCompany)
            {
                company = new Company
                {
                    Name = model.CompanyName!,
                    Description = model.CompanyDescription!,
                    UserId = user.Id
                };
                _dbContext.Companies.Add(company);
            }

            List<string> roles = [role];

            var refreshToken = await _tokenService.IssueRefreshTokenAsync(user);
            await _dbContext.SaveChangesAsync();

            return new LoginResult
            {
                User = new UserDto
                {
                    Email = user.Email,
                    Roles = roles,
                    Company = company?.ToCompanyDto()
                },
                Token = _tokenService.CreateToken(user, roles, company?.Id),
                RefreshToken = refreshToken
            };
        }

        public async Task<Result<UserDto>> GetMeAsync(string userId, int? companyId, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return AccountErrors.NotFound(userId);

            var roles = await _userManager.GetRolesAsync(user);

            if (companyId != null)
            {
                var company = await _dbContext.Companies.FirstOrDefaultAsync(e => e.UserId == userId, cancellationToken);
                return new UserDto
                { Email = user.Email!, Roles = roles.ToList(), Company = company?.ToCompanyDto() };
            }
            else
            {
                return new UserDto { Email = user.Email!, Roles = roles.ToList() };
            }
        }

        public async Task<Result<LoginResult>> LoginAsync(LoginRequest model, CancellationToken cancellationToken = default)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == model.Email, cancellationToken);
            if (user == null) return AccountErrors.InvalidCredentials();

            var roles = await _userManager.GetRolesAsync(user);

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (result.Succeeded)
            {
                var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.UserId == user.Id, cancellationToken);


                var refreshToken = await _tokenService.IssueRefreshTokenAsync(user, cancellationToken);
                await _dbContext.SaveChangesAsync(); // do not pass cancellationToken here

                return new LoginResult
                {
                    User = new UserDto
                    {
                        Email = user.Email!,
                        Roles = roles.ToList(),
                        Company = company?.ToCompanyDto()
                    },
                    Token = _tokenService.CreateToken(user, roles, company?.Id),
                    RefreshToken = refreshToken
                };
            }
            else
            {
                return AccountErrors.InvalidCredentials();
            }
        }

        public async Task<Result<RefreshTokenResult>> RefreshTokenAsync(string? refreshToken, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(refreshToken)) return AccountErrors.MissingRefreshToken();

            // check refresh token
            var storedRefreshToken = await _dbContext.RefreshTokens
                .Include(e => e.User)
                .FirstOrDefaultAsync(e => e.Token == refreshToken, cancellationToken);
            if (storedRefreshToken == null || storedRefreshToken.ExpiresOn < DateTime.UtcNow)
            {
                return AccountErrors.ExpiredRefreshToken();
            }

            // get user
            var user = storedRefreshToken.User;

            // create access token
            var roles = await _userManager.GetRolesAsync(user);
            var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.UserId == user.Id, cancellationToken);
            string accessToken = _tokenService.CreateToken(user, roles, company?.Id);

            // update refresh token
            await _tokenService.RotateRefreshTokenAsync(storedRefreshToken, user, cancellationToken);
            await _dbContext.SaveChangesAsync(); // do not pass cancellationToken here

            return new RefreshTokenResult { Token = accessToken, RefreshToken = storedRefreshToken };
        }

        public async Task<Result> LogoutAsync(string? refreshToken, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                return AccountErrors.MissingRefreshToken();
            }

            // find and delete refresh token
            await _tokenService.RevokeRefreshTokenAsync(refreshToken, cancellationToken);

            return Result.Success();
        }

        public async Task<Result<ClientProfileDto>> GetClientProfileAsync(string userId, CancellationToken cancellationToken = default)
        {
            var profileInfo = await _dbContext.Users.
                Where(e => e.Id == userId)
                .Select(e => new ClientProfileDto
                {
                    OrdersCount = _dbContext.Orders.Count(e => e.UserId == userId),
                    OrdersCost = _dbContext.Orders.Where(e => e.UserId == userId).Sum(e => e.FinalPrice)
                }).FirstOrDefaultAsync(cancellationToken);

            if (profileInfo is null)
            {
                return AccountErrors.NotFound(userId);
            }

            return profileInfo;
        }

        public async Task<Result<CompanyProfileDto>> GetCompanyProfileAsync(string userId, int companyId, CancellationToken cancellationToken = default)
        {
            var profileInfo = await _dbContext.Companies
                .Where(e => e.Id == companyId)
                .Select(e => new CompanyProfileDto
                {
                    OrdersCount = _dbContext.Orders.Count(e => e.CompanyId == companyId),
                    OrderedProductsCount = _dbContext.OrderItems.Include(e => e.Order).Count(e => e.Order.CompanyId == companyId),
                    PickUpPointsCount = _dbContext.PickUpPoints.Count(e => e.CompanyId == companyId),
                    StocksCount = _dbContext.Stocks.Count(e => e.CompanyId == companyId),
                    ProductsCount = _dbContext.Products.Count(e => e.CompanyId == companyId)
                }).FirstOrDefaultAsync(cancellationToken);

            if (profileInfo is null)
            {
                return CompanyErrors.NotFound(companyId);
            }

            return profileInfo;
        }

        public async Task<EmailAvailabilityRequest> IsEmailAvailableAsync(string email, CancellationToken cancellationToken = default)
        {
            var exists = await _userManager.Users.AnyAsync(u => u.Email == email, cancellationToken);

            return new EmailAvailabilityRequest { Available = !exists, Message = exists ? AccountErrors.TakenEmail(email).Message : null };
        }
    }
}