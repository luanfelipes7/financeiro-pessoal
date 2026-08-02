import {login} from './api.js';
import {saveSession, isAuthenticated} from './storage.js';
import { applyStoredTheme } from './theme.js';
applyStoredTheme();

if(isAuthenticated()){
    window.location.href = 'dashboard.html';
}

const form = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (event) =>{
    event.preventDefault();

    errorMessage.classList.remove('visible');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Entrando...';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
        const data = await login ({email, password});
        saveSession(data.token, data.user);
        window.location.href = 'dashboard.html';
    } catch (error){
        errorMessage.textContent = error.message;
        errorMessage.classList.add('visible');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Entrar';
    }
});