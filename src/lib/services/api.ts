import { authToken, user } from '$lib/stores/auth';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import type { UserResponse } from '$lib/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function send({ method, path, data }: { method: string; path: string; data?: object }) {
    const opts: RequestInit = { method, headers: {} };

    if (data) {
        (opts.headers as Record<string, string>)['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(data);
    }

    const token = get(authToken);
    if (token) {
        (opts.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}/${path}`, opts);

    if (res.status === 401) {
        authToken.set(null);
        user.set(null);
        await goto('/login');
    }

    const responseData = await res.json();

    if (!res.ok) {
        throw responseData;
    }

    return responseData;
}

// --- API Functions ---
export function register(username: string, email: string, password: string): Promise<UserResponse> {
    return send({
        method: 'POST',
        path: 'auth/register',
        data: { username, email, password }
    });
}

export async function login(email: string, password: string): Promise<void> {
    const { token } = await send({
        method: 'POST',
        path: 'auth/login',
        data: { email, password }
    });
    authToken.set(token);
    await getProfile();
}

export async function logout(): Promise<void> {
    try {
        await send({ method: 'GET', path: 'users/logout' });
    } catch (error) {
        console.error('Server logout request failed:', error);
    } finally {
        authToken.set(null);
        user.set(null);
        await goto('/');
    }
}

export async function getProfile(): Promise<UserResponse | null> {
    try {
        const profile: UserResponse = await send({ method: 'GET', path: 'users/me' });
        user.set(profile);
        return profile;
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        authToken.set(null);
        user.set(null);
        return null;
    }
}

export async function updateProfile(username: string, email: string): Promise<UserResponse> {
    const updatedUser = await send({
        method: 'PUT',
        path: 'users/me',
        data: { username, email }
    });
    user.set(updatedUser);
    return updatedUser;
}