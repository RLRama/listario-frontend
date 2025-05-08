<script>
    import {onMount} from "svelte";
    import {user, tasks} from "$lib/stores.js";
    import {goto} from "$app/navigation";
    import {getTask} from "$lib/api.js";
    import {Alert, Button, Form, FormGroup, Input, Label} from "@sveltestrap/sveltestrap";

    export let data;
    let task = null;
    let error = null;
    let success = null;

    onMount(async () => {
        if (!$user) {
            goto('/login');
            return;
        } try {
            task = await getTask(data.id);
        } catch (e) {
            error = e.detail || e.message || 'Failed to get task';
        }
    });

    async function handleUpdateTask() {
        error = null;
        success = null;
        try {
            const updatedTask = await updateTask(data.id, {
                title: task.title,
                description: task.description,
                category_id: task.category_id,
                completed: task.completed,
                tag_ids: task.tag_ids.map((_, i) => i + 1)
            });
            task = updatedTask;
            $tasks = $tasks.map(t => t.id === task.id ? task : t);
        } catch (e) {
            error = e.detail || e.message || 'Failed to update task';
        }
    }

    async function handleDeleteTask() {
        error = null;
        success = null;
        try {
            await deleteTask(data.id);
            $tasks = $tasks.filter(t => t.id !== parseInt(data.id));
            goto('/tasks');
        } catch (e) {
            error = e.detail || e.message || 'Failed to delete task';
        }
    }
</script>

{#if error}
    <Alert color="danger">{error}</Alert>
{/if}
{#if success}
    <Alert color="success">{success}</Alert>
{/if}
{#if task}
    <h1>Task: {task.title}</h1>
    <Form on:submit={() => handleUpdateTask()}>
        <FormGroup>
            <Label for="title">Title</Label>
            <Input type="text" id="title" name="title" bind:value={task.title} required />
        </FormGroup>
        <FormGroup>
            <Label for="description">Description</Label>
            <Input type="textarea" id="description" name="description" bind:value={task.description} />
        </FormGroup>
        <FormGroup>
            <Label for="category_id">Category ID</Label>
            <Input type="number" id="category_id" name="category_id" bind:value={task.category_id} required />
        </FormGroup>
        <FormGroup>
            <Label for="completed">Completed</Label>
            <Input type="checkbox" id="completed" name="completed" bind:checked={task.completed} />
        </FormGroup>
        <Button type="submit" color="primary">Update task</Button>
        <Button color="danger" on:click={handleDeleteTask}>Delete task</Button>
        <p>Category: {task.category_name}</p>
        <p>Tags: {task.tag_names.join(', ')}</p>
    </Form>
{:else}
    <p>Loading task...</p>
{/if}