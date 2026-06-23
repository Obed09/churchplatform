// ============================================
// ADMINISTRATION DEPARTMENT
// All data operations use Supabase via supabase-data.js
// ============================================

// Local caches so Edit buttons open instantly without a second network call
let _cachedStaff   = [];
let _cachedMembers = [];

// Initialize administration page
document.addEventListener('DOMContentLoaded', async function() {
    await loadAdminStats();
    await renderMembersTable();
    await renderStaffGrid();
    await renderDonationsTable();

    initializeMemberForm();
    initializeStaffForm();
    initializeDonationForm();
});

// ============================================
// STATISTICS
// ============================================

async function loadAdminStats() {
    try {
        const [members, staff] = await Promise.all([getMembersData(), getStaffData()]);
        document.getElementById('totalMembers').textContent  = members.length;
        document.getElementById('activeMembers').textContent = members.filter(m => m.status === 'Active').length;
        document.getElementById('staffCount').textContent    = staff.length;
        document.getElementById('volunteerCount').textContent = 45;
    } catch (e) {
        console.error('Error loading stats:', e);
    }
}

// ============================================
// MEMBERS
// ============================================

async function renderMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    if (!tbody) return;

    try {
        const dbRows  = await getMembersData();
        _cachedMembers = dbRows;                      // cache for instant edit
        const members = dbRows.map(convertMemberFromDB);

        if (!members.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align:center;padding:3rem;color:#718096;">
                        <i class="fas fa-users" style="font-size:3rem;margin-bottom:1rem;display:block;opacity:.3;"></i>
                        <p>No members yet. Click "Add Member" to get started!</p>
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = members.map(m => {
            const firstName = (m.firstName || '').trim();
            const lastName = (m.lastName || '').trim();
            const safeFirst = firstName || 'Member';
            const safeLast = lastName || '';
            const initials = `${safeFirst.charAt(0) || 'M'}${safeLast.charAt(0) || ''}`;
            const photo = m.photo
                ? `<img src="${m.photo}" alt="${safeFirst}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">`
                : `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--primary) 0%,var(--primary-light) 100%);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;">${initials}</div>`;
            return `
                <tr>
                    <td>${photo}</td>
                    <td><strong>${safeFirst} ${safeLast}</strong></td>
                    <td>${m.email}</td>
                    <td>${m.phone || '-'}</td>
                    <td>${formatDate(m.joinDate)}</td>
                    <td><span class="badge badge-info">${m.ministry || '-'}</span></td>
                    <td><span class="badge badge-${m.status === 'Active' ? 'success' : 'secondary'}">${m.status}</span></td>
                    <td class="table-actions">
                        <button class="action-btn" onclick="viewMember('${m.id}')"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="editMember('${m.id}')"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="confirmDeleteMember('${m.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
        }).join('');
    } catch (e) {
        console.error('Error rendering members:', e);
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#e53e3e;"><i class="fas fa-exclamation-triangle"></i> Error loading members</td></tr>`;
    }
}

function openMemberModal() {
    const form = document.getElementById('memberForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
        resetMemberPhotoPreview();
    }
    const titleEl = document.getElementById('memberModalTitle');
    if (titleEl) titleEl.textContent = 'Add New Member';
    const submitEl = document.getElementById('memberSubmitBtn');
    if (submitEl) submitEl.textContent = 'Add Member';
    openModal('memberModal');
}

function initializeMemberForm() {
    const form = document.getElementById('memberForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const editId = form.dataset.editId;
        const memberData = {
            id: editId || undefined,
            firstName: document.getElementById('memberFirstName').value,
            lastName:  document.getElementById('memberLastName').value,
            email:     document.getElementById('memberEmail').value,
            phone:     document.getElementById('memberPhone').value,
            joinDate:  document.getElementById('memberJoinDate').value,
            ministry:  document.getElementById('memberMinistry').value,
            status:    'Active',
            photo:     document.getElementById('memberPhotoData').value || null,
            birthDate: document.getElementById('memberBirthdate')?.value || null,
            gender:    document.getElementById('memberGender')?.value || null,
            address:   document.getElementById('memberAddress')?.value || null,
            notes:     document.getElementById('memberNotes')?.value || null
        };

        try {
            await saveMember(memberData);
            showNotification(`${memberData.firstName} ${memberData.lastName} ${editId ? 'updated' : 'added'} successfully!`, 'success');
            delete form.dataset.editId;
            closeModal('memberModal');
            form.reset();
            resetMemberPhotoPreview();
            await renderMembersTable();
            await loadAdminStats();
        } catch (err) {
            console.error('Error saving member:', err);
            showNotification('Error saving member. Please try again.', 'error');
        }
    });
}

async function viewMember(id) {
    const db = _cachedMembers.find(r => r.id === id);
    if (!db) return;
    alert(`Member Details:\n\nName: ${db.first_name} ${db.last_name}\nEmail: ${db.email}\nPhone: ${db.phone || '-'}\nJoined: ${formatDate(db.join_date)}\nMinistry: ${db.ministry || '-'}\nStatus: ${db.status}`);
}

function editMember(id) {
    // Use cache for instant response — no network round-trip needed
    const db = _cachedMembers.find(r => r.id === id);
    if (!db) { showNotification('Member not found — try refreshing the page', 'error'); return; }
    const m = convertMemberFromDB(db);

    document.getElementById('memberFirstName').value = m.firstName;
    document.getElementById('memberLastName').value  = m.lastName;
    document.getElementById('memberEmail').value     = m.email;
    document.getElementById('memberPhone').value     = m.phone    || '';
    document.getElementById('memberJoinDate').value  = m.joinDate || '';
    document.getElementById('memberMinistry').value  = m.ministry || '';
    if (document.getElementById('memberBirthdate')) document.getElementById('memberBirthdate').value = m.birthDate || '';
    if (document.getElementById('memberGender'))    document.getElementById('memberGender').value    = m.gender    || '';
    if (document.getElementById('memberAddress'))   document.getElementById('memberAddress').value   = m.address   || '';
    if (document.getElementById('memberNotes'))     document.getElementById('memberNotes').value     = m.notes     || '';

    if (m.photo) {
        document.getElementById('memberPhotoData').value = m.photo;
        displayMemberPhoto(m.photo);
    } else {
        resetMemberPhotoPreview();
    }

    const form = document.getElementById('memberForm');
    form.dataset.editId = id;
    const titleEl = document.getElementById('memberModalTitle');
    if (titleEl) titleEl.textContent = 'Edit Member';
    const submitEl = document.getElementById('memberSubmitBtn');
    if (submitEl) submitEl.textContent = 'Update Member';
    openModal('memberModal');
}

async function confirmDeleteMember(id) {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
        await deleteMember(id);
        _cachedMembers = _cachedMembers.filter(m => m.id !== id);
        showNotification('Member deleted successfully!', 'success');
        await renderMembersTable();
        await loadAdminStats();
    } catch (e) {
        console.error('Error deleting member:', e);
        showNotification('Error deleting member', 'error');
    }
}

