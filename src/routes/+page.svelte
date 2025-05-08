<script>
    import {user} from "$lib/stores.js";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    onMount(() => {
        if ($user) {
            goto('/tasks');
        } else {
            goto('/login');
        }
    });
</script>

<h1>Welcome to Listario</h1>
<p>Redirecting...</p>