<script>
    import {apiRequest} from "$lib/api.js";
    import {goto} from "$app/navigation";
    import {Alert, Button, Form, FormGroup, Input, Label} from "@sveltestrap/sveltestrap";

    let username = '';
    let email = '';
    let password = '';
    let error = null;

    async function register() {
        try {
            await apiRequest('/user/register', 'POST', { username, email, password });
            await goto('/login');
        } catch (e) {
            error = e.detail || 'Registration failed';
        }

        return false;
    }
</script>

<h1>Register</h1>

{#if error}
    <Alert color="danger">{error}</Alert>
{/if}

<Form on:submit={() => register()}>
    <FormGroup>
        <Label for="username">Username</Label>
        <Input type="text" id="username" name="username" bind:value={username} required />
    </FormGroup>
    <FormGroup>
        <Label for="email">Email</Label>
        <Input type="email" id="email" name="email" bind:value={email} required />
    </FormGroup>
    <FormGroup>
        <Label for="password">Password</Label>
        <Input type="password" id="password" name="password" bind:value={password} required />
    </FormGroup>
    <Button type="submit" color="primary">Register</Button>
</Form>