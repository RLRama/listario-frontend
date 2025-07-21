import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';
import { accessToken } from '$lib/stores/auth';

export function load() {
    if (browser) {
        const token = get(accessToken);
        if (!token) {
            throw redirect(307, '/login');
        }
    }
}