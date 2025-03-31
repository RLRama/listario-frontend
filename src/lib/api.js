export async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = `http://localhost:8080${endpoint}`;
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
    const response = await fetch(url, options);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
    }
    return response.json();
}