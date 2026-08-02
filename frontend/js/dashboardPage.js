import { listCategories, createCategory, deleteCategory, createTransaction, updateTransaction, listTransactions, deleteTransaction, getSummary } from './api.js';
import { getUser, clearSession, isAuthenticated } from './storage.js';
import { toggleTheme } from './theme.js';

if (!isAuthenticated()) {
    window.location.href = 'login.html';
}

const user = getUser();
document.getElementById('userName').textContent = user ? user.name : '';

document.getElementById('logoutBtn').addEventListener('click', () => {
    clearSession();
    window.location.href = 'login.html';
});

document.getElementById('date').valueAsDate = new Date();

let chart = null;
let editingTransactionId = null;
const PAGE_SIZE = 10;
let currentPage = 1;
let allTransactions = [];

async function loadCategories() {
    const { categories } = await listCategories();

    const typeSelect = document.getElementById('category');
    const type = document.getElementById('type').value;
    typeSelect.innerHTML = '';
    categories
        .filter((c) => c.type === type)
        .forEach((c) => {
            const option = document.createElement('option');
            option.value = c.name;
            option.textContent = c.name;
            typeSelect.appendChild(option);
        });

    const filterSelect = document.getElementById('filterCategory');
    const currentValue = filterSelect.value;
    filterSelect.innerHTML = '<option value="">Todas as categorias</option>';
    categories.forEach((c) => {
        const option = document.createElement('option');
        option.value = c.name;
        option.textContent = c.name;
        filterSelect.appendChild(option);
    });
    filterSelect.value = currentValue;
    renderCategoryList(categories);
}

document.getElementById('type').addEventListener('change', loadCategories);

document.getElementById('categoryForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('newCategoryName').value;
    const type = document.getElementById('newCategoryType').value;

    try {
        await createCategory({ name, type });
        document.getElementById('newCategoryName').value = '';
        await loadCategories();
    } catch (error) {
        alert(error.message);
    }
});

['filterMonth', 'filterCategory', 'filterType'].forEach((id) => {
    document.getElementById(id).addEventListener('change', refreshAll);
});

document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    document.getElementById('filterMonth').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterType').value = '';
    refreshAll();
});

document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function loadSummary() {
    const filters = getActiveFilters();
    const { totalIncome, totalExpense, balance } = await getSummary(filters.month);
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
    document.getElementById('balance').textContent = formatCurrency(balance);
}

function renderChart(transactions) {
    const expensesByCategory = {};
    transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        });

    const ctx = document.getElementById('expenseChart');

    if (chart) {
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
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderTransactions(transactions) {
    const list = document.getElementById('transactionList');
    list.innerHTML = '';

    transactions.forEach((t) => {
        const item = document.createElement('li');
        item.className = 'transaction-item';
        item.innerHTML = `
            <span>${t.date} - ${t.category}${t.description ? ' - ' + t.description : ''} </span>
            <span>
                <span class="amount-${t.type}">${t.type === 'expense' ? '-' : '+'} ${formatCurrency(t.amount)}</span>
                <button class="edit-btn" data-id="${t.id}" data-type="${t.type}" data-category="${t.category}" data-amount="${t.amount}" data-description="${t.description || ''}" data-date="${t.date}">Editar</button>
                <button data-id="${t.id}">Excluir</button>
            </span>
        `;
        list.appendChild(item);
    });

    list.querySelectorAll('button[data-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
            await deleteTransaction(btn.dataset.id);
            await refreshAll();
        });
    list.querySelectorAll('.edit-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            editingTransactionId = btn.dataset.id;
            document.getElementById('type').value = btn.dataset.type;
            loadCategories();
            document.getElementById('category').value = btn.dataset.category;
            document.getElementById('amount').value = btn.dataset.amount;
            document.getElementById('description').value = btn.dataset.description;
            document.getElementById('date').value = btn.dataset.date;
            document.getElementById('transactionSubmitBtn').textContent = 'Salvar edição';
        });
    });
    });
}

async function loadTransactions() {
    const { transactions } = await listTransactions(getActiveFilters());
    allTransactions = transactions;
    currentPage = 1;
    renderCurrentPage();
    renderChart(transactions);
}

async function refreshAll() {
    await Promise.all([loadSummary(), loadTransactions()]);
}

document.getElementById('transactionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.classList.remove('visible');

    const transaction = {
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value),
        date: document.getElementById('date').value,
        description: document.getElementById('description').value
    };

    try {
        if (editingTransactionId) {
            await updateTransaction(editingTransactionId, transaction);
            editingTransactionId = null;
            document.getElementById('transactionSubmitBtn').textContent = 'Adicionar';
        } else {
            await createTransaction(transaction);
        }
        document.getElementById('amount').value = '';
        document.getElementById('description').value = '';
        await refreshAll();
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.add('visible');
    }
});

function getActiveFilters() {
    const filters = {};
    const month = document.getElementById('filterMonth').value;
    const category = document.getElementById('filterCategory').value;
    const type = document.getElementById('filterType').value;

    if (month) filters.month = month;
    if (category) filters.category = category;
    if (type) filters.type = type;

    return filters;
}

function transactionsToCSV(transactions) {
    const header = 'Data,Tipo,Categoria,Descrição,Valor';
    const rows = transactions.map((t) => {
        const description = (t.description || '').replace(/,/g, ';');
        return `${t.date},${t.type},${t.category},${description},${t.amount}`;
    });
    return [header, ...rows].join('\n');
}

document.getElementById('exportCsvBtn').addEventListener('click', async () => {
    const { transactions } = await listTransactions(getActiveFilters());

    if (transactions.length === 0) {
        alert('Não há transações para exportar com esses filtros.');
        return;
    }

    const csv = transactionsToCSV(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `transacoes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
});

function renderCategoryList(categories) {
    const list = document.getElementById('categoryList');
    list.innerHTML = '';

    categories.forEach((c) => {
        const item = document.createElement('li');
        item.className = 'category-item';
        item.innerHTML = `
            <span>${c.name} (${c.type === 'income' ? 'Receita' : 'Despesa'})</span>
            <button data-id="${c.id}">Excluir</button>
        `;
        list.appendChild(item);
    });

    list.querySelectorAll('button[data-id]').forEach((btn) => {
        btn.addEventListener('click', async () => {
            try {
                await deleteCategory(btn.dataset.id);
                await loadCategories();
            } catch (error) {
                alert(error.message);
            }
        });
    });
}

function renderCurrentPage() {
    const totalPages = Math.max(1, Math.ceil(allTransactions.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageItems = allTransactions.slice(start, start + PAGE_SIZE);

    renderTransactions(pageItems);

    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
}

document.getElementById('prevPageBtn').addEventListener('click', () => {
    currentPage--;
    renderCurrentPage();
});

document.getElementById('nextPageBtn').addEventListener('click', () => {
    currentPage++;
    renderCurrentPage();
});

loadCategories();
refreshAll();