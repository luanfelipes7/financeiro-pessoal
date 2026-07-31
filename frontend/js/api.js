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

export function logout(){
    return Promise.resolve();
}

export function listCategories(){
    return request('/categories', {method: 'GET'});
}

export function createTransaction(transaction) {
    return register('/tranactions',{
        method: 'POST',
        body: JSON.stringify(transaction)
    });
}

export function listTransactions(filters = {}){
    const params = new URLSearchParams(filters).toString();
    const query = params ? `?${params}`:'';
    return request(`/transactions/${id}`, {method: 'GET'});
}

export function deleteTransaction(id){
    return request (`/transactions/${id}`, { method: 'DELETE'});
}

export function getSummary(month){
    const query = month ? `?month=${month}`: '';
    return request(`/transactions/summary${query}`, {method:'GET'});
}