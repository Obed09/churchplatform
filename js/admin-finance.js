// ============================================
// FINANCE DEPARTMENT
// ============================================

// Sample data
const sampleDonations = [
    {
        date: '2026-06-07',
        donor: 'Jean Baptiste',
        amount: 250,
        type: 'Tithe',
        method: 'Cash',
        purpose: 'General Fund'
    },
    {
        date: '2026-06-06',
        donor: 'Marie Laurent',
        amount: 500,
        type: 'Offering',
        method: 'Online Payment',
        purpose: 'Building Fund'
    },
    {
        date: '2026-06-05',
        donor: 'Pierre Dubois',
        amount: 150,
        type: 'Tithe',
        method: 'Bank Transfer',
        purpose: 'General Fund'
    },
    {
        date: '2026-06-04',
        donor: 'Sophie Martin',
        amount: 300,
        type: 'Special Offering',
        method: 'Check',
        purpose: 'Missions'
    },
    {
        date: '2026-06-03',
        donor: 'Anonymous',
        amount: 1000,
        type: 'Donation',
        method: 'Online Payment',
        purpose: 'Building Fund'
    }
];

const sampleExpenses = [
    {
        date: '2026-06-06',
        category: 'Utilities',
        description: 'Electricity bill for June',
        amount: 450,
        method: 'Bank Transfer',
        receipt: 'receipt-001.pdf'
    },
    {
        date: '2026-06-05',
        category: 'Maintenance',
        description: 'AC repair in main hall',
        amount: 275,
        method: 'Cash',
        receipt: 'receipt-002.pdf'
    },
    {
        date: '2026-06-04',
        category: 'Supplies',
        description: 'Office supplies and paper',
        amount: 85,
        method: 'Credit Card',
        receipt: 'receipt-003.pdf'
    },
    {
        date: '2026-06-01',
        category: 'Salaries',
        description: 'Staff salaries for June',
        amount: 3500,
        method: 'Bank Transfer',
        receipt: 'payroll-june.pdf'
    }
];

// Initialize finance page
document.addEventListener('DOMContentLoaded', function() {
    loadFinanceStats();
    renderDonationsTable();
    renderExpensesTable();
    initializeTransactionForm();
});

// Load finance statistics
function loadFinanceStats() {
    const totalIncome = sampleDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = sampleExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    const savings = 15000; // Sample savings amount
    
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('netBalance').textContent = formatCurrency(netBalance);
    document.getElementById('savings').textContent = formatCurrency(savings);
}

// Render donations table
function renderDonationsTable() {
    const tbody = document.getElementById('donationsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleDonations.map(donation => `
        <tr>
            <td>${formatDate(donation.date)}</td>
            <td>${donation.donor}</td>
            <td><strong>${formatCurrency(donation.amount)}</strong></td>
            <td><span class="badge badge-primary">${donation.type}</span></td>
            <td>${donation.method}</td>
            <td>${donation.purpose}</td>
            <td class="table-actions">
                <button class="action-btn" onclick="viewDonation('${donation.date}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="editDonation('${donation.date}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteDonation('${donation.date}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Render expenses table
function renderExpensesTable() {
    const tbody = document.getElementById('expensesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleExpenses.map(expense => `
        <tr>
            <td>${formatDate(expense.date)}</td>
            <td><span class="badge badge-info">${expense.category}</span></td>
            <td>${expense.description}</td>
            <td><strong>${formatCurrency(expense.amount)}</strong></td>
            <td>${expense.method}</td>
            <td><a href="#" onclick="viewReceipt('${expense.receipt}'); return false;">
                <i class="fas fa-file-pdf"></i> View
            </a></td>
            <td class="table-actions">
                <button class="action-btn" onclick="editExpense('${expense.date}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteExpense('${expense.date}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Initialize transaction form
function initializeTransactionForm() {
    const form = document.getElementById('transactionForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const transactionType = document.getElementById('transactionType').value;
        const date = document.getElementById('transactionDate').value;
        const amount = document.getElementById('transactionAmount').value;
        const category = document.getElementById('transactionCategory').value;
        const description = document.getElementById('transactionDescription').value;
        const method = document.getElementById('transactionMethod').value;
        
        console.log('New transaction:', { transactionType, date, amount, category, description, method });
        
        alert(`Transaction added successfully!\n\nType: ${transactionType}\nAmount: $${amount}\nDate: ${date}`);
        
        closeModal('transactionModal');
        form.reset();
        
        // Refresh tables
        if (transactionType === 'income') {
            renderDonationsTable();
        } else {
            renderExpensesTable();
        }
        
        loadFinanceStats();
    });
    
    // Update category options based on transaction type
    const typeSelect = document.getElementById('transactionType');
    const categorySelect = document.getElementById('transactionCategory');
    
    typeSelect.addEventListener('change', function() {
        const type = this.value;
        let options = '';
        
        if (type === 'income') {
            options = `
                <option value="">Select category</option>
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="special">Special Offering</option>
                <option value="donation">Donation</option>
                <option value="building">Building Fund</option>
                <option value="missions">Missions</option>
            `;
        } else if (type === 'expense') {
            options = `
                <option value="">Select category</option>
                <option value="utilities">Utilities</option>
                <option value="maintenance">Maintenance</option>
                <option value="salaries">Salaries</option>
                <option value="supplies">Supplies</option>
                <option value="outreach">Outreach</option>
                <option value="rent">Rent/Mortgage</option>
                <option value="other">Other</option>
            `;
        }
        
        categorySelect.innerHTML = options;
    });
}

// Filter functions
function filterDonations() {
    const filter = document.getElementById('donationFilter').value;
    console.log('Filtering donations:', filter);
    // Implement actual filtering logic
    alert(`Filtering donations by: ${filter}`);
}

function filterExpenses() {
    const filter = document.getElementById('expenseFilter').value;
    console.log('Filtering expenses:', filter);
    // Implement actual filtering logic
    alert(`Filtering expenses by: ${filter}`);
}

// Action functions
function viewDonation(date) {
    const donation = sampleDonations.find(d => d.date === date);
    if (donation) {
        alert(`Donation Details:\n\nDate: ${formatDate(donation.date)}\nDonor: ${donation.donor}\nAmount: ${formatCurrency(donation.amount)}\nType: ${donation.type}\nMethod: ${donation.method}\nPurpose: ${donation.purpose}`);
    }
}

function editDonation(date) {
    alert(`Edit donation from ${date}\n\nThis will open the edit form.`);
}

function deleteDonation(date) {
    if (confirm(`Are you sure you want to delete this donation from ${date}?`)) {
        alert('Donation deleted successfully!');
        renderDonationsTable();
    }
}

function editExpense(date) {
    alert(`Edit expense from ${date}\n\nThis will open the edit form.`);
}

function deleteExpense(date) {
    if (confirm(`Are you sure you want to delete this expense from ${date}?`)) {
        alert('Expense deleted successfully!');
        renderExpensesTable();
    }
}

function viewReceipt(filename) {
    alert(`Opening receipt: ${filename}\n\nIn production, this will open the actual receipt file.`);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}
