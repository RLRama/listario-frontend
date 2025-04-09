<script>
    import {Styles} from "@sveltestrap/sveltestrap";
    import {onDestroy, onMount} from "svelte";
    import {apiRequest} from "$lib/api.js";
    import Nav from "$lib/Nav.svelte";
    import {user} from "$lib/stores.js";
    import {tokenExpiry} from "$lib/stores.js";

    let refreshInterval;

    onMount(async () => {
        try {
            const userData = await apiRequest('/user/protected/me');
            user.set(userData);
        } catch (error) {
            if (error.status === 401) {
                user.set(null);
            } else {
                console.error('Error fetching user: ', error);
            }
        }
    });

    async function fetchUserAndSetExpiry() {
        try {
            const userData = await apiRequest('/user/protected/me');
            user.set(userData);
            const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
            tokenExpiry.set(expiry);
            scheduleTokenRefresh(expiry);
        } catch (error) {
            if (error.status === 401) {
                user.set(null);
                tokenExpiry.set(null);
            } else {
                console.error('Error fetching user: ', error);
            }
        }
    }

    function scheduleTokenRefresh(expiry) {
        if (refreshInterval) clearInterval(refreshInterval);
        const now = Date.now();
        const expiresInMillis = expiry - now;
        const refreshBuffer = 60 * 60 * 1000;
        const refreshIntervalMillis = expiresInMillis - refreshBuffer;

        if (refreshIntervalMillis > 0) {
            refreshInterval = setInterval(async () => {
                try {
                    await refreshToken();
                    const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
                    tokenExpiry.set(newExpiry);
                    scheduleTokenRefresh(newExpiry);
                } catch (error) {
                    console.error('Error fetching refresh token: ', error);
                    user.set(null);
                    tokenExpiry.set(null);
                    clearInterval(refreshInterval);
                }
            }, refreshIntervalMillis);
        }
    }

    onMount(fetchUserAndSetExpiry);

    onDestroy(() => {
        if (refreshInterval) clearInterval(refreshInterval);
    })
</script>

<Styles/>

<Nav/>
<slot/>