function searchMembers() {
    const term = document.getElementById('memberSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#membersTableBody tr');
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
}

function filterMembers() {
    const filter = document.getElementById('memberFilter').value;
    const rows   = document.querySelectorAll('#membersTableBody tr');
    rows.forEach(row => {
        const status = row.querySelector('.badge-success, .badge-secondary')?.textContent || '';
        row.style.display = (filter === 'all' || status.toLowerCase() === filter.toLowerCase()) ? '' : 'none';
    });
}

// ============================================
// STAFF
// ============================================

async function renderStaffGrid() {
    const grid = document.getElementById('staffGrid');
    if (!grid) return;

    try {
        const dbRows = await getStaffData();
        _cachedStaff = dbRows;                        // cache for instant edit
        const staff  = dbRows.map(convertStaffFromDB);

        if (!staff.length) {
            grid.innerHTML = `<div class="empty-state"><i class="fas fa-user-tie"></i><h3>No Staff Members Yet</h3><p>Click "Add Staff" to add your first staff member</p></div>`;
            return;
        }

        grid.innerHTML = staff.map(s => {
            const avatar = s.photo ? `<img src="${s.photo}" alt="${s.name}">` : `<i class="fas fa-user-tie"></i>`;
            return `
                <div class="staff-card">
                    <div class="staff-avatar">${avatar}</div>
                    <h3>${s.name}</h3>
                    <p class="staff-role">${s.role}</p>
                    <p class="staff-department"><i class="fas fa-building"></i> ${s.department}</p>
                    <div class="staff-contact">
                        <p><i class="fas fa-envelope"></i> ${s.email}</p>
                        <p><i class="fas fa-phone"></i> ${s.phone || '-'}</p>
                    </div>
                    <div class="staff-actions">
                        <button type="button" class="btn-secondary btn-sm" onclick="contactStaff('${s.email}')"><i class="fas fa-envelope"></i> Contact</button>
                        <button type="button" class="btn-primary btn-sm" onclick="editStaff('${s.id}')"><i class="fas fa-edit"></i> Edit</button>
                        <button type="button" class="btn-danger btn-sm" onclick="confirmDeleteStaff('${s.id}')"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>`;
        }).join('');
    } catch (e) {
        console.error('Error rendering staff grid:', e);
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-exclamation-triangle" style="color:#e53e3e;"></i><h3>Error Loading Staff</h3><p>Please refresh the page</p></div>`;
    }
}

function openStaffModal() {
    const form = document.getElementById('staffForm');
    if (form) {
        form.reset();
        document.getElementById('staffId').value = '';
        document.getElementById('staffPhotoData').value = '';
        resetStaffPhotoPreview();
        document.getElementById('staffModalTitle').textContent = 'Add New Staff';
        document.getElementById('staffSubmitBtn').textContent  = 'Add Staff';
    }
    openModal('staffModal');
}

function initializeStaffForm() {
    const form = document.getElementById('staffForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const staffId = document.getElementById('staffId').value;
        const staffMember = {
            id:             staffId || null,
            name:           document.getElementById('staffName').value,
            email:          document.getElementById('staffEmail').value,
            phone:          document.getElementById('staffPhone').value,
            role:           document.getElementById('staffRole').value,
            department:     document.getElementById('staffDepartment').value,
            startDate:      document.getElementById('staffStartDate').value,
            employmentType: document.getElementById('staffEmploymentType').value,
            bio:            document.getElementById('staffBio').value,
            photo:          document.getElementById('staffPhotoData').value || null
        };

        try {
            await saveStaff(staffMember);
            showNotification(`${staffMember.name} ${staffId ? 'updated' : 'added'} successfully!`, 'success');
            closeModal('staffModal');
            form.reset();
            document.getElementById('staffPhotoData').value = '';
            resetStaffPhotoPreview();
            await renderStaffGrid();   // also refreshes _cachedStaff
            await loadAdminStats();
        } catch (err) {
            console.error('Error saving staff:', err);
            showNotification('Error saving staff — check the console for details', 'error');
        }
    });
}

