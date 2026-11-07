// ============================================
// FINANCE DEPARTMENT
// Records stay in this browser so Add, Edit, and Delete
// change the tables the Finance page is already showing.
// ============================================

const FINANCE_STORAGE_KEY = 'churchFinanceLedger';
const SAVINGS_FUND = 15000;

const INCOME_CATEGORIES = [
    ['tithe', 'Tithe'],
    ['offering', 'Offering'],
    ['special', 'Special Offering'],
    ['donation', 'Donation'],
    ['building', 'Building Fund'],
    ['missions', 'Missions']
];

const EXPENSE_CATEGORIES = [
    ['utilities', 'Utilities'],
    ['maintenance', 'Maintenance'],
    ['salaries', 'Salaries'],
    ['supplies', 'Supplies'],
    ['outreach', 'Outreach'],
    ['rent', 'Rent/Mortgage'],
    ['other', 'Other']
];

const PAYMENT_METHODS = [
    ['cash', 'Cash'],
    ['check', 'Check'],
    ['card', 'Credit Card'],
    ['transfer', 'Bank Transfer'],
    ['online', 'Online Payment']
];

const SEED_LEDGER = {
    donations: [
        { id: 'don-1', date: '2026-06-07', donor: 'Jean Baptiste', amount: 250, type: 'Tithe', method: 'Cash', purpose: 'General Fund' },
        { id: 'don-2', date: '2026-06-06', donor: 'Marie Laurent', amount: 500, type: 'Offering', method: 'Online Payment', purpose: 'Building Fund' },
        { id: 'don-3', date: '2026-06-05', donor: 'Pierre Dubois', amount: 150, type: 'Tithe', method: 'Bank Transfer', purpose: 'General Fund' },
        { id: 'don-4', date: '2026-06-04', donor: 'Sophie Martin', amount: 300, type: 'Special Offering', method: 'Check', purpose: 'Missions' },
        { id: 'don-5', date: '2026-06-03', donor: 'Anonymous', amount: 1000, type: 'Donation', method: 'Online Payment', purpose: 'Building Fund' }
    ],
    expenses: [
        { id: 'exp-1', date: '2026-06-06', category: 'Utilities', description: 'Electricity bill for June', amount: 450, method: 'Bank Transfer', receipt: 'receipt-001.pdf' },
        { id: 'exp-2', date: '2026-06-05', category: 'Maintenance', description: 'AC repair in main hall', amount: 275, method: 'Cash', receipt: 'receipt-002.pdf' },
        { id: 'exp-3', date: '2026-06-04', category: 'Supplies', description: 'Office supplies and paper', amount: 85, method: 'Credit Card', receipt: 'receipt-003.pdf' },
        { id: 'exp-4', date: '2026-06-01', category: 'Salaries', description: 'Staff salaries for June', amount: 3500, method: 'Bank Transfer', receipt: 'payroll-june.pdf' }
    ],
    budgets: [
        { id: 'bud-1', name: 'Utilities', amount: 500 },
        { id: 'bud-2', name: 'Maintenance', amount: 400 },
        { id: 'bud-3', name: 'Salaries', amount: 4000 },
        { id: 'bud-4', name: 'Supplies', amount: 150 },
        { id: 'bud-5', name: 'Outreach', amount: 300 }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    loadFinanceStats();
    renderDonationsTable();
    renderExpensesTable();
    renderBudget();
    initializeTransactionForm();
    initializeBudgetForm();
});

function loadLedger() {
    try {
        const saved = JSON.parse(localStorage.getItem(FINANCE_STORAGE_KEY) || 'null');
        if (saved && Array.isArray(saved.donations) && Array.isArray(saved.expenses)) {
            saved.budgets = Array.isArray(saved.budgets) ? saved.budgets : SEED_LEDGER.budgets.map(item => ({ ...item }));
            return saved;
        }
    } catch (error) {
        console.error('Could not read finance records:', error);
    }
    return {
        donations: SEED_LEDGER.donations.map(item => ({ ...item })),
        expenses: SEED_LEDGER.expenses.map(item => ({ ...item })),
        budgets: SEED_LEDGER.budgets.map(item => ({ ...item }))
    };
}

function saveLedger(ledger) {
    localStorage.setItem(FINANCE_STORAGE_KEY, JSON.stringify(ledger));
}

