using backend.Models;

public static class HttpResponseExtensions
{
    public static void SetRefreshToken(this HttpResponse response, RefreshToken refreshToken)
    {
        response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = refreshToken.ExpiresOn
        });
    }

    public static void ClearRefreshToken(this HttpResponse response)
    {
        response.Cookies.Delete("refreshToken");
    }
}
