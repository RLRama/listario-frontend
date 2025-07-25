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

    let taskToEdit: Task | null = null;
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

    function openEditModal(task: Task) {
        taskToEdit = task;
        editTitle = task.title;
        editContent = task.content;
    }

    function closeEditModal() {
        taskToEdit = null;
    }

    async function handleUpdateTask() {
        if (!taskToEdit || !editTitle.trim()) return;
        error = null;
        try {
            await updateTask(taskToEdit.id, { title: editTitle, content: editContent });
            closeEditModal();
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
                    <ListGroupItem class="d-flex justify-content-between align-items-center">
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
                            <Button outline color="primary" size="sm" class="ms-2" on:click={() => openEditModal(task)}>
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
                    </ListGroupItem>
                {/each}
            </ListGroup>
        {/if}
    </CardBody>
</Card>

{#if taskToEdit}
    <Modal isOpen={true} toggle={closeEditModal}>
        <ModalHeader toggle={closeEditModal}>Edit task</ModalHeader>
        <ModalBody>
            <form on:submit|preventDefault={handleUpdateTask} id="edit-task-form">
                <FormGroup>
                    <Label for="editTitle">Title</Label>
                    <Input id="editTitle" bind:value={editTitle} required />
                </FormGroup>
                <FormGroup>
                    <Label for="editContent">Content</Label>
                    <Input type="textarea" id="editContent" bind:value={editContent} />
                </FormGroup>
            </form>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" type="submit" form="edit-task-form">Save Changes</Button>
            <Button color="secondary" on:click={closeEditModal}>Cancel</Button>
        </ModalFooter>
    </Modal>
{/if}