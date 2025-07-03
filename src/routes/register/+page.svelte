<script lang="ts">
    import { register } from '$lib/services/api';
    import { goto } from '$app/navigation';
    import { Button, FormGroup, Label, Input, FormText, Alert } from '@sveltestrap/sveltestrap';

    let username = '';
    let email = '';
    let password = '';
    let error: string | null = null;
    let message = '';

    async function handleSubmit() {
        error = null;
        message = '';
        try {
            await register(username, email, password);
            message = 'Registration successful! Redirecting to login...';
            setTimeout(() => {
                goto('/login');
            }, 2000);
        } catch (err: any) {
            error = err.error || 'Registration failed. Please try again.';
        }
    }
</script>

<h1>Register</h1>

<form on:submit|preventDefault={handleSubmit} class="mt-4">
    {#if error}
        <Alert color="danger">{error}</Alert>
    {/if}
    {#if message}
        <Alert color="success">{message}</Alert>
    {/if}

    <FormGroup>
        <Label for="username">Username</Label>
        <Input id="username" type="text" bind:value={username} required />
    </FormGroup>
    <FormGroup>
        <Label for="email">Email</Label>
        <Input id="email" type="email" bind:value={email} required />
    </FormGroup>
    <FormGroup>
        <Label for="password">Password</Label>
        <Input id="password" type="password" bind:value={password} required minlength={8} />
        <FormText>
            Password requires min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
        </FormText>
    </FormGroup>
    <Button color="primary" type="submit">Register</Button>
</form>