import {API_BASE_URL} from './config.js';
import {getToken} from './storage.js';

async function request(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}`} : {}),
        ...options.headers
    };

    const response = await fetch (`${API_BASE_URL}${endpoint}`,{
        ...options,
        headers
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(data.error || 'Erro na requisição.');
    }

    return data;
}

export function register({name, email, password}){
    return request('/auth/register',{
        method: 'POST',
        body: JSON.stringify({name, email, password})
    });
}

export function login ({email, password}){
    return request ('/auth/login',{
        method: 'POST',
        body: JSON.stringify({email, password})
    });
}