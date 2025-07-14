import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { UserResponse } from '$lib/types';

function getTokensFromStorage() {
    if (!browser) return { accessToken: null, refreshToken: null };
    const accessToken = window.sessionStorage.getItem('accessToken');
    const refreshToken = window.sessionStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
}

export const accessToken = writable<string | null>(getTokensFromStorage().accessToken);
export const refreshToken = writable<string | null>(getTokensFromStorage().refreshToken);
export const user = writable<UserResponse | null>(null);

if (browser) {
    accessToken.subscribe((token) => {
        if (token) {
            window.sessionStorage.setItem('accessToken', token);
        } else {
            window.sessionStorage.removeItem('accessToken');
        }
    });

    refreshToken.subscribe((token) => {
        if (token) {
            window.sessionStorage.setItem('refreshToken', token);
        } else {
            window.sessionStorage.removeItem('refreshToken');
        }
    });
}