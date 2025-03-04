export function getTokenFromLocalStorage(): string {
    const token = localStorage.getItem('token');
    return token ? token : '';
}

export function setTokenToLocalStorage(token: string) {
    localStorage.setItem('token', token);
}

export function removeTokenFromLocalStorage() {
    localStorage.removeItem('token');
}
