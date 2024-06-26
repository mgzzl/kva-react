// src/utils/cookies.ts
export function setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export function eraseCookie(name: string) {
    document.cookie = `${name}=; Max-Age=-99999999;`;
}

export function setInputCookie(name: string, value: string) {
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // Two hours from now
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  }
  
export function getInputCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const result = parts.pop()?.split(';').shift();
        console.log(result)
        return result !== undefined ? result : null;
    }
    return null;
}
  