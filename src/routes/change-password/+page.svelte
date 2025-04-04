<script>
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import {Alert, Button, Form, FormGroup, Input, Label} from "@sveltestrap/sveltestrap";
    import {user} from "$lib/stores.js";
    import {apiRequest} from "$lib/api.js";

    let currentPassword = '';
    let newPassword = '';
    let error = null;
    let success = null;

    onMount(() => {
        if (!user) {
            goto('/login');
        }
    });

    async function updatePassword() {
        try {
            console.log("Attempting to update password");
            await apiRequest('/user/protected/update-password', 'PUT', {
                current_password: currentPassword,
                new_password: newPassword,
            });
            success = 'Password updated successfully.';
            error = null;
        } catch (e) {
            console.error("Password update failed: ", e);
            error = e.detail || e.message || 'Password update failed';
            success = null;
        }

        return false;
    }
</script>

<h1>Change password</h1>

{#if success}
    <Alert color="success">{success}</Alert>
{/if}
{#if error}
    <Alert color="danger">{error}</Alert>
{/if}

<Form on:submit={() => updatePassword()}>
    <FormGroup>
        <Label for="currentPassword">Current password</Label>
        <Input type="password" id="currentPassword" name="currentPassword" bind:value={currentPassword} required />
    </FormGroup>
    <FormGroup>
        <Label for="newPassword">New password</Label>
        <Input type="password" id="newPassword" name="newPassword" bind:value={newPassword} required />
    </FormGroup>
    <Button type="submit" color="primary">Update password</Button>
</Form>