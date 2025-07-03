import { authToken } from '$lib/stores/auth';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export function load() {
    if (browser) {
        const token = get(authToken);
        if (!token) {
            throw redirect(307, '/login');
        }
    }
}