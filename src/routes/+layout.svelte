<script>
    import {Styles} from "@sveltestrap/sveltestrap";
    import {onMount} from "svelte";
    import {apiRequest} from "$lib/api.js";
    import Nav from "$lib/Nav.svelte";
    import {user} from "$lib/stores.js";

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
</script>

<Styles />

<Nav />
<slot />