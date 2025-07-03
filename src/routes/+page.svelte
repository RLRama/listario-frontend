<script lang="ts">
    import { user } from '$lib/stores/auth';
    import { Button, Card, CardBody, CardTitle, CardText } from '@sveltestrap/sveltestrap';
</script>

<Card class="text-center">
    <CardBody>
        <CardTitle>
            <h1>Welcome to Listario</h1>
        </CardTitle>
        {#if $user}
            <CardText class="lead">
                Hello, {$user.username}! You are logged in and ready to go.
            </CardText>
            <Button color="primary" href="/profile">View Your Profile</Button>
        {:else}
            <CardText class="lead">
                Your simple and effective task management solution. Please log in or create an account to get
                started.
            </CardText>
            <div>
                <Button color="primary" href="/login">Login</Button>
                <Button color="secondary" href="/register" class="ms-2">Register</Button>
            </div>
        {/if}
    </CardBody>
</Card>