<script>
    import {goto} from "$app/navigation";
    import {Alert, Button, Form, FormGroup, Input, Label} from "@sveltestrap/sveltestrap";

    let identifier = '';
    let password = '';
    let error = null;

    async function login() {
        try {
            await apiRequest('/user/login', 'POST', { identifier, password });
            const userData = await apiRequest('/user/protected/me');
            user.set(userData);
            goto('/');
        } catch (err) {
            error = err.detail || 'Login failed';
        }
    }
</script>

{#if error}
    <Alert color="danger">{error}</Alert>
{/if}

<Form on:submit|preventDefault={login}>
    <FormGroup>
        <Label for="identifier">Username or email</Label>
        <Input type="text" id="identifier" name="identifier" bind:value={identifier} required />
    </FormGroup>
    <FormGroup>
        <Label for="password">Password</Label>
        <Input type="password" id="password" name="password" bind:value={password} required />
    </FormGroup>
    <Button type="submit" color="primary">Log in</Button>
</Form>