<script>
    import {onMount} from "svelte";
    import {user} from "$lib/stores.js";
    import {goto} from "$app/navigation";
    import {apiRequest} from "$lib/api.js";
    import {Alert, Button, Form, FormGroup, Input, Label} from "@sveltestrap/sveltestrap";

    let username = '';
    let email = '';
    let error = null;
    let success = null;

    onMount(() => {
        if (!$user) {
            goto('/login');
        } else {
            username = $user.username;
            email = $user.email;
        }
    });

    async function updateUser() {
        try {
            await apiRequest('/user/protected/update', 'PUT', { username, email });
            $user.username = username;
            $user.email = email;
            success = 'User updated successfully';
            error = null;
        } catch (err) {
            error = err.detail || 'Update failed';
            success = null;
        }

        return false;
    }
</script>

<h1>Profile</h1>

{#if success}
    <Alert color="success">{success}</Alert>
{/if}
{#if error}
    <Alert color="danger">{error}</Alert>
{/if}

<Form on:submit={() => updateUser()}>
    <FormGroup>
        <Label for="username">Username</Label>
        <Input type="text" id="username" name="username" bind:value={username} required />
    </FormGroup>
    <FormGroup>
        <Label for="email">Email</Label>
        <Input type="email" id="email" name="email" bind:value={email} required />
    </FormGroup>
    <Button type="submit" color="primary">Submit</Button>
</Form>

<a href="/change-password">Change password</a>