function loadFinanceStats() {
    const ledger = loadLedger();
    const income = ledger.donations.reduce((sum, item) => sum + Number(item.amount), 0);
    const expenses = ledger.expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    setText('totalIncome', formatCurrency(income));
    setText('totalExpenses', formatCurrency(expenses));
    setText('netBalance', formatCurrency(income - expenses));
    setText('savings', formatCurrency(SAVINGS_FUND));
}

function renderDonationsTable() {
    const tbody = document.getElementById('donationsTableBody');
    if (!tbody) return;

    const filter = document.getElementById('donationFilter')?.value || 'all';
    const donations = loadLedger().donations
        .filter(item => matchesDateFilter(item.date, filter))
        .sort((a, b) => b.date.localeCompare(a.date));

    if (!donations.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#718096;">No donations in this period.</td></tr>';
        return;
    }

    tbody.innerHTML = donations.map(donation => `
        <tr>
            <td>${formatFinanceDate(donation.date)}</td>
            <td>${escapeHtml(donation.donor)}</td>
            <td><strong>${formatCurrency(donation.amount)}</strong></td>
            <td><span class="badge badge-primary">${escapeHtml(donation.type)}</span></td>
            <td>${escapeHtml(donation.method)}</td>
            <td>${escapeHtml(donation.purpose)}</td>
            <td class="table-actions">
                <button type="button" class="action-btn" onclick="viewDonation('${donation.id}')" title="View"><i class="fas fa-eye"></i></button>
                <button type="button" class="action-btn" onclick="editDonation('${donation.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button type="button" class="action-btn delete" onclick="deleteDonation('${donation.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderExpensesTable() {
    const tbody = document.getElementById('expensesTableBody');
    if (!tbody) return;

    const filter = (document.getElementById('expenseFilter')?.value || 'all').toLowerCase();
    const expenses = loadLedger().expenses
        .filter(item => filter === 'all' || item.category.toLowerCase() === filter || categoryKey(EXPENSE_CATEGORIES, item.category) === filter)
        .sort((a, b) => b.date.localeCompare(a.date));

    if (!expenses.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#718096;">No expenses in this category.</td></tr>';
        return;
    }

    tbody.innerHTML = expenses.map(expense => `
        <tr>
            <td>${formatFinanceDate(expense.date)}</td>
            <td><span class="badge badge-info">${escapeHtml(expense.category)}</span></td>
            <td>${escapeHtml(expense.description)}</td>
            <td><strong>${formatCurrency(expense.amount)}</strong></td>
            <td>${escapeHtml(expense.method)}</td>
            <td>${expense.receipt
                ? `<a href="#" onclick="viewReceipt('${expense.id}'); return false;"><i class="fas fa-file-pdf"></i> View</a>`
                : '<span style="color:#718096;">None</span>'}</td>
            <td class="table-actions">
                <button type="button" class="action-btn" onclick="editExpense('${expense.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                <button type="button" class="action-btn delete" onclick="deleteExpense('${expense.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderBudget() {
    const list = document.getElementById('budgetList');
    if (!list) return;

    const ledger = loadLedger();
    if (!ledger.budgets.length) {
        list.innerHTML = '<p style="color:#718096;">No budget categories yet.</p>';
        drawBudgetChart();
        return;
    }

    list.innerHTML = ledger.budgets.map(budget => {
        const spent = spentForCategory(ledger.expenses, budget.name);
        const width = budget.amount > 0 ? Math.min(100, Math.round((spent / budget.amount) * 100)) : 0;
        return `
            <div class="budget-row">
                <div class="budget-row-head">
                    <strong>${escapeHtml(budget.name)}</strong>
                    <span>${formatCurrency(spent)} / ${formatCurrency(budget.amount)}</span>
                </div>
                <div class="budget-bar"><div style="width:${width}%"></div></div>
            </div>
        `;
    }).join('');
    drawBudgetChart();
}

function initializeTransactionForm() {
    const form = document.getElementById('transactionForm');
    const typeSelect = document.getElementById('transactionType');
    const categorySelect = document.getElementById('transactionCategory');
    if (!form || !typeSelect || !categorySelect) return;

    typeSelect.addEventListener('change', function() {
        fillCategoryOptions(this.value, '');
        const descriptionLabel = document.querySelector('label[for="transactionDescription"]');
        if (descriptionLabel) {
            descriptionLabel.textContent = this.value === 'income' ? 'Donor name' : 'Description';
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const type = typeSelect.value;
        const date = document.getElementById('transactionDate').value;
        const amount = Number(document.getElementById('transactionAmount').value);
        const category = categorySelect.value;
        const description = document.getElementById('transactionDescription').value.trim();
        const method = document.getElementById('transactionMethod').value;

        if (!type || !date || !category || !method || !Number.isFinite(amount) || amount < 0) {
            showNotification('Please complete every required field.', 'error');
            return;
        }

        const ledger = loadLedger();
        const editId = form.dataset.editId || '';
        const existingExpense = ledger.expenses.find(item => item.id === editId);
        const id = editId || createId(type === 'income' ? 'don' : 'exp');

        ledger.donations = ledger.donations.filter(item => item.id !== id);
        ledger.expenses = ledger.expenses.filter(item => item.id !== id);

        if (type === 'income') {
            const categoryName = categoryLabel(INCOME_CATEGORIES, category);
            ledger.donations.push({
                id: id,
                date: date,
                donor: description || 'Anonymous',
                amount: amount,
                type: categoryName,
                method: categoryLabel(PAYMENT_METHODS, method),
                purpose: categoryName
            });
        } else {
            ledger.expenses.push({
                id: id,
                date: date,
                category: categoryLabel(EXPENSE_CATEGORIES, category),
                description: description || categoryLabel(EXPENSE_CATEGORIES, category),
                amount: amount,
                method: categoryLabel(PAYMENT_METHODS, method),
                receipt: existingExpense?.receipt || ''
            });
        }

        saveLedger(ledger);
        delete form.dataset.editId;
        closeModal('transactionModal');
        loadFinanceStats();
        renderDonationsTable();
        renderExpensesTable();
        renderBudget();
        showNotification(editId ? 'Transaction updated.' : 'Transaction added.', 'success');
    });
}

function initializeBudgetForm() {
    const form = document.getElementById('budgetForm');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('budgetName').value.trim();
        const amount = Number(document.getElementById('budgetAmount').value);
        if (!name || !Number.isFinite(amount) || amount < 0) {
            showNotification('Enter a category name and amount.', 'error');
            return;
        }

        const ledger = loadLedger();
        const existing = ledger.budgets.find(item => item.name.toLowerCase() === name.toLowerCase());
        if (existing) {
            existing.name = name;
            existing.amount = amount;
        } else {
            ledger.budgets.push({ id: createId('bud'), name: name, amount: amount });
        }
        saveLedger(ledger);
        closeModal('budgetModal');
        renderBudget();
        showNotification(existing ? 'Budget category updated.' : 'Budget category added.', 'success');
    });
}

function openTransactionModal() {
    const form = document.getElementById('transactionForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
    }
    const title = document.getElementById('transactionModalTitle');
    if (title) title.innerHTML = '<i class="fas fa-plus-circle"></i> Add Transaction';
    fillCategoryOptions('', '');
    const dateInput = document.getElementById('transactionDate');
    if (dateInput) dateInput.value = todayString();
    const descriptionLabel = document.querySelector('label[for="transactionDescription"]');
    if (descriptionLabel) descriptionLabel.textContent = 'Description';
    openModal('transactionModal');
}

function openBudgetModal() {
    const form = document.getElementById('budgetForm');
    if (form) form.reset();
    openModal('budgetModal');
}

function viewDonation(id) {
    const donation = loadLedger().donations.find(item => item.id === id);
    if (!donation) return;
    alert(`Donation Details:\n\nDate: ${formatFinanceDate(donation.date)}\nDonor: ${donation.donor}\nAmount: ${formatCurrency(donation.amount)}\nType: ${donation.type}\nMethod: ${donation.method}\nPurpose: ${donation.purpose}`);
}

function editDonation(id) {
    const donation = loadLedger().donations.find(item => item.id === id);
    if (!donation) return;
    openRecordInModal({
        id: donation.id,
        kind: 'income',
        date: donation.date,
        amount: donation.amount,
        category: categoryKey(INCOME_CATEGORIES, donation.type),
        description: donation.donor === 'Anonymous' ? '' : donation.donor,
        method: categoryKey(PAYMENT_METHODS, donation.method),
        title: 'Edit Donation'
    });
}

function deleteDonation(id) {
    const donation = loadLedger().donations.find(item => item.id === id);
    if (!donation) return;
    if (!confirm(`Delete the ${formatCurrency(donation.amount)} donation from ${donation.donor}?`)) return;
    const ledger = loadLedger();
    ledger.donations = ledger.donations.filter(item => item.id !== id);
    saveLedger(ledger);
    loadFinanceStats();
    renderDonationsTable();
    showNotification('Donation deleted.', 'success');
}

function editExpense(id) {
    const expense = loadLedger().expenses.find(item => item.id === id);
    if (!expense) return;
    openRecordInModal({
        id: expense.id,
        kind: 'expense',
        date: expense.date,
        amount: expense.amount,
        category: categoryKey(EXPENSE_CATEGORIES, expense.category),
        description: expense.description,
        method: categoryKey(PAYMENT_METHODS, expense.method),
        title: 'Edit Expense'
    });
}

function deleteExpense(id) {
    const expense = loadLedger().expenses.find(item => item.id === id);
    if (!expense) return;
    if (!confirm(`Delete "${expense.description}"?`)) return;
    const ledger = loadLedger();
    ledger.expenses = ledger.expenses.filter(item => item.id !== id);
    saveLedger(ledger);
    loadFinanceStats();
    renderExpensesTable();
    renderBudget();
    showNotification('Expense deleted.', 'success');
}

function viewReceipt(id) {
    const expense = loadLedger().expenses.find(item => item.id === id);
    if (!expense) return;
    if (!expense.receipt) {
        alert(`No receipt file is attached to "${expense.description}".`);
        return;
    }
    alert(`Receipt: ${expense.receipt}\n\n${expense.description}\n${formatFinanceDate(expense.date)} · ${expense.category}\n${formatCurrency(expense.amount)} · ${expense.method}\n\nThis record does not have a stored file yet. The receipt name is kept with the expense.`);
}

function filterDonations() {
    renderDonationsTable();
}

function filterExpenses() {
    renderExpensesTable();
}

function exportData(dataType) {
    if (dataType === 'donations') {
        const rows = loadLedger().donations.map(item => [item.date, item.donor, item.amount, item.type, item.method, item.purpose]);
        downloadCsv('donations.csv', ['Date', 'Donor', 'Amount', 'Type', 'Method', 'Purpose'], rows);
        return;
    }
    if (dataType === 'requests') {
        const requests = typeof getFinanceRequests === 'function' ? getFinanceRequests() : [];
        const rows = requests.map(item => [
            item.requestNumber,
            (item.submissionDate || '').slice(0, 10),
            item.requestorInfo?.fullName || '',
            item.requestorInfo?.department || '',
            item.requestDetails?.purpose || '',
            item.requestDetails?.amount || '',
            item.status
        ]);
        downloadCsv('finance-requests.csv', ['Request', 'Date', 'Requestor', 'Department', 'Purpose', 'Amount', 'Status'], rows);
        return;
    }
    showNotification('There is nothing to export for ' + dataType + '.', 'info');
}

function generateReport(reportType) {
    const ledger = loadLedger();
    const income = ledger.donations.reduce((sum, item) => sum + Number(item.amount), 0);
    const expenses = ledger.expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    if (reportType === 'donations') {
        exportData('donations');
        return;
    }
    if (reportType === 'expenses') {
        const rows = ledger.expenses.map(item => [item.date, item.category, item.description, item.amount, item.method, item.receipt || '']);
        downloadCsv('expenses.csv', ['Date', 'Category', 'Description', 'Amount', 'Payment Method', 'Receipt'], rows);
        return;
    }

    const rows = [
        ['Income', income],
        ['Expenses', expenses],
        ['Net balance', income - expenses],
        ['Savings fund', SAVINGS_FUND]
    ];
    ledger.expenses.forEach(item => rows.push(['Expense', item.date, item.category, item.description, item.amount]));
    ledger.donations.forEach(item => rows.push(['Donation', item.date, item.type, item.donor, item.amount]));
    downloadCsv(reportType + '-financial-report.csv', ['Section', 'Date or label', 'Category', 'Detail', 'Amount'], rows);
}

function openRecordInModal(record) {
    const form = document.getElementById('transactionForm');
    const title = document.getElementById('transactionModalTitle');
    if (!form) return;
    form.reset();
    form.dataset.editId = record.id;
    if (title) title.innerHTML = '<i class="fas fa-edit"></i> ' + escapeHtml(record.title);
    document.getElementById('transactionType').value = record.kind;
    fillCategoryOptions(record.kind, record.category);
    document.getElementById('transactionDate').value = record.date;
    document.getElementById('transactionAmount').value = record.amount;
    document.getElementById('transactionDescription').value = record.description || '';
    document.getElementById('transactionMethod').value = record.method;
    const descriptionLabel = document.querySelector('label[for="transactionDescription"]');
    if (descriptionLabel) descriptionLabel.textContent = record.kind === 'income' ? 'Donor name' : 'Description';
    openModal('transactionModal');
}

function fillCategoryOptions(type, selected) {
    const categorySelect = document.getElementById('transactionCategory');
    if (!categorySelect) return;
    const list = type === 'income' ? INCOME_CATEGORIES : type === 'expense' ? EXPENSE_CATEGORIES : [];
    const options = ['<option value="">Select category</option>']
        .concat(list.map(([value, label]) => `<option value="${value}">${label}</option>`));
    categorySelect.innerHTML = options.join('');
    categorySelect.value = selected || '';
}

function drawBudgetChart() {
    const canvas = document.getElementById('budgetChart');
    if (!canvas || !canvas.getContext) return;
    const ledger = loadLedger();
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
    canvas.width = Math.max(width, 320);
    canvas.height = 220;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!ledger.budgets.length) return;

    const maxValue = Math.max(...ledger.budgets.map(item => Math.max(item.amount, spentForCategory(ledger.expenses, item.name))), 1);
    const slot = canvas.width / ledger.budgets.length;
    ledger.budgets.forEach((budget, index) => {
        const spent = spentForCategory(ledger.expenses, budget.name);
        const x = slot * index + slot * 0.18;
        const barWidth = slot * 0.28;
        const budgetHeight = (budget.amount / maxValue) * 150;
        const spentHeight = (spent / maxValue) * 150;
        ctx.fillStyle = '#cbd5e0';
        ctx.fillRect(x, 170 - budgetHeight, barWidth, budgetHeight);
        ctx.fillStyle = '#2c5282';
        ctx.fillRect(x + barWidth + 6, 170 - spentHeight, barWidth, spentHeight);
        ctx.fillStyle = '#4a5568';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(budget.name, x + barWidth, 196);
    });
}

