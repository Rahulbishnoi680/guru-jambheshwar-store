export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

export function isLoggedIn(): boolean {
  try {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  } catch {
    return false;
  }
}

export function getUserName(): string | null {
  try {
    return localStorage.getItem(AUTH_USER_KEY);
  } catch {
    return null;
  }
}

export function loginLocal(userName: string) {
  const token = btoa(`${userName}:${Date.now()}`);
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, userName);
  } catch { void 0; }
}

export function logoutLocal() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch { void 0; }
}
