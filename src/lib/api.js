export async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `${import.meta.env.VITE_API_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    console.log(`API request to ${method} ${url}`);

    try {
        const response = await fetch(url, options);
        console.log('Response status: ', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response: ', errorData);

            const error = new Error(errorData.detail || "Request failed");
            error.detail = errorData.detail || errorData.message || "Unknown error";
            error.status = response.status;
            error.data = errorData;
            throw error;
        }
        return response.json();
    } catch (err) {
        console.error('API request failed: ${err.message}');
        throw err;
    }
}

export async function refreshToken() {
    try {
        const data = await apiRequest('/user/protected/refresh', 'POST');
        return data.token;
    } catch (err) {
        throw new Error('Token refresh failed: ' + (err.detail || err.message));
    }
}

export async function getTasks() {
    try {
        return await apiRequest('/tasks', 'GET');
    } catch (err) {
        throw new Error('Failed to get tasks: ' + (err.detail || err.message));
    }
}

export async function getTask(id) {
    try {
        return await apiRequest(`/tasks/${id}`, 'GET');
    } catch (err) {
        throw new Error('Failed to get task: ' + (err.detail || err.message));
    }
}

export async function createTask(taskData) {
    try {
        const response = await apiRequest('/tasks', 'POST', taskData);
        return response.task;
    } catch (err) {
        throw new Error('Failed to create task: ' + (err.detail || err.message));
    }
}

export async function updateTask(id, taskData) {
    try {
        const response = await apiRequest(`/tasks/${id}`, 'PUT', taskData);
        return response.task;
    } catch (err) {
        throw new Error('Failed to update task: ' + (err.detail || err.message));
    }
}

export async function deleteTask(id) {
    try {
        await apiRequest(`/tasks/${id}`, 'DELETE');
    } catch (err) {
        throw new Error('Failed to delete task: ' + (err.detail || err.message));
    }
}