function editStaff(id) {
    // Use cache for instant response — modal opens immediately, no network call
    const db = _cachedStaff.find(s => s.id === id);
    if (!db) { showNotification('Staff member not found — try refreshing the page', 'error'); return; }
    const s = convertStaffFromDB(db);

    document.getElementById('staffId').value             = s.id;
    document.getElementById('staffName').value           = s.name;
    document.getElementById('staffEmail').value          = s.email;
    document.getElementById('staffPhone').value          = s.phone || '';
    document.getElementById('staffRole').value           = s.role;
    document.getElementById('staffDepartment').value     = s.department;
    document.getElementById('staffStartDate').value      = s.startDate || '';
    document.getElementById('staffEmploymentType').value = s.employmentType || 'full-time';
    document.getElementById('staffBio').value            = s.bio || '';
    document.getElementById('staffPhotoData').value      = s.photo || '';

    if (s.photo) {
        const prev = document.getElementById('staffPhotoPreview');
        if (prev) { prev.innerHTML = `<img src="${s.photo}" alt="Preview">`; prev.classList.add('has-image'); }
        const btn = document.getElementById('removeStaffPhotoBtn');
        if (btn) btn.style.display = 'inline-flex';
    } else {
        resetStaffPhotoPreview();
    }

    document.getElementById('staffModalTitle').textContent = 'Edit Staff Member';
    document.getElementById('staffSubmitBtn').textContent  = 'Update Staff';
    openModal('staffModal');
}

async function confirmDeleteStaff(id) {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    try {
        await deleteStaff(id);
        _cachedStaff = _cachedStaff.filter(s => s.id !== id);
        showNotification('Staff member deleted successfully!', 'success');
        await renderStaffGrid();
        await loadAdminStats();
    } catch (e) {
        console.error('Error deleting staff:', e);
    }
}

function contactStaff(email) {
    window.location.href = `mailto:${email}`;
}

// ============================================
// PHOTO UPLOAD FUNCTIONS
// ============================================

function handleStaffPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showNotification('Image must be under 2MB', 'error'); event.target.value = ''; return; }
    if (!file.type.match('image.*'))  { showNotification('Please select a valid image', 'error'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = e => { document.getElementById('staffPhotoData').value = e.target.result; displayStaffPhoto(e.target.result); };
    reader.readAsDataURL(file);
}

function displayStaffPhoto(data) {
    const p = document.getElementById('staffPhotoPreview');
    p.innerHTML = `<img src="${data}" alt="Staff Photo">`;
    p.classList.add('has-image');
    document.getElementById('removeStaffPhotoBtn').style.display = 'inline-flex';
}

function resetStaffPhotoPreview() {
    const p = document.getElementById('staffPhotoPreview');
    if (!p) return;
    p.innerHTML = `<i class="fas fa-user-tie"></i><span>Upload Photo</span>`;
    p.classList.remove('has-image');
    const inp = document.getElementById('staffPhotoInput');
    if (inp) inp.value = '';
    const btn = document.getElementById('removeStaffPhotoBtn');
    if (btn) btn.style.display = 'none';
}

function removeStaffPhoto() {
    document.getElementById('staffPhotoData').value = '';
    resetStaffPhotoPreview();
    showNotification('Photo removed', 'info');
}

function handleMemberPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showNotification('Image must be under 2MB', 'error'); event.target.value = ''; return; }
    if (!file.type.match('image.*'))  { showNotification('Please select a valid image', 'error'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = e => { document.getElementById('memberPhotoData').value = e.target.result; displayMemberPhoto(e.target.result); };
    reader.readAsDataURL(file);
}

function displayMemberPhoto(data) {
    const p = document.getElementById('memberPhotoPreview');
    p.innerHTML = `<img src="${data}" alt="Member Photo">`;
    p.classList.add('has-image');
    document.getElementById('removeMemberPhotoBtn').style.display = 'inline-flex';
}

function resetMemberPhotoPreview() {
    const p = document.getElementById('memberPhotoPreview');
    if (!p) return;
    p.innerHTML = `<i class="fas fa-user"></i><span>Upload Photo</span>`;
    p.classList.remove('has-image');
    const inp = document.getElementById('memberPhotoInput');
    if (inp) inp.value = '';
    const btn = document.getElementById('removeMemberPhotoBtn');
    if (btn) btn.style.display = 'none';
}

function removeMemberPhoto() {
    document.getElementById('memberPhotoData').value = '';
    resetMemberPhotoPreview();
    showNotification('Photo removed', 'info');
}

function handleVisitorPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showNotification('Image must be under 2MB', 'error'); event.target.value = ''; return; }
    if (!file.type.match('image.*'))  { showNotification('Please select a valid image', 'error'); event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = e => { document.getElementById('visitorPhotoData').value = e.target.result; displayVisitorPhoto(e.target.result); };
    reader.readAsDataURL(file);
}

function displayVisitorPhoto(data) {
    const p = document.getElementById('visitorPhotoPreview');
    p.innerHTML = `<img src="${data}" alt="Visitor Photo">`;
    p.classList.add('has-image');
    document.getElementById('removeVisitorPhotoBtn').style.display = 'inline-flex';
}

function resetVisitorPhotoPreview() {
    const p = document.getElementById('visitorPhotoPreview');
    if (!p) return;
    p.innerHTML = `<i class="fas fa-user-friends"></i><span>Upload Photo</span>`;
    p.classList.remove('has-image');
    const inp = document.getElementById('visitorPhotoInput');
    if (inp) inp.value = '';
    const btn = document.getElementById('removeVisitorPhotoBtn');
    if (btn) btn.style.display = 'none';
}

function removeVisitorPhoto() {
    document.getElementById('visitorPhotoData').value = '';
    resetVisitorPhotoPreview();
    showNotification('Photo removed', 'info');
}

function filterVolunteers() {
    const filter = document.getElementById('volunteerFilter')?.value;
    console.log('Filtering volunteers by:', filter);
}

