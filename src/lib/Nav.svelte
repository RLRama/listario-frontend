<script>
    import {apiRequest} from "$lib/api.js";
    import {goto} from "$app/navigation";
    import {user} from "$lib/stores.js";
    import {Button, Nav, Navbar, NavItem, NavLink} from "@sveltestrap/sveltestrap";

    async function logout() {
        try {
            await apiRequest('/user/protected/logout', 'POST');
            user.set(null);
            goto('/login');
        } catch (error) {
            console.error('Logout failed: ', error);
        }
    }
</script>

<Navbar color="light" light expand="md">
    <Nav class="ms-auto" navbar>
        {#if $user}
            <NavItem>
                <NavLink href="/tasks">Tasks</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/profile">Profile</NavLink>
            </NavItem>
            <NavItem>
                <Button color="secondary" on:click={logout}>Log out</Button>
            </NavItem>
        {:else}
            <NavItem>
                <NavLink href="/login">Log in</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/register">Register</NavLink>
            </NavItem>
        {/if}
    </Nav>
</Navbar>