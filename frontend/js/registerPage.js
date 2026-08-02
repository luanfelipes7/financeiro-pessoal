import { register, login } from "./api.js";
import {saveSession} from './storage.js';
import { applyStoredTheme } from './theme.js';
applyStoredTheme();

const form = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async(event) =>{
    event.preventDefault();

    errorMessage.classList.remove('visible');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Criando conta...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
        await register({name, email, password});
        const data = await login ({email, password});
        saveSession(data.token, data.user);
        window.location.href = 'dashboard.html';
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.add('visible');
    } finally{
        submitBtn.disabled = false;
        submitBtn.textContent = 'Criar conta';
    }
});