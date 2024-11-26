// src/utils/api.js
const apiUrl = import.meta.env.VITE_API_URL;

const makeRequest = async (url, method = 'GET', body = null) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${apiUrl}${url}`, options);
        console.log(`Response status: ${response.status}`);

        if (response.status === 401) {
            console.warn('Unauthorized. Redirecting to login.');
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }
        
        const data = await response.json();
        console.log(`Response data:`, data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Funciones específicas para cada operación
export const api = {
    // Projects
    getProjects: () => makeRequest('/projects'),
    createProject: (data) => makeRequest('/projects', 'POST', data),
    updateProject: (id, data) => makeRequest(`/projects/${id}`, 'PUT', data),
    deleteProject: (id) => makeRequest(`/projects/${id}`, 'DELETE'),

    // Tests
    getTests: () => makeRequest('/tests'),
    createTest: (data) => makeRequest('/tests', 'POST', data),
    updateTest: (id, data) => makeRequest(`/tests/${id}`, 'PUT', data),
    deleteTest: (id) => makeRequest(`/tests/${id}`, 'DELETE'),

    // Reports
    getStats: () => makeRequest('/stats'),
    getMonthlyProgress: () => makeRequest('/monthly-progress')
};