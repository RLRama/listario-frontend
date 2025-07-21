<script lang="ts">
    import { user } from '$lib/stores/auth';
    import { updateProfile } from '$lib/services/api';
    import {
        Button,
        FormGroup,
        Label,
        Input,
        Alert,
        Card,
        CardBody,
        CardHeader,
        ListGroup,
        ListGroupItem
    } from '@sveltestrap/sveltestrap';

    let newUsername = $user?.username || '';
    let newEmail = $user?.email || '';
    let error: string | null = null;
    let message = '';

    async function handleUpdate() {
        error = null;
        message = '';
        try {
            await updateProfile(newUsername, newEmail);
            message = 'Profile updated successfully!';
        } catch (err: any) {
            error = err.error || 'Failed to update profile.';
        }
    }
</script>

<Card>
    <CardHeader>
        <h1>My Profile</h1>
    </CardHeader>
    <CardBody>
        {#if $user}
            <ListGroup flush>
                <ListGroupItem><strong>ID:</strong> {$user.id}</ListGroupItem>
                <ListGroupItem><strong>Email:</strong> {$user.email}</ListGroupItem>
                <ListGroupItem><strong>Username:</strong> {$user.username}</ListGroupItem>
                <ListGroupItem>
                    <strong>Member Since:</strong>
                    {new Date($user.createdAt).toLocaleDateString()}
                </ListGroupItem>
            </ListGroup>
        {/if}
    </CardBody>
</Card>

<h2 class="mt-4">Update Details</h2>
<form on:submit|preventDefault={handleUpdate} class="mt-3">
    {#if error}
        <Alert color="danger">{error}</Alert>
    {/if}
    {#if message}
        <Alert color="success">{message}</Alert>
    {/if}
    <FormGroup>
        <Label for="username">Username</Label>
        <Input id="username" type="text" bind:value={newUsername} placeholder="Enter new username" />
    </FormGroup>
    <FormGroup>
        <Label for="email">Email</Label>
        <Input id="email" type="email" bind:value={newEmail} placeholder="Enter new email" />
    </FormGroup>
    <Button color="primary" type="submit">Update Profile</Button>
</form>