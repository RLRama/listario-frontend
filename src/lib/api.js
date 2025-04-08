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