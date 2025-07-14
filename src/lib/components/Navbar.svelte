<script lang="ts">
    import {
        Navbar,
        NavbarBrand,
        Nav,
        NavItem,
        NavLink,
        Button
    } from '@sveltestrap/sveltestrap';
    import { accessToken, user } from '$lib/stores/auth';
    import { logout } from '$lib/services/api';
</script>

<Navbar color="light" light expand="md">
    <NavbarBrand href="/">Listario</NavbarBrand>
    <Nav class="ms-auto" navbar>
        {#if $accessToken}
            <NavItem>
                <NavLink href="/profile">{$user?.username || 'Profile'}</NavLink>
            </NavItem>
            <NavItem>
                <Button outline color="primary" on:click={logout}>Logout</Button>
            </NavItem>
        {:else}
            <NavItem>
                <NavLink href="/login">Login</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/register">Register</NavLink>
            </NavItem>
        {/if}
    </Nav>
</Navbar>