function spentForCategory(expenses, name) {
    return expenses
        .filter(item => item.category.toLowerCase() === name.toLowerCase())
        .reduce((sum, item) => sum + Number(item.amount), 0);
}

function matchesDateFilter(dateString, filter) {
    if (!filter || filter === 'all') return true;
    const date = parseDate(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (filter === 'today') return date.getTime() === today.getTime();
    if (filter === 'week') {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        return date >= start && date <= today;
    }
    if (filter === 'month') return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
    if (filter === 'year') return date.getFullYear() === today.getFullYear();
    return true;
}

function parseDate(value) {
    const [year, month, day] = String(value).split('-').map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
}

function formatFinanceDate(dateString) {
    return parseDate(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount) || 0);
}

function categoryLabel(list, key) {
    return (list.find(item => item[0] === key) || ['', key])[1];
}

function categoryKey(list, label) {
    const found = list.find(item => item[1].toLowerCase() === String(label || '').toLowerCase());
    return found ? found[0] : '';
}

function createId(prefix) {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function todayString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return now.getFullYear() + '-' + month + '-' + day;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

function downloadCsv(filename, headers, rows) {
    const lines = [headers].concat(rows).map(row => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([lines], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showNotification('Download started: ' + filename, 'success');
}

function csvCell(value) {
    const text = String(value ?? '');
    if (/[",\r\n]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
    return text;
}

const switchFinanceTab = window.switchTab;
window.switchTab = function(tabName, evt) {
    if (typeof switchFinanceTab === 'function') switchFinanceTab(tabName, evt);
    if (tabName === 'budget') requestAnimationFrame(drawBudgetChart);
};

window.openTransactionModal = openTransactionModal;
window.openBudgetModal = openBudgetModal;
window.editExpense = editExpense;
window.deleteExpense = deleteExpense;
window.viewReceipt = viewReceipt;
window.viewDonation = viewDonation;
window.editDonation = editDonation;
window.deleteDonation = deleteDonation;
window.filterDonations = filterDonations;
window.filterExpenses = filterExpenses;
window.exportData = exportData;
window.generateReport = generateReport;
