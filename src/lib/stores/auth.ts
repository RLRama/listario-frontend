import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { UserResponse } from '$lib/types';

const initialToken = browser ? window.localStorage.getItem('authToken') : null;

export const authToken = writable<string | null>(initialToken);
export const user = writable<UserResponse | null>(null);

if (browser) {
    authToken.subscribe((token) => {
        if (token) {
            window.localStorage.setItem('authToken', token);
        } else {
            window.localStorage.removeItem('authToken');
        }
    });
}