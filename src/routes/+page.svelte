<script>
    import {user} from "$lib/stores.js";
</script>

<h1>Welcome to Listario</h1>

{#if $user}
    <p>Hello, {$user.username}!</p>
{:else}
    <p>Please log in or register to start taking notes</p>
{/if}