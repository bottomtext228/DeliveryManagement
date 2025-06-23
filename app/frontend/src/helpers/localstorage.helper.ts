// access token
export function getTokenFromLocalStorage(): string {
    return localStorage.getItem('token') ?? '';
}

export function setTokenToLocalStorage(token: string) {
    localStorage.setItem('token', token);
}

export function removeTokenFromLocalStorage() {
    localStorage.removeItem('token');
}

// refresh token
/* export function getRefreshTokenFromLocalStorage(): string {
    return localStorage.getItem('refreshToken') ?? '';
}

export function setRefreshTokenToLocalStorage(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
}

export function removeRefreshTokenFromLocalStorage() {
    localStorage.removeItem('refreshToken');
} */