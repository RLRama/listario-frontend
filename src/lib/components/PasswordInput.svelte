<script lang="ts">
    import { Button, Input, InputGroup, Icon } from '@sveltestrap/sveltestrap';

    export let value: string;
    export let id: string;
    export let placeholder = '';
    export let required = false;

    let inputType: 'password' | 'text' = 'password';

    function togglePasswordVisibility() {
        inputType = inputType === 'password' ? 'text' : 'password';
    }
</script>

<InputGroup>
    <Input {id} type={inputType} bind:value {placeholder} {required} />
    <Button outline on:click={togglePasswordVisibility} type="button" title="Toggle password visibility">
        {#if inputType === 'password'}
            <Icon name="eye-fill" />
        {:else}
            <Icon name="eye-slash-fill" />
        {/if}
    </Button>
</InputGroup>