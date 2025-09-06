<script lang="ts">
    import { user } from '$lib/stores/auth';
    import { updateProfile, updatePassword, logout } from '$lib/services/api';
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
    import PasswordInput from "$lib/components/PasswordInput.svelte";

    let newUsername = $user?.username || '';
    let newEmail = $user?.email || '';
    let profileError: string | null = null;
    let profileMessage = '';

    let oldPassword = '';
    let newPassword = '';
    let confirmPassword = '';
    let passwordError: string | null = null;
    let passwordMessage = '';


    async function handleUpdateProfile() {
        profileError = null;
        profileMessage = '';
        try {
            await updateProfile(newUsername, newEmail);
            profileMessage = 'Profile updated successfully!';
        } catch (err: any) {
            profileError = err.error || 'Failed to update profile.';
        }
    }

    async function handleUpdatePassword() {
        passwordError = null;
        passwordMessage = '';

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            passwordError = 'Password does not meet the requirements.';
            return;
        }
        if (newPassword !== confirmPassword) {
            passwordError = 'New passwords do not match.';
            return;
        }

        try {
            await updatePassword(oldPassword, newPassword);
            await logout();
        } catch (err: any) {
            passwordError = err.error || 'Failed to update password.';
        }
    }
</script>

<svelte:head>
    <title>My profile</title>
</svelte:head>

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

<Card class="mt-4">
    <CardHeader>
        <h2>Update Details</h2>
    </CardHeader>
    <CardBody>
        <form on:submit|preventDefault={handleUpdateProfile}>
            {#if profileError}
                <Alert color="danger">{profileError}</Alert>
            {/if}
            {#if profileMessage}
                <Alert color="success">{profileMessage}</Alert>
            {/if}
            <FormGroup>
                <Label for="username">Username</Label>
                <Input id="username" type="text" bind:value={newUsername} />
            </FormGroup>
            <FormGroup>
                <Label for="email">Email</Label>
                <Input id="email" type="email" bind:value={newEmail} />
            </FormGroup>
            <Button color="primary" type="submit">Update Profile</Button>
        </form>
    </CardBody>
</Card>

<Card class="mt-4">
    <CardHeader>
        <h2>Update Password</h2>
    </CardHeader>
    <CardBody>
        <Alert color="info">
            For your security, you will be logged out after successfully updating your password.
        </Alert>

        <form on:submit|preventDefault={handleUpdatePassword}>
            {#if passwordError}
                <Alert color="danger">{passwordError}</Alert>
            {/if}
            <FormGroup>
                <Label for="oldPassword">Current Password</Label>
                <PasswordInput
                        id="oldPassword"
                        bind:value={oldPassword}
                        placeholder="Enter your current password"
                        required
                />
            </FormGroup>
            <FormGroup>
                <Label for="newPassword">New Password</Label>
                <div class="form-text">
                    Password requires min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char.
                </div>
                <PasswordInput
                        id="newPassword"
                        bind:value={newPassword}
                        placeholder="Enter new password"
                        required
                />
            </FormGroup>
            <FormGroup>
                <Label for="confirmPassword">Confirm New Password</Label>
                <PasswordInput
                        id="confirmPassword"
                        bind:value={confirmPassword}
                        placeholder="Confirm your new password"
                        required
                />
            </FormGroup>
            <Button color="primary" type="submit">Update Password and Log Out</Button>
        </form>
    </CardBody>
</Card>