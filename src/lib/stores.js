import {writable} from "svelte/store";

export const user = writable(null);
export const tokenExpiry = writable(null);
export const tasks = writable([]);
export const loading = writable(false);