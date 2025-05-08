<script>
    import {onMount} from "svelte";
    import {loading, tasks, user} from "$lib/stores.js";
    import {goto} from "$app/navigation";
    import {createTask, getTasks} from "$lib/api.js";
    import {Alert, Button, Form, FormGroup, Input, Label} from "@sveltestrap/sveltestrap";

    let newTask = { title: '', description: '', category_id: 1, completed: false, tag_ids: [] };
    let error = null;
    let success = null;

    onMount(async () => {
        if (!$user) {
            goto('/login');
            return;
        }
        $loading = true;
        try {
            $tasks = await getTasks();
        } catch (e) {
            error = e.detail || e.message || 'Failed to get tasks';
        }
        $loading = false;
    });

    async function handleCreateTask() {
        $loading = true;
        error = null;
        success = null;
        try {
            const createdTask = await createTask(newTask);
            $tasks = [...$tasks, createdTask];
            newTask = { title: '', description: '', category_id: 1, completed: false, tag_ids: [] };
            success = 'Task created successfully';
        } catch (e) {
            error = e.detail || e.message || 'Failed to create task';
        }
        $loading = false;
    }
</script>

<h1>Tasks</h1>

{#if success}
    <Alert color="success">{success}</Alert>
{/if}
{#if error}
    <Alert color="danger">{error}</Alert>
{/if}

{#if $loading}
    <p>Loading...</p>
{:else}
    <ul>
        {#each $tasks as task}
            <li>
                <a href={'/tasks/${task.id}'}>
                    {task.title} ({task.category_name}) - {task.tag_names.join(', ')}
                </a>
            </li>
        {/each}
    </ul>
{/if}

<h2>Create new task</h2>
<Form on:submit={() => handleCreateTask()}>
    <FormGroup>
        <Label for="title">Title</Label>
        <Input type="text" id="title" name="title" bind:value={newTask.title} required />
    </FormGroup>
    <FormGroup>
        <Label for="description">Description</Label>
        <Input type="textarea" id="description" name="description" bind:value={newTask.description} />
    </FormGroup>
    <FormGroup>
        <Label for="category_id">Category ID</Label>
        <Input type="number" id="category_id" name="category_id" bind:value={newTask.category_id} required />
    </FormGroup>
    <FormGroup>
        <Label for="completed">Completed</Label>
        <Input type="checkbox" id="completed" name="completed" bind:value={newTask.completed} />
    </FormGroup>
    <Button type="submit" color="primary">Create task</Button>
</Form>