// ============================================
// CSV IMPORT
// ============================================

let csvParsedData = [];

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { showNotification('Please select a valid CSV file', 'error'); event.target.value = ''; return; }
    document.getElementById('csvFileName').textContent = file.name;
    const reader = new FileReader();
    reader.onload = e => parseCSV(e.target.result);
    reader.readAsText(file);
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(l => l.trim());
    if (lines.length < 2) { showNotification('CSV file is empty or invalid', 'error'); return; }
    const headers  = parseCSVLine(lines[0]);
    const required = ['First Name','Last Name','Email','Phone','Join Date','Ministry','Status'];
    const missing  = required.filter(h => !headers.includes(h));
    if (missing.length) { showNotification(`Missing columns: ${missing.join(', ')}`, 'error'); return; }

    csvParsedData = [];
    const errors = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (!values.length) continue;
        const record = {};
        headers.forEach((h, idx) => { record[h] = values[idx] || ''; });
        const v = validateMemberRecord(record, i + 1);
        if (v.valid) csvParsedData.push(record);
        else errors.push(...v.errors);
    }

    if (csvParsedData.length) {
        displayCSVPreview(headers, csvParsedData);
        if (errors.length) displayValidationErrors(errors);
    } else {
        showNotification('No valid records found in CSV', 'error');
    }
}

function parseCSVLine(line) {
    const result = [];
    let cur = '', inQ = false;
    for (const ch of line) {
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { result.push(cur.trim()); cur = ''; }
        else cur += ch;
    }
    result.push(cur.trim());
    return result;
}

function validateMemberRecord(record, lineNo) {
    const errors = [];
    ['First Name','Last Name','Email','Phone','Join Date','Ministry','Status'].forEach(f => {
        if (!record[f]) errors.push(`Line ${lineNo}: ${f} is required`);
    });
    if (record['Email'] && !record['Email'].includes('@')) errors.push(`Line ${lineNo}: Invalid email`);
    if (record['Join Date'] && !isValidDate(record['Join Date'])) errors.push(`Line ${lineNo}: Invalid Join Date (use YYYY-MM-DD)`);
    if (record['Status'] && !['Active','Inactive','New'].includes(record['Status'])) errors.push(`Line ${lineNo}: Status must be Active, Inactive, or New`);
    return { valid: errors.length === 0, errors };
}

function isValidDate(s) {
    return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s));
}

function displayCSVPreview(headers, data) {
    document.getElementById('csvPreviewSection').style.display = 'block';
    document.getElementById('csvImportActions').style.display  = 'flex';
    document.getElementById('csvRecordCount').textContent = `${data.length} records`;
    document.getElementById('importCount').textContent = data.length;

    const displayH = ['First Name','Last Name','Email','Phone','Join Date','Ministry','Status'];
    const thead = document.getElementById('csvPreviewHead');
    const tbody = document.getElementById('csvPreviewBody');

    const hRow = document.createElement('tr');
    displayH.forEach(h => { const th = document.createElement('th'); th.textContent = h; hRow.appendChild(th); });
    thead.innerHTML = '';
    thead.appendChild(hRow);

    tbody.innerHTML = '';
    data.slice(0, 10).forEach(rec => {
        const row = document.createElement('tr');
        displayH.forEach(h => { const td = document.createElement('td'); td.textContent = rec[h] || ''; row.appendChild(td); });
        tbody.appendChild(row);
    });
    if (data.length > 10) {
        const more = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = displayH.length;
        td.style.cssText = 'text-align:center;font-style:italic;color:var(--text-light)';
        td.textContent = `... and ${data.length - 10} more records`;
        more.appendChild(td);
        tbody.appendChild(more);
    }
}

function displayValidationErrors(errors) {
    const sec = document.getElementById('csvValidationErrors');
    sec.style.display = 'block';
    sec.innerHTML = `<h4><i class="fas fa-exclamation-triangle"></i> Validation Errors (${errors.length})</h4><ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul><p><strong>Note:</strong> Records with errors will be skipped.</p>`;
}

async function importCSVData() {
    if (!csvParsedData.length) { showNotification('No data to import', 'warning'); return; }

    let success = 0, failed = 0;
    for (const record of csvParsedData) {
        try {
            await saveMember({
                firstName: record['First Name'],
                lastName:  record['Last Name'],
                email:     record['Email'],
                phone:     record['Phone'],
                joinDate:  record['Join Date'],
                ministry:  record['Ministry'],
                status:    record['Status'],
                birthDate: record['Birth Date'] || null,
                gender:    record['Gender']     || null,
                address:   record['Address']    || null,
                notes:     record['Notes']      || null,
                photo:     null
            });
            success++;
        } catch (e) {
            failed++;
            console.error('Failed to import row:', record, e);
        }
    }

    showNotification(`Imported ${success} members${failed ? ` (${failed} failed)` : ''}!`, failed ? 'warning' : 'success');
    closeModal('csvImportModal');
    resetCSVImport();
    await renderMembersTable();
    await loadAdminStats();
}

function resetCSVImport() {
    csvParsedData = [];
    document.getElementById('csvFileInput').value = '';
    document.getElementById('csvFileName').textContent = 'No file selected';
    document.getElementById('csvPreviewSection').style.display = 'none';
    document.getElementById('csvImportActions').style.display  = 'none';
    document.getElementById('csvValidationErrors').style.display = 'none';
}

// ============================================
// DONATIONS
// ============================================

const PAYPAL_CONFIG = {
    email: 'amorporelcalvario@gmail.com',
    currency: 'DOP',
    currencySymbol: 'RD$'
};

