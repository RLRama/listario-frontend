<script>
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import {user} from "$lib/stores.js"
    import {apiRequest} from "$lib/api.js";
    import {Alert, Form, FormGroup, Input, Label} from "@sveltestrap/sveltestrap";

    let tasks = [];
    let newTask = { title: '', description: '', completed: false, category_id: 0, due_date: '', tag_ids: [] };
    let error = null;

    onMount(async () => {
        if (!$user) {
            goto('/login');
        } else {
            await fetchTasks();
        }
    });

    async function fetchTasks() {
        try {
            tasks = await apiRequest('/tasks');
        } catch (e) {
            error = e.detail || 'Failed to fetch tasks';
        }
    }

    async function createTask() {
        try {
            await apiRequest('/tasks', 'POST', newTask);
            newTask = { title: '', description: '', completed: false, category_id: 0, due_date: '', tag_ids: [] };
            await fetchTasks();
            error = null;
        } catch (e) {
            error = e.detail || 'Failed to create task';
        }
    }

    async function deleteTask(id) {
        try {
            await apiRequest(`/tasks/${id}`, 'DELETE');
            await fetchTasks();
            error = null;
        } catch (e) {
            error = e.detail || 'Failed to delete task';
        }
    }
</script>

<h1>Listario</h1>

{#if error}
    <Alert color="danger">{error}</Alert>
{/if}

<h2>Create task</h2>

<Form on:submit={() => createTask()}>
    <FormGroup>
        <Label for="title">Title</Label>
        <Input type="text" id="title" bind:value={newTask.title} required />
    </FormGroup>
    <FormGroup>
        <Label for="description">Description</Label>
        <Input type="text" id="description" bind:value={newTask.description} />
    </FormGroup>
    <FormGroup>
        <Label for="completed">Completed</Label>
        <Input type="checkbox" id="completed" bind:value={newTask.completed} />
    </FormGroup>
    <FormGroup>
        <Label for="description">Category</Label>
        <Input type="text" id="description" bind:value={newTask.description} />
    </FormGroup>
</Form>