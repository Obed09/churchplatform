// ============================================
// AUTHORIZED USERS ADMIN PAGE
// ============================================

let _allAuthorizedUsers = [];

document.addEventListener('DOMContentLoaded', async function() {
    await loadAuthorizedUsers();
    initializeAuthorizedUserForm();
});

async function loadAuthorizedUsers() {
    const tbody = document.getElementById('authorizedUsersTableBody');
    if (!tbody) return;

    try {
        const rows = await getAuthorizedUsers();
        _allAuthorizedUsers = rows.map(convertAuthorizedUserFromDB);
        renderAuthorizedUsersTable(_allAuthorizedUsers);
        renderAuthorizedUserStats(_allAuthorizedUsers);
    } catch (error) {
        console.error('Error loading authorized users:', error);
        showNotification('Failed to load authorized users. Run database/auth-users.sql in Supabase first.', 'error');
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#e53e3e;">Unable to load authorized users. Check table setup and permissions.</td></tr>`;
    }
}

function renderAuthorizedUsersTable(users) {
    const tbody = document.getElementById('authorizedUsersTableBody');
    if (!tbody) return;

    if (!users.length) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#718096;">No authorized users yet. Click "Add Authorized User" to create the first account.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(user => {
        const deptText = user.department === 'all' ? 'All Departments' : capitalize(user.department);
        const statusClass = user.isActive ? 'success' : 'secondary';
        const levelClass = user.accessLevel === 'super_admin' ? 'danger' : user.accessLevel === 'manager' ? 'warning' : 'info';

        return `
            <tr>
                <td><strong>${escapeHtml(user.username)}</strong></td>
                <td>${escapeHtml(user.fullName)}</td>
                <td>
                    <div>${escapeHtml(user.role)}</div>
                    <small style="color:#718096;">${escapeHtml(deptText)}</small>
                </td>
                <td><span class="badge badge-${levelClass}">${escapeHtml(user.accessLevel.replace('_', ' '))}</span></td>
                <td><span class="badge badge-${statusClass}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>${user.lastLogin ? formatDateTime(user.lastLogin) : '-'}</td>
                <td>${formatDate(user.createdAt)}</td>
                <td class="table-actions">
                    <button class="action-btn" onclick="editAuthorizedUser('${user.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="confirmDeleteAuthorizedUser('${user.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    }).join('');
}

function renderAuthorizedUserStats(users) {
    const within7Days = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentLogins = users.filter(u => u.lastLogin && new Date(u.lastLogin).getTime() >= within7Days).length;

    document.getElementById('authTotalUsers').textContent = users.length;
    document.getElementById('authActiveUsers').textContent = users.filter(u => u.isActive).length;
    document.getElementById('authSuperAdmins').textContent = users.filter(u => u.accessLevel === 'super_admin').length;
    document.getElementById('authRecentLogins').textContent = recentLogins;
}

function filterAuthorizedUsers() {
    const search = (document.getElementById('authUserSearch').value || '').toLowerCase().trim();
    const status = document.getElementById('authUserStatusFilter').value;
    const dept = document.getElementById('authUserDeptFilter').value;

    const filtered = _allAuthorizedUsers.filter(user => {
        const hay = `${user.username} ${user.fullName} ${user.role} ${user.department} ${user.accessLevel}`.toLowerCase();
        const matchesSearch = !search || hay.includes(search);
        const matchesStatus = status === 'all' || (status === 'active' ? user.isActive : !user.isActive);
        const matchesDept = dept === 'all' || (dept === 'all_depts' ? user.department === 'all' : user.department === dept);
        return matchesSearch && matchesStatus && matchesDept;
    });

    renderAuthorizedUsersTable(filtered);
}

function openAuthorizedUserModal() {
    const form = document.getElementById('authorizedUserForm');
    form.reset();
    delete form.dataset.editId;
    document.getElementById('authorizedUserModalTitle').textContent = 'Add Authorized User';
    document.getElementById('authorizedUserSubmitText').textContent = 'Save User';
    document.getElementById('authIsActive').checked = true;
    document.getElementById('authPassword').required = true;
    openModal('authorizedUserModal');
}

function initializeAuthorizedUserForm() {
    const form = document.getElementById('authorizedUserForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const editId = form.dataset.editId;
        const user = {
            id: editId || undefined,
            username: (document.getElementById('authUsername').value || '').trim().toLowerCase(),
            password: document.getElementById('authPassword').value,
            fullName: (document.getElementById('authFullName').value || '').trim(),
            role: (document.getElementById('authRole').value || '').trim(),
            department: document.getElementById('authDepartment').value,
            accessLevel: document.getElementById('authAccessLevel').value,
            isActive: document.getElementById('authIsActive').checked
        };

        if (!editId && !user.password) {
            showNotification('Password is required for new users', 'warning');
            return;
        }

        try {
            await saveAuthorizedUser(user);
            showNotification(`Authorized user ${editId ? 'updated' : 'created'} successfully!`, 'success');
            closeModal('authorizedUserModal');
            await loadAuthorizedUsers();
        } catch (error) {
            console.error('Error saving authorized user:', error);
            showNotification(error.message || 'Failed to save authorized user', 'error');
        }
    });
}

function editAuthorizedUser(id) {
    const user = _allAuthorizedUsers.find(x => x.id === id);
    if (!user) {
        showNotification('User not found', 'warning');
        return;
    }

    document.getElementById('authUsername').value = user.username;
    document.getElementById('authFullName').value = user.fullName;
    document.getElementById('authRole').value = user.role;
    document.getElementById('authDepartment').value = user.department;
    document.getElementById('authAccessLevel').value = user.accessLevel;
    document.getElementById('authIsActive').checked = !!user.isActive;
    document.getElementById('authPassword').value = '';
    document.getElementById('authPassword').required = false;

    const form = document.getElementById('authorizedUserForm');
    form.dataset.editId = id;

    document.getElementById('authorizedUserModalTitle').textContent = 'Edit Authorized User';
    document.getElementById('authorizedUserSubmitText').textContent = 'Update User';
    openModal('authorizedUserModal');
}

async function confirmDeleteAuthorizedUser(id) {
    const user = _allAuthorizedUsers.find(x => x.id === id);
    if (!user) return;

    if (!confirm(`Delete authorized user "${user.username}"?`)) return;

    try {
        await deleteAuthorizedUser(id);
        showNotification('Authorized user deleted successfully', 'success');
        await loadAuthorizedUsers();
    } catch (error) {
        console.error('Error deleting authorized user:', error);
        showNotification('Failed to delete authorized user', 'error');
    }
}

function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function capitalize(value) {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

window.openAuthorizedUserModal = openAuthorizedUserModal;
window.filterAuthorizedUsers = filterAuthorizedUsers;
window.editAuthorizedUser = editAuthorizedUser;
window.confirmDeleteAuthorizedUser = confirmDeleteAuthorizedUser;
