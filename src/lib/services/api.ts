import { accessToken, refreshToken, user } from '$lib/stores/auth';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import type { UserResponse, Task } from '$lib/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void; }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

async function send({ method, path, data, isRetry = false }: { method: string; path: string; data?: object, isRetry?: boolean }): Promise<any> {
    const opts: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    const token = get(accessToken);
    if (token) {
        (opts.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        opts.body = JSON.stringify(data);
    }

    try {
        const res = await fetch(`${BASE_URL}/${path}`, opts);

        if (!res.ok) {
            if (res.status === 401 && !isRetry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(() => send({ method, path, data, isRetry: true }));
                }

                isRefreshing = true;

                return new Promise(async (resolve, reject) => {
                    try {
                        const currentRefreshToken = get(refreshToken);
                        if (!currentRefreshToken) {
                            return reject(new Error('No refresh token available.'));
                        }

                        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refresh_token: currentRefreshToken })
                        });

                        if (!refreshResponse.ok) {
                            return reject(new Error('Failed to refresh token'));
                        }

                        const tokenPair = await refreshResponse.json();
                        accessToken.set(tokenPair.access_token);
                        refreshToken.set(tokenPair.refresh_token);

                        processQueue(null, tokenPair.access_token);
                        resolve(send({ method, path, data, isRetry: true }));
                    } catch (e) {
                        processQueue(e, null);
                        accessToken.set(null);
                        refreshToken.set(null);
                        user.set(null);
                        await goto('/login');
                        reject(e);
                    } finally {
                        isRefreshing = false;
                    }
                });
            }
            throw await res.json();
        }

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return await res.json();
        } else {
            return;
        }
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// --- Auth & user API Functions ---

export async function login(email: string, password: string): Promise<void> {
    const tokenPair = await send({
        method: 'POST',
        path: 'auth/login',
        data: { email, password }
    });
    accessToken.set(tokenPair.access_token);
    refreshToken.set(tokenPair.refresh_token);
    await getProfile();
}

export async function logout(): Promise<void> {
    try {
        await send({ method: 'GET', path: 'users/logout' });
    } catch (error) {
        console.error('Server logout request failed:', error);
    } finally {
        accessToken.set(null);
        refreshToken.set(null);
        user.set(null);
        await goto('/');
    }
}

export function register(username: string, email: string, password: string): Promise<UserResponse> {
    return send({
        method: 'POST',
        path: 'auth/register',
        data: { username, email, password }
    });
}

export async function getProfile(): Promise<UserResponse | null> {
    try {
        const profile: UserResponse = await send({ method: 'GET', path: 'users/me' });
        user.set(profile);
        return profile;
    } catch (error) {
        console.error('Failed to fetch profile:', error);
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

// --- Task API Functions ---

export function getTasks(): Promise<Task[]> {
    return send({ method: 'GET', path: 'tasks' });
}

export function createTask(title: string, content: string): Promise<Task> {
    return send({
        method: 'POST',
        path: 'tasks',
        data: { title, content }
    });
}

export function updateTask(id: number, data: { title?: string; content?: string; completed?: boolean }): Promise<Task> {
    return send({
        method: 'PUT',
        path: `tasks/${id}`,
        data
    });
}

export function deleteTask(id: number): Promise<void> {
    return send({
        method: 'DELETE',
        path: `tasks/${id}`
    });
}