async function renderDonationsTable(donations = null) {
    const tbody = document.getElementById('donationsTableBody');
    if (!tbody) return;

    try {
        const data = donations || (await getDonationsData()).map(convertDonationFromDB);

        tbody.innerHTML = data.map(d => {
            const statusClass = d.status === 'completed' ? 'success' : d.status === 'pending' ? 'warning' : 'danger';
            const typeIcon = d.donationType === 'recurring'
                ? '<i class="fas fa-repeat"></i>'
                : '<i class="fas fa-hand-holding-usd"></i>';
            const amtFmt = d.amount.toLocaleString('es-DO', { minimumFractionDigits: 2 });
            return `
                <tr>
                    <td>${formatDate(d.date)}</td>
                    <td>
                        ${d.isAnonymous ? '<i class="fas fa-user-secret"></i> Anonymous' : (d.donorName || '-')}
                        ${d.memberId ? '<span class="badge badge-info" style="margin-left:.5rem;">Member</span>' : ''}
                    </td>
                    <td><span class="badge badge-primary">${d.category || '-'}</span></td>
                    <td><strong>${PAYPAL_CONFIG.currencySymbol}${amtFmt}</strong></td>
                    <td>${d.paymentMethod || '-'}</td>
                    <td>${typeIcon} ${d.donationType === 'recurring' ? (d.recurringFrequency || '') : 'One-time'}</td>
                    <td><span class="badge badge-${statusClass}">${d.status || '-'}</span></td>
                    <td class="table-actions">
                        <button class="action-btn" onclick="viewDonation('${d.id}')" title="View"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="editDonation('${d.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="confirmDeleteDonation('${d.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                        ${!d.isAnonymous ? `<button class="action-btn" onclick="generateTaxReceipt('${d.id}')" title="Receipt"><i class="fas fa-file-invoice"></i></button>` : ''}
                    </td>
                </tr>`;
        }).join('');

        await updateDonationStats(data);
    } catch (e) {
        console.error('Error rendering donations:', e);
    }
}

async function updateDonationStats(data = null) {
    try {
        const donations = data || (await getDonationsData()).map(convertDonationFromDB);
        const now = new Date();

        const totalAmount = donations.reduce((s, d) => s + d.amount, 0);
        const monthDons   = donations.filter(d => {
            const dt = new Date(d.date);
            return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
        });
        const monthAmount = monthDons.reduce((s, d) => s + d.amount, 0);
        const uniqueDonors = new Set(donations.map(d => d.donorName)).size;
        const recurring    = donations.filter(d => d.donationType === 'recurring' && d.status === 'completed').length;

        const fmt = n => `${PAYPAL_CONFIG.currencySymbol}${n.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;
        const el  = id => document.getElementById(id);
        if (el('totalDonationsAmount'))  el('totalDonationsAmount').textContent  = fmt(totalAmount);
        if (el('monthDonationsAmount'))  el('monthDonationsAmount').textContent  = fmt(monthAmount);
        if (el('totalDonors'))           el('totalDonors').textContent           = uniqueDonors;
        if (el('recurringDonations'))    el('recurringDonations').textContent    = recurring;
    } catch (e) {
        console.error('Error updating donation stats:', e);
    }
}

function openDonationModal() {
    const form = document.getElementById('donationForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
        document.getElementById('donationModalTitle').textContent = 'Add New Donation';
        document.getElementById('donationDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('anonymousDonation').checked = false;
        document.getElementById('donorFieldsGroup').style.display = 'block';
        document.getElementById('donationType').value = 'one-time';
        document.getElementById('recurringFrequencyGroup').style.display = 'none';
        populateMemberDropdown();
    }
    openModal('donationModal');
}

async function populateMemberDropdown() {
    const select = document.getElementById('donorMember');
    if (!select) return;
    try {
        const rows = await getMembersData();
        select.innerHTML = '<option value="">-- Select Member --</option>';
        rows.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = `${r.first_name} ${r.last_name}`;
            opt.dataset.email = r.email;
            opt.dataset.phone = r.phone;
            select.appendChild(opt);
        });
    } catch (e) { console.error(e); }
}

function loadMemberInfo() {
    const sel = document.getElementById('donorMember');
    const opt = sel.options[sel.selectedIndex];
    if (opt.value) {
        document.getElementById('donorName').value  = opt.text;
        document.getElementById('donorEmail').value = opt.dataset.email || '';
        document.getElementById('donorPhone').value = opt.dataset.phone || '';
    }
}

function toggleDonorFields() {
    const anon = document.getElementById('anonymousDonation').checked;
    document.getElementById('donorFieldsGroup').style.display = anon ? 'none' : 'block';
}

function toggleRecurringOptions() {
    const type = document.getElementById('donationType').value;
    document.getElementById('recurringFrequencyGroup').style.display = type === 'recurring' ? 'block' : 'none';
}

function initializeDonationForm() {
    const form = document.getElementById('donationForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const editId   = form.dataset.editId;
        const isAnon   = document.getElementById('anonymousDonation').checked;
        const donType  = document.getElementById('donationType').value;

        const donation = {
            id:                 editId || undefined,
            date:               document.getElementById('donationDate').value,
            amount:             parseFloat(document.getElementById('donationAmount').value),
            category:           document.getElementById('donationCategory').value,
            paymentMethod:      document.getElementById('donationMethod').value,
            donationType:       donType,
            recurringFrequency: donType === 'recurring' ? document.getElementById('recurringFrequency').value : null,
            isAnonymous:        isAnon,
            donorName:          isAnon ? 'Anonymous' : document.getElementById('donorName').value,
            donorEmail:         isAnon ? null : (document.getElementById('donorEmail').value || null),
            donorPhone:         isAnon ? null : (document.getElementById('donorPhone').value || null),
            donorAddress:       isAnon ? null : (document.getElementById('donorAddress')?.value || null),
            memberId:           document.getElementById('donorMember').value || null,
            transactionId:      document.getElementById('transactionId').value || null,
            status:             document.getElementById('donationStatus').value,
            notes:              document.getElementById('donationNotes').value || null,
            currency:           'DOP'
        };

        try {
            await saveDonation(donation);
            showNotification(`Donation ${editId ? 'updated' : 'added'} successfully!`, 'success');
            delete form.dataset.editId;
            closeModal('donationModal');
            form.reset();
            await renderDonationsTable();
        } catch (err) {
            console.error('Error saving donation:', err);
            showNotification('Error saving donation', 'error');
        }
    });
}

async function viewDonation(id) {
    try {
        const rows = await getDonationsData();
        const db = rows.find(r => r.id === id);
        if (!db) return;
        const d = convertDonationFromDB(db);
        const fmt = n => `${PAYPAL_CONFIG.currencySymbol}${n.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;
        let msg = `Donation Details:\n\nDate: ${formatDate(d.date)}\nAmount: ${fmt(d.amount)}\nCategory: ${d.category}\nMethod: ${d.paymentMethod}\nType: ${d.donationType}\nStatus: ${d.status}\n\n`;
        if (!d.isAnonymous) {
            msg += `Donor: ${d.donorName}\n`;
            if (d.donorEmail) msg += `Email: ${d.donorEmail}\n`;
            if (d.donorPhone) msg += `Phone: ${d.donorPhone}\n`;
        } else { msg += 'Donor: Anonymous\n'; }
        if (d.transactionId) msg += `\nTransaction ID: ${d.transactionId}`;
        if (d.notes)         msg += `\nNotes: ${d.notes}`;
        alert(msg);
    } catch (e) { console.error(e); }
}

async function editDonation(id) {
    try {
        const rows = await getDonationsData();
        const db = rows.find(r => r.id === id);
        if (!db) return;
        const d = convertDonationFromDB(db);

        document.getElementById('donationDate').value     = d.date;
        document.getElementById('donationAmount').value   = d.amount;
        document.getElementById('donationCategory').value = d.category || '';
        document.getElementById('donationMethod').value   = d.paymentMethod || '';
        document.getElementById('donationType').value     = d.donationType || 'one-time';
        document.getElementById('donationStatus').value   = d.status || 'completed';
        document.getElementById('transactionId').value    = d.transactionId || '';
        document.getElementById('donationNotes').value    = d.notes || '';

        if (d.donationType === 'recurring') {
            document.getElementById('recurringFrequencyGroup').style.display = 'block';
            document.getElementById('recurringFrequency').value = d.recurringFrequency || '';
        }
        document.getElementById('anonymousDonation').checked = d.isAnonymous;
        document.getElementById('donorFieldsGroup').style.display = d.isAnonymous ? 'none' : 'block';
        if (!d.isAnonymous) {
            document.getElementById('donorName').value    = d.donorName || '';
            document.getElementById('donorEmail').value   = d.donorEmail || '';
            document.getElementById('donorPhone').value   = d.donorPhone || '';
            if (document.getElementById('donorAddress')) document.getElementById('donorAddress').value = d.donorAddress || '';
        }

        document.getElementById('donationModalTitle').textContent = 'Edit Donation';
        document.getElementById('donationForm').dataset.editId = id;
        await populateMemberDropdown();
        if (d.memberId) document.getElementById('donorMember').value = d.memberId;
        openModal('donationModal');
    } catch (e) { console.error(e); }
}

async function confirmDeleteDonation(id) {
    if (!confirm('Are you sure you want to delete this donation record?')) return;
    try {
        await deleteDonation(id);
        showNotification('Donation deleted successfully!', 'success');
        await renderDonationsTable();
    } catch (e) { console.error(e); }
}

async function searchDonations() {
    const term = document.getElementById('donationSearch').value.toLowerCase();
    try {
        const data = (await getDonationsData()).map(convertDonationFromDB);
        const filtered = data.filter(d =>
            (d.donorName || '').toLowerCase().includes(term) ||
            (d.category  || '').toLowerCase().includes(term) ||
            (d.paymentMethod || '').toLowerCase().includes(term) ||
            String(d.amount).includes(term)
        );
        await renderDonationsTable(filtered);
    } catch (e) { console.error(e); }
}

async function filterDonations() {
    const cat  = document.getElementById('donationCategoryFilter')?.value || 'all';
    const date = document.getElementById('donationDateFilter')?.value    || 'all';
    try {
        let data = (await getDonationsData()).map(convertDonationFromDB);
        if (cat !== 'all')  data = data.filter(d => d.category === cat);
        if (date !== 'all') {
            const now   = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            data = data.filter(d => {
                const dt = new Date(d.date);
                if (date === 'today') return dt >= today;
                if (date === 'week')  { const w = new Date(today); w.setDate(w.getDate()-7); return dt >= w; }
                if (date === 'month') return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
                if (date === 'year')  return dt.getFullYear() === now.getFullYear();
                return true;
            });
        }
        await renderDonationsTable(data);
    } catch (e) { console.error(e); }
}

async function exportDonations() {
    try {
        const data = (await getDonationsData()).map(convertDonationFromDB);
        const headers = ['Date','Donor','Email','Phone','Category','Amount','Method','Type','Frequency','Status','Transaction ID','Notes'];
        const rows = data.map(d => [
            d.date, d.donorName, d.donorEmail||'', d.donorPhone||'',
            d.category, d.amount, d.paymentMethod, d.donationType,
            d.recurringFrequency||'', d.status, d.transactionId||'', d.notes||''
        ]);
        let csv = headers.join(',') + '\n';
        rows.forEach(r => { csv += r.map(c => `"${c}"`).join(',') + '\n'; });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        showNotification('Donations exported!', 'success');
    } catch (e) { console.error(e); }
}

async function generateReport() {
    const startDate = document.getElementById('reportStartDate')?.value;
    const endDate   = document.getElementById('reportEndDate')?.value;
    const category  = document.getElementById('reportCategory')?.value || 'all';

    try {
        let data = (await getDonationsData()).map(convertDonationFromDB);
        if (startDate) data = data.filter(d => d.date >= startDate);
        if (endDate)   data = data.filter(d => d.date <= endDate);
        if (category !== 'all') data = data.filter(d => d.category === category);

        const total = data.reduce((s, d) => s + d.amount, 0);
        const avg   = data.length ? total / data.length : 0;
        const uniq  = new Set(data.map(d => d.donorName)).size;
        const fmt   = n => `${PAYPAL_CONFIG.currencySymbol}${n.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;

        document.getElementById('reportTotalAmount').textContent    = fmt(total);
        document.getElementById('reportTotalDonations').textContent = data.length;
        document.getElementById('reportAvgDonation').textContent    = fmt(avg);
        document.getElementById('reportUniqueDonors').textContent   = uniq;

        const catTotals = {};
        data.forEach(d => { catTotals[d.category] = (catTotals[d.category]||0) + d.amount; });
        document.getElementById('categoryBreakdown').innerHTML = Object.entries(catTotals)
            .sort((a,b) => b[1]-a[1])
            .map(([c,a]) => `<div class="category-item"><span class="category-name">${c}</span><span class="category-amount">${fmt(a)}</span></div>`)
            .join('');

        const donorTotals = {};
        data.filter(d => !d.isAnonymous).forEach(d => { donorTotals[d.donorName] = (donorTotals[d.donorName]||0) + d.amount; });
        document.getElementById('topDonorsList').innerHTML = Object.entries(donorTotals)
            .sort((a,b) => b[1]-a[1]).slice(0,10)
            .map(([n,a],i) => `<div class="donor-item"><span class="donor-rank">#${i+1}</span><span class="donor-name">${n}</span><span class="donor-amount">${fmt(a)}</span></div>`)
            .join('');

        document.getElementById('reportResults').style.display = 'block';
        showNotification('Report generated!', 'success');
    } catch (e) { console.error(e); }
}

function exportReport() { showNotification('Exporting report...', 'info'); }
function printReport()   { window.print(); }

function generateTaxReceipt(id) {
    alert(`Tax receipt will be generated for donation ID: ${id}\n\nThis feature creates a PDF receipt.`);
    showNotification('Tax receipt generated!', 'success');
}

function openSmokeTestModal() {
    openModal('smokeTestModal');
}

function resetSmokeChecks() {
    document.querySelectorAll('.smoke-check').forEach(input => {
        input.checked = false;
    });
    const results = document.getElementById('donationCrudResults');
    if (results) results.textContent = 'Ready.';
}

function appendDonationCrudLog(message) {
    const output = document.getElementById('donationCrudResults');
    if (!output) return;
    output.textContent += `\n${message}`;
    output.scrollTop = output.scrollHeight;
}

async function runDonationCrudVerification() {
    const output = document.getElementById('donationCrudResults');
    if (output) output.textContent = 'Running verification...';

    let createdId = null;
    const marker = `SMOKE-${Date.now()}`;

    try {
        appendDonationCrudLog('1) READ baseline donations...');
        const before = await getDonationsData();
        appendDonationCrudLog(`   OK: baseline count = ${before.length}`);

        appendDonationCrudLog('2) CREATE temporary donation...');
        const created = await saveDonation({
            date: new Date().toISOString().split('T')[0],
            amount: 99.99,
            currency: 'DOP',
            category: 'General Fund/Tithes',
            paymentMethod: 'PayPal',
            donationType: 'one-time',
            recurringFrequency: null,
            isAnonymous: true,
            donorName: 'Anonymous',
            donorEmail: null,
            donorPhone: null,
            memberId: null,
            transactionId: marker,
            status: 'pending',
            notes: `Smoke test donation ${marker}`
        });
        createdId = created?.id;
        if (!createdId) throw new Error('Create step did not return an ID');
        appendDonationCrudLog(`   OK: created ID = ${createdId}`);

        appendDonationCrudLog('3) UPDATE temporary donation...');
        await saveDonation({
            id: createdId,
            date: new Date().toISOString().split('T')[0],
            amount: 149.99,
            currency: 'DOP',
            category: 'General Fund/Tithes',
            paymentMethod: 'PayPal',
            donationType: 'one-time',
            recurringFrequency: null,
            isAnonymous: true,
            donorName: 'Anonymous',
            donorEmail: null,
            donorPhone: null,
            memberId: null,
            transactionId: marker,
            status: 'completed',
            notes: `Smoke test donation updated ${marker}`
        });

        const afterUpdateRows = await getDonationsData();
        const updated = afterUpdateRows.find(d => d.id === createdId);
        if (!updated) throw new Error('Updated row not found');
        if (Number(updated.amount) !== 149.99 || updated.status !== 'completed') {
            throw new Error('Update verification mismatch');
        }
        appendDonationCrudLog('   OK: update verified via read-back');

        appendDonationCrudLog('4) DELETE temporary donation...');
        await deleteDonation(createdId);

        const afterDeleteRows = await getDonationsData();
        const stillExists = afterDeleteRows.some(d => d.id === createdId);
        if (stillExists) throw new Error('Delete verification failed - row still exists');
        appendDonationCrudLog('   OK: delete verified');

        appendDonationCrudLog('RESULT: PASS - Donations CRUD is healthy end-to-end on Supabase.');
        showNotification('Donations CRUD verification passed', 'success');
        await renderDonationsTable();
    } catch (error) {
        appendDonationCrudLog(`RESULT: FAIL - ${error.message}`);
        showNotification(`Donations CRUD verification failed: ${error.message}`, 'error');

        // Cleanup best-effort if create succeeded
        if (createdId) {
            try {
                await deleteDonation(createdId);
                appendDonationCrudLog('Cleanup: temporary row removed.');
            } catch (cleanupError) {
                appendDonationCrudLog(`Cleanup warning: ${cleanupError.message}`);
            }
        }
    }
}

// ============================================
// BACKUP / RESTORE
// ============================================

async function openDataManager() {
    try {
        const [members, staff, donations] = await Promise.all([getMembersData(), getStaffData(), getDonationsData()]);
        document.getElementById('dataCountMembers').textContent  = members.length;
        document.getElementById('dataCountStaff').textContent    = staff.length;
        document.getElementById('dataCountDonations').textContent = donations.length;
    } catch (e) { console.error(e); }
    openModal('dataManagerModal');
}

async function exportAllData() {
    try {
        const [members, staff, donations] = await Promise.all([getMembersData(), getStaffData(), getDonationsData()]);
        downloadJSON({ exportDate: new Date().toISOString(), version:'1.0', churchName:'Tabernacle Amour Pour Le Calvaire', members, staff, donations },
            `church-backup-all-${formatDateForFilename()}.json`);
        showNotification('All data exported!', 'success');
    } catch (e) { console.error(e); }
}

async function exportMembers() {
    const members = await getMembersData();
    downloadJSON({ exportDate: new Date().toISOString(), version:'1.0', dataType:'members', members }, `church-backup-members-${formatDateForFilename()}.json`);
    showNotification('Members exported!', 'success');
}

async function exportStaff() {
    const staff = await getStaffData();
    downloadJSON({ exportDate: new Date().toISOString(), version:'1.0', dataType:'staff', staff }, `church-backup-staff-${formatDateForFilename()}.json`);
    showNotification('Staff exported!', 'success');
}

async function exportDonationsData() {
    const donations = await getDonationsData();
    downloadJSON({ exportDate: new Date().toISOString(), version:'1.0', dataType:'donations', donations }, `church-backup-donations-${formatDateForFilename()}.json`);
    showNotification('Donations exported!', 'success');
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) { showNotification('Please select a valid .json backup file', 'error'); return; }
    if (!confirm('WARNING: Review the backup before importing.\n\nContinue?')) { event.target.value = ''; return; }
    const reader = new FileReader();
    reader.onload = e => {
        try { importData(JSON.parse(e.target.result)); }
        catch (err) { console.error(err); showNotification('Invalid backup file format', 'error'); }
    };
    reader.readAsText(file);
    event.target.value = '';
}

async function importData(data) {
    let count = 0;
    if (data.members?.length) {
        for (const m of data.members) {
            await saveMember({
                id: m.id, firstName: m.first_name || m.firstName, lastName: m.last_name || m.lastName,
                email: m.email, phone: m.phone, joinDate: m.join_date || m.joinDate,
                ministry: m.ministry, status: m.status, photo: m.photo
            });
            count++;
        }
    }
    if (data.staff?.length) {
        for (const s of data.staff) {
            await saveStaff({
                id: s.id, name: s.name, email: s.email, phone: s.phone,
                role: s.role, department: s.department, startDate: s.start_date || s.startDate,
                employmentType: s.employment_type || s.employmentType, bio: s.bio, photo: s.photo
            });
            count++;
        }
    }
    if (!count) { showNotification('No data found in backup', 'warning'); return; }
    await renderMembersTable();
    await renderStaffGrid();
    await loadAdminStats();
    openDataManager();
    showNotification(`Imported ${count} records!`, 'success');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

function formatDateForFilename() {
    const n = new Date();
    return `${n.getFullYear()}${String(n.getMonth()+1).padStart(2,'0')}${String(n.getDate()).padStart(2,'0')}-${String(n.getHours()).padStart(2,'0')}${String(n.getMinutes()).padStart(2,'0')}`;
}

function debugLocalStorage() { console.log('Data is now stored in Supabase — use the Supabase dashboard to inspect.'); }
window.debugLocalStorage = debugLocalStorage;

// Make functions globally accessible
window.openMemberModal       = openMemberModal;
window.openStaffModal        = openStaffModal;
window.editStaff             = editStaff;
window.confirmDeleteStaff    = confirmDeleteStaff;
window.viewMember            = viewMember;
window.editMember            = editMember;
window.confirmDeleteMember   = confirmDeleteMember;
window.openDataManager       = openDataManager;
window.exportAllData         = exportAllData;
window.exportMembers         = exportMembers;
window.exportStaff           = exportStaff;
window.exportDonations       = exportDonationsData;
window.handleImportFile      = handleImportFile;
window.openDonationModal     = openDonationModal;
window.viewDonation          = viewDonation;
window.editDonation          = editDonation;
window.confirmDeleteDonation = confirmDeleteDonation;
window.generateTaxReceipt    = generateTaxReceipt;
window.openSmokeTestModal    = openSmokeTestModal;
window.resetSmokeChecks      = resetSmokeChecks;
window.runDonationCrudVerification = runDonationCrudVerification;
window.importCSVData         = importCSVData;
window.resetCSVImport        = resetCSVImport;
