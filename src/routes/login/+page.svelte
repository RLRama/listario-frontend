<script lang="ts">
    import { login } from '$lib/services/api';
    import { goto } from '$app/navigation';
    import { Button, FormGroup, Label, Input, Alert } from '@sveltestrap/sveltestrap';

    let email = '';
    let password = '';
    let error: string | null = null;

    async function handleSubmit() {
        error = null;
        try {
            await login(email, password);
            await goto('/profile');
        } catch (err: any) {
            error = err.error || 'Login failed. Please check your credentials.';
        }
    }
</script>

<h1>Login</h1>

<form on:submit|preventDefault={handleSubmit} class="mt-4">
    {#if error}
        <Alert color="danger">{error}</Alert>
    {/if}
    <FormGroup>
        <Label for="email">Email</Label>
        <Input id="email" type="email" bind:value={email} required />
    </FormGroup>
    <FormGroup>
        <Label for="password">Password</Label>
        <Input id="password" type="password" bind:value={password} required />
    </FormGroup>
    <Button color="primary" type="submit">Login</Button>
</form>