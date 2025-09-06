<script lang="ts">
    import { onMount } from 'svelte';
    import {
        Alert,
        Button,
        Card,
        CardBody,
        CardHeader,
        CardTitle,
        FormGroup,
        Input,
        Label,
        ListGroup,
        ListGroupItem,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Spinner
    } from '@sveltestrap/sveltestrap';
    import { createTask, deleteTask, getTasks, updateTask } from '$lib/services/api';
    import type { Task } from '$lib/types';

    let tasks: Task[] = [];
    let isLoading = true;
    let error: string | null = null;

    let newTitle = '';
    let newContent = '';

    let editingTaskId: number | null = null;
    let editTitle = '';
    let editContent = '';

    onMount(async () => {
        await loadTasks();
    });

    async function loadTasks() {
        isLoading = true;
        error = null;
        try {
            tasks = await getTasks();
        } catch (err: any) {
            error = err.message || 'Failed to load tasks.';
        } finally {
            isLoading = false;
        }
    }

    async function handleCreateTask() {
        if (!newTitle.trim()) return;
        error = null;
        try {
            await createTask(newTitle, newContent);
            newTitle = '';
            newContent = '';
            await loadTasks();
        } catch (err: any) {
            error = err.message || 'Failed to create task.';
        }
    }

    async function handleDeleteTask(id: number) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        error = null;
        try {
            await deleteTask(id);
            await loadTasks();
        } catch (err: any) {
            error = err.message || 'Failed to delete task.';
        }
    }

    function startEditing(task: Task) {
        editingTaskId = task.id;
        editTitle = task.title;
        editContent = task.content;
    }

    function cancelEditing() {
        editingTaskId = null;
    }


    async function handleUpdateTask() {
        if (!editingTaskId || !editTitle.trim()) return;
        error = null;
        try {
            await updateTask(editingTaskId, { title: editTitle, content: editContent });
            editingTaskId = null; // Exit editing mode on success
            await loadTasks();
        } catch (err: any) {
            error = err.message || 'Failed to update task.';
        }
    }

    async function toggleCompleted(task: Task) {
        error = null;
        try {
            await updateTask(task.id, {
                title: task.title,
                content: task.content,
                completed: !task.completed
            });
            await loadTasks();
        } catch (err: any) {
            error = err.message || 'Failed to update task status.';
        }
    }
</script>

<svelte:head>
    <title>My tasks</title>
</svelte:head>

{#if error}
    <Alert color="danger" dismissible toggle={() => (error = null)}>{error}</Alert>
{/if}

<Card class="mb-4">
    <CardHeader>
        <CardTitle>Create new task</CardTitle>
    </CardHeader>
    <CardBody>
        <form on:submit|preventDefault={handleCreateTask}>
            <FormGroup>
                <Label for="newTitle">Title</Label>
                <Input id="newTitle" bind:value={newTitle} placeholder="What needs to be done?" required />
            </FormGroup>
            <FormGroup>
                <Label for="newContent">Content (optional)</Label>
                <Input type="textarea" id="newContent" bind:value={newContent} placeholder="Add more details..." />
            </FormGroup>
            <Button color="primary" type="submit">Add Task</Button>
        </form>
    </CardBody>
</Card>

<Card>
    <CardHeader>
        <CardTitle>My tasks</CardTitle>
    </CardHeader>
    <CardBody>
        {#if isLoading}
            <div class="text-center">
                <Spinner />
                <p>Loading tasks...</p>
            </div>
        {:else if tasks.length === 0}
            <p>You have no tasks yet. Add one above to get started!</p>
        {:else}
            <ListGroup>
                {#each tasks as task (task.id)}
                    <ListGroupItem>
                        {#if editingTaskId === task.id}
                            <form on:submit|preventDefault={handleUpdateTask}>
                                <FormGroup>
                                    <Input id="editTitle" bind:value={editTitle} required class="mb-2" />
                                </FormGroup>
                                <FormGroup>
                                    <Input type="textarea" id="editContent" bind:value={editContent} class="mb-2" />
                                </FormGroup>
                                <div>
                                    <Button color="success" type="submit" size="sm">Save</Button>
                                    <Button outline color="secondary" size="sm" class="ms-2" on:click={cancelEditing}>Cancel</Button>
                                </div>
                            </form>
                        {:else}
                            <div class="d-flex justify-content-between align-items-center">
                                <div class:text-decoration-line-through={task.completed} class:text-muted={task.completed}>
                                    <strong>{task.title}</strong>
                                    {#if task.content}<p class="mb-0 small">{task.content}</p>{/if}
                                </div>
                                <div>
                                    <Button
                                            outline
                                            color={task.completed ? 'secondary' : 'success'}
                                            size="sm"
                                            on:click={() => toggleCompleted(task)}
                                            title={task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                                    >
                                        {task.completed ? 'Undo' : 'Complete'}
                                    </Button>
                                    <Button outline color="primary" size="sm" class="ms-2" on:click={() => startEditing(task)}>
                                        Edit
                                    </Button>
                                    <Button
                                            outline
                                            color="danger"
                                            size="sm"
                                            class="ms-2"
                                            on:click={() => handleDeleteTask(task.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        {/if}
                    </ListGroupItem>
                {/each}
            </ListGroup>
        {/if}
    </CardBody>
</Card>