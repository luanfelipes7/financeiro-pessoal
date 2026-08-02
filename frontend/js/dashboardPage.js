import {listCategoreis, createCategory, listTransactions, deleteCategory, getSummary } from './api.js';
import { getUser, clearSession, isAuthenticated } from './storage.js';

if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

const user = getUser();
document.getElementById('user-name').textContent = user ? user.name : '';

document.getElementById('logoutBtn').addEventListener('click', ()=>{
    clearSession();
    window.location.href = 'login.html';
});

document.getElementById('date').valueAsDate = new Date();

let chart = null;

async function loadCategoties(){
    const {categories} = await listCategories();
    const select = document.getElementById('category');
    const type = document.getElementById('type').value;

    select.innerHTML = '';
    categories
        .filter((c) => c.type === type)
        .forEach((c) => {
            const option = document.createElement('option');
            option.value = c.name;
            option.textContent = c.name;
            select.appendChild(option);
        });
}

document.getElementById('type').addEventListener('change', loadCategories);

function formatCurrency(value) {
    return value.toLocaleString('pt-BR',{ style: 'currency', currency: 'BRL' });
}

async function loadSummary(){
    const {totalIncome, totalExpense, balance} = await getSummary();
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    document.getElementById('balance').textContent = formatCurrency(balance);
}

function renderChart(transactions){
    const expensesByCategory = {};
    transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        });

    const ctx = document.getElementById('expenseChart');

    if (chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(expensesByCategory),
            datasets: [{
                data: Object.values(expensesByCategory),
                backgroundColor: ['#dc2626', '#f97316', '#eab308', '#2563eb', '#8b5cf6', '#16a34a']
            }]
        },
        options: { responsive: true }
    });
}

function renderTransactions(transactions){
    const list = document.getElementById('transactionList');
    list.innerHTML = '';

    transactions.forEach((t) => {
        const item = document.createElement('li');
        item.className = 'transaction-item';
        item.innerHTML = `
        <span>${t.date} - ${t.category}${t.description ? ' - ' + t.description : ''} </span>
        <span>
                <span class="amount-${t.type}">${t.type === 'expense' ? '-' : '+'} ${formatCurrency(t.amount)}</span>
                <button data-id="${t.id}">Excluir</button>
            </span>
        `;
        list.appendChild(item);
    });

    list.querySelectorAll('button[data-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
            await deleteCategory(btn.dataset.id);
            await refreshAll();
        });
    });
}

async function loadTransactions(){
    const {transactions} = await listTransactions();
    renderTransactions(transactions);
    renderChart(transactions);
}

async function refreshAll(){
    await Promise.all([loadSummary(), loadTransactions()]);
}

document.getElementById('transactionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';

    const transaction = {
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value),
        date: document.getElementById('date').value,
        description: document.getElementById('description').value
    };

    try {
        await createTransaction(transaction);
        document.getElementById('amount').value = '';
        document.getElementById('description').value = '';
        await refreshAll();
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.add('visible');
    }
});

loadCategories();
refreshAll();