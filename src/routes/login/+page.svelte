<script>
    import {goto} from "$app/navigation";
    import {Alert, Button, Form, FormGroup, Input, Label} from "@sveltestrap/sveltestrap";
    import {apiRequest} from "$lib/api.js";
    import {tokenExpiry, user} from "$lib/stores.js";

    let identifier = '';
    let password = '';
    let error = null;

    async function login() {
        try {
            console.log("Attempting to login: ", { identifier, password: "***" });
            const loginResponse = await apiRequest('/user/login', 'POST', { identifier, password });
            console.log("Login response: ", loginResponse);

            const userData = await apiRequest('/user/protected/me');
            console.log("User data: ", userData);

            user.set(userData);
            tokenExpiry.set(new Date(Date.now() + 24 * 60 * 60 * 1000));
            await goto('/');
        } catch (e) {
            console.error("Login error: " + e);
            error = e.detail || e.message || "Login failed";
        }

        return false;
    }
</script>

{#if error}
    <Alert color="danger">{error}</Alert>
{/if}

<Form on:submit={() => login()}>
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