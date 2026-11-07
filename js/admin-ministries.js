// ============================================
// MINISTRIES OVERSIGHT
// Records stay in this browser so Add, Edit, and Delete
// update the ministries shown on this page.
// ============================================

const CATEGORY_NAMES = {
    worship: 'Worship',
    children: 'Children',
    youth: 'Youth',
    outreach: 'Outreach',
    prayer: 'Prayer',
    education: 'Education',
    men: 'Men',
    women: 'Women',
    seniors: 'Seniors',
    general: 'General'
};

const CATEGORY_COLORS = {
    worship: '#667eea',
    children: '#f093fb',
    youth: '#43e97b',
    outreach: '#f5a623',
    prayer: '#4facfe',
    education: '#718096',
    men: '#2c5282',
    women: '#d53f8c',
    seniors: '#dd6b20',
    general: '#4a5568'
};

const CATEGORY_ICONS = {
    worship: 'music',
    children: 'child',
    youth: 'users',
    outreach: 'hand-holding-heart',
    prayer: 'pray',
    education: 'book',
    men: 'male',
    women: 'female',
    seniors: 'heart',
    general: 'hands-praying'
};

document.addEventListener('DOMContentLoaded', function() {
    renderMinistriesPage();
    bindMinistryForms();
});

function emptyLedger() {
    return { ministries: [], volunteers: [], activities: [], resources: [] };
}

function loadLedger() {
    if (typeof readMinistryLedger === 'function') return readMinistryLedger();
    return emptyLedger();
}

function saveLedger(ledger) {
    if (typeof writeMinistryLedger === 'function') {
        writeMinistryLedger(ledger);
        return;
    }
    localStorage.setItem('churchMinistriesLedger', JSON.stringify(ledger));
}

function renderMinistriesPage() {
    const ledger = loadLedger();
    renderMinistryStats(ledger);
    fillMinistryFilters(ledger);
    renderMinistriesGrid(ledger);
    renderVolunteersTable(ledger);
    renderActivitiesGrid(ledger);
    renderResourcesGrid(ledger);
}

function renderMinistryStats(ledger) {
    setText('totalMinistries', ledger.ministries.length);
    setText('totalMiniVolunteers', ledger.volunteers.length);
    setText('totalActivities', ledger.activities.length);
    setText('totalResources', ledger.resources.length);
}

function fillMinistryFilters(ledger) {
    ['memberMinistryFilter', 'activityMinistryFilter', 'resourceMinistryFilter'].forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        const current = select.value || 'all';
        select.innerHTML = '<option value="all">All Ministries</option>' +
            ledger.ministries.map(ministry => `<option value="${escapeHtml(ministry.id)}">${escapeHtml(ministry.name)}</option>`).join('');
        select.value = [...select.options].some(option => option.value === current) ? current : 'all';
    });
}

function renderMinistriesGrid(ledger) {
    const grid = document.getElementById('ministriesGrid');
    if (!grid) return;
    const source = ledger || loadLedger();
    const status = document.getElementById('ministryStatusFilter')?.value || 'all';
    const category = document.getElementById('ministryCategoryFilter')?.value || 'all';
    const rows = source.ministries.filter(ministry =>
        (status === 'all' || ministry.status === status) &&
        (category === 'all' || ministry.category === category)
    );

    if (!rows.length) {
        const message = source.ministries.length
            ? 'No ministries match this filter.'
            : 'No ministries yet. Click "Add Ministry" to create one.';
        grid.innerHTML = emptyState('hands-praying', 'No ministries to show', message);
        return;
    }

    grid.innerHTML = rows.map(ministry => {
        const color = CATEGORY_COLORS[ministry.category] || '#718096';
        const icon = CATEGORY_ICONS[ministry.category] || 'hands-praying';
        const meeting = [ministry.meetingDay, ministry.meetingTime ? formatTime(ministry.meetingTime) : '']
            .filter(Boolean).join(' at ');
        const photo = safeAdminImage(ministry.image);
        const photoKey = typeof ministryPhotoKey === 'function' ? ministryPhotoKey(ministry.image) : '';
        const photoHtml = photoKey
            ? `<img class="ministry-admin-photo" alt="" data-ministry-photo="${escapeHtml(photoKey)}">`
            : photo
            ? `<img class="ministry-admin-photo" src="${escapeHtml(photo)}" alt="">`
            : '';
        return `
            <div class="ministry-card">
                ${photoHtml}
                <div class="ministry-card-header" style="background:${color}20;border-left:4px solid ${color};">
                    <div class="ministry-icon" style="background:${color}"><i class="fas fa-${icon}"></i></div>
                    <div>
                        <h3>${escapeHtml(ministry.name)}</h3>
                        <span class="badge badge-${ministry.status === 'active' ? 'success' : 'secondary'}">${escapeHtml(categoryName(ministry.category))} · ${ministry.status === 'active' ? 'Active' : 'Inactive'}</span>
                    </div>
                </div>
                ${ministry.description ? `<p class="ministry-desc">${escapeHtml(ministry.description)}</p>` : ''}
                <div class="ministry-details">
                    ${ministry.leader ? `<div class="ministry-detail"><i class="fas fa-user-tie"></i> ${escapeHtml(ministry.leader)}</div>` : ''}
                    ${ministry.leaderEmail ? `<div class="ministry-detail"><i class="fas fa-envelope"></i> ${escapeHtml(ministry.leaderEmail)}</div>` : ''}
                    ${ministry.leaderPhone ? `<div class="ministry-detail"><i class="fas fa-phone"></i> ${escapeHtml(ministry.leaderPhone)}</div>` : ''}
                    ${meeting ? `<div class="ministry-detail"><i class="fas fa-calendar"></i> ${escapeHtml(meeting)}</div>` : ''}
                    ${ministry.meetingLocation ? `<div class="ministry-detail"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(ministry.meetingLocation)}</div>` : ''}
                    ${ministry.budget ? `<div class="ministry-detail"><i class="fas fa-dollar-sign"></i> Budget: RD$${escapeHtml(Number(ministry.budget).toLocaleString('en-US'))}</div>` : ''}
                </div>
                <div class="ministry-actions">
                    <button type="button" class="btn-secondary btn-sm" onclick="quickAddVolunteer('${ministry.id}')"><i class="fas fa-user-plus"></i> Add Volunteer</button>
                    <button type="button" class="btn-secondary btn-sm" onclick="editMinistry('${ministry.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button type="button" class="action-btn delete" onclick="deleteMinistryRecord('${ministry.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
    }).join('');
    if (typeof hydrateMinistryPhotos === 'function') hydrateMinistryPhotos(grid);
}

function renderVolunteersTable(ledger) {
    const tbody = document.getElementById('miniMembersTableBody');
    if (!tbody) return;
    const source = ledger || loadLedger();
    const ministryId = document.getElementById('memberMinistryFilter')?.value || 'all';
    const role = document.getElementById('memberRoleFilter')?.value || 'all';
    const rows = source.volunteers.filter(volunteer =>
        (ministryId === 'all' || volunteer.ministryId === ministryId) &&
        (role === 'all' || volunteer.role === role)
    );

    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:#718096">No volunteers yet. Click "Add Volunteer" to add one.</td></tr>';
        return;
    }

    tbody.innerHTML = rows.map(volunteer => `
        <tr>
            <td><strong>${escapeHtml(volunteer.name)}</strong></td>
            <td><span class="badge badge-primary">${escapeHtml(ministryName(source, volunteer.ministryId))}</span></td>
            <td><span class="badge badge-${volunteer.role === 'leader' ? 'warning' : 'info'}">${escapeHtml(roleName(volunteer.role))}</span></td>
            <td>${escapeHtml(volunteer.email || '-')}</td>
            <td>${escapeHtml(volunteer.phone || '-')}</td>
            <td>${escapeHtml(formatMinistryDate(volunteer.joinedDate))}</td>
            <td><span class="badge badge-success">Active</span></td>
            <td class="table-actions">
                <button type="button" class="action-btn" onclick="editVolunteer('${volunteer.id}')"><i class="fas fa-edit"></i></button>
                <button type="button" class="action-btn delete" onclick="deleteVolunteerRecord('${volunteer.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function renderActivitiesGrid(ledger) {
    const grid = document.getElementById('activitiesGrid');
    if (!grid) return;
    const source = ledger || loadLedger();
    const ministryId = document.getElementById('activityMinistryFilter')?.value || 'all';
    const rows = source.activities.filter(activity => ministryId === 'all' || activity.ministryId === ministryId);

    if (!rows.length) {
        grid.innerHTML = emptyState('calendar-check', 'No activities yet', 'Click "Add Activity" to record one.');
        return;
    }

    grid.innerHTML = rows.map(activity => `
        <div class="activity-card">
            <div class="activity-header">
                <span class="badge badge-primary">${escapeHtml(ministryName(source, activity.ministryId))}</span>
                <span class="activity-date">${escapeHtml(formatMinistryDate(activity.activityDate))}</span>
            </div>
            <h3>${escapeHtml(activity.title)}</h3>
            ${activity.description ? `<p>${escapeHtml(activity.description)}</p>` : ''}
            <div class="activity-meta">
                ${activity.location ? `<span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(activity.location)}</span>` : ''}
                ${activity.attendance ? `<span><i class="fas fa-users"></i> ${escapeHtml(activity.attendance)} attended</span>` : ''}
                ${activity.budgetUsed ? `<span><i class="fas fa-dollar-sign"></i> RD$${escapeHtml(Number(activity.budgetUsed).toLocaleString('en-US'))}</span>` : ''}
            </div>
            ${activity.outcome ? `<div class="activity-outcome"><i class="fas fa-check-circle"></i> ${escapeHtml(activity.outcome)}</div>` : ''}
            <div class="card-actions">
                <button type="button" class="btn-secondary btn-sm" onclick="editActivity('${activity.id}')"><i class="fas fa-edit"></i> Edit</button>
                <button type="button" class="action-btn delete" onclick="deleteActivityRecord('${activity.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function renderResourcesGrid(ledger) {
    const grid = document.getElementById('resourcesGrid');
    if (!grid) return;
    const source = ledger || loadLedger();
    const ministryId = document.getElementById('resourceMinistryFilter')?.value || 'all';
    const type = document.getElementById('resourceTypeFilter')?.value || 'all';
    const rows = source.resources.filter(resource =>
        (ministryId === 'all' || resource.ministryId === ministryId) &&
        (type === 'all' || resource.type === type)
    );
    const typeIcon = { document: 'file-alt', video: 'video', equipment: 'box', budget: 'dollar-sign', other: 'file' };

    if (!rows.length) {
        grid.innerHTML = emptyState('folder-open', 'No resources yet', 'Click "Add Resource" to share a material.');
        return;
    }

    grid.innerHTML = rows.map(resource => `
        <div class="resource-card">
            <div class="resource-icon"><i class="fas fa-${typeIcon[resource.type] || 'file'}"></i></div>
            <div class="resource-body">
                <div class="resource-header">
                    <h3>${escapeHtml(resource.title)}</h3>
                    <span class="badge badge-info">${escapeHtml(resource.type)}</span>
                </div>
                <p class="resource-ministry"><i class="fas fa-hands-praying"></i> ${escapeHtml(ministryName(source, resource.ministryId))}</p>
                ${resource.description ? `<p class="resource-desc">${escapeHtml(resource.description)}</p>` : ''}
                <div class="resource-meta">
                    ${resource.budget ? `<span><i class="fas fa-dollar-sign"></i> RD$${escapeHtml(Number(resource.budget).toLocaleString('en-US'))}</span>` : ''}
                    ${resource.url ? `<a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener" class="resource-link"><i class="fas fa-external-link-alt"></i> Open</a>` : ''}
                </div>
            </div>
            <div class="resource-actions">
                <button type="button" class="action-btn" onclick="editResource('${resource.id}')"><i class="fas fa-edit"></i></button>
                <button type="button" class="action-btn delete" onclick="deleteResourceRecord('${resource.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function bindMinistryForms() {
    document.getElementById('ministryForm')?.addEventListener('submit', function(submitEvent) {
        submitEvent.preventDefault();
        if (ministryPhotoBusy) {
            showNotification('Wait for the photo to finish, then click Save again.', 'error');
            return;
        }
        const ledger = loadLedger();
        const editId = this.dataset.editId || '';
        const existing = ledger.ministries.find(ministry => ministry.id === editId);
        const budget = document.getElementById('ministryBudget').value;
        const record = {
            id: editId || createId('min'),
            name: document.getElementById('ministryName').value.trim(),
            category: document.getElementById('ministryCategory').value,
            leader: document.getElementById('ministryLeader').value.trim(),
            leaderEmail: document.getElementById('ministryLeaderEmail').value.trim(),
            leaderPhone: document.getElementById('ministryLeaderPhone').value.trim(),
            meetingDay: document.getElementById('ministryMeetingDay').value,
            meetingTime: document.getElementById('ministryMeetingTime').value,
            meetingLocation: document.getElementById('ministryMeetingLocation').value.trim(),
            budget: budget === '' ? '' : Number(budget),
            status: document.getElementById('ministryStatus').value,
            description: document.getElementById('ministryDescription').value.trim(),
            icon: document.getElementById('ministryIcon').value,
            image: chosenMinistryPhoto()
        };
        ledger.ministries = existing
            ? ledger.ministries.map(ministry => ministry.id === record.id ? record : ministry)
            : ledger.ministries.concat(record);
        try {
            saveLedger(ledger);
        } catch (error) {
            showNotification('That photo is too large to save. Choose a smaller picture.', 'error');
            return;
        }
        const oldPhotoKey = existing && typeof ministryPhotoKey === 'function' ? ministryPhotoKey(existing.image) : '';
        const newPhotoKey = typeof ministryPhotoKey === 'function' ? ministryPhotoKey(record.image) : '';
        if (oldPhotoKey && oldPhotoKey !== newPhotoKey && typeof deleteMinistryPhotoBlob === 'function') {
            deleteMinistryPhotoBlob(oldPhotoKey);
        }
        delete this.dataset.editId;
        closeModal('ministryModal');
        renderMinistriesPage();
        showNotification(existing ? 'Ministry updated.' : 'Ministry added.', 'success');
    });

    document.getElementById('ministryMemberForm')?.addEventListener('submit', function(submitEvent) {
        submitEvent.preventDefault();
        const ledger = loadLedger();
        const editId = this.dataset.editId || '';
        const existing = ledger.volunteers.find(volunteer => volunteer.id === editId);
        const record = {
            id: editId || createId('vol'),
            ministryId: document.getElementById('memberMinistry').value,
            name: document.getElementById('memberName').value.trim(),
            role: document.getElementById('memberRole').value,
            email: document.getElementById('memberEmail').value.trim(),
            phone: document.getElementById('memberPhone').value.trim(),
            joinedDate: document.getElementById('memberJoinedDate').value,
            notes: document.getElementById('memberNotes').value.trim()
        };
        if (!record.ministryId) {
            showNotification('Choose a ministry for this volunteer.', 'error');
            return;
        }
        ledger.volunteers = existing
            ? ledger.volunteers.map(volunteer => volunteer.id === record.id ? record : volunteer)
            : ledger.volunteers.concat(record);
        saveLedger(ledger);
        delete this.dataset.editId;
        closeModal('ministryMemberModal');
        renderMinistriesPage();
        showNotification(existing ? 'Volunteer updated.' : 'Volunteer added.', 'success');
    });

    document.getElementById('activityForm')?.addEventListener('submit', function(submitEvent) {
        submitEvent.preventDefault();
        const ledger = loadLedger();
        const editId = this.dataset.editId || '';
        const existing = ledger.activities.find(activity => activity.id === editId);
        const attendance = document.getElementById('activityAttendance').value;
        const budget = document.getElementById('activityBudget').value;
        const record = {
            id: editId || createId('act'),
            ministryId: document.getElementById('activityMinistry').value,
            title: document.getElementById('activityTitle').value.trim(),
            activityDate: document.getElementById('activityDate').value,
            location: document.getElementById('activityLocation').value.trim(),
            attendance: attendance === '' ? '' : Number(attendance),
            budgetUsed: budget === '' ? '' : Number(budget),
            description: document.getElementById('activityDescription').value.trim(),
            outcome: document.getElementById('activityOutcome').value.trim()
        };
        if (!record.ministryId) {
            showNotification('Choose a ministry for this activity.', 'error');
            return;
        }
        ledger.activities = existing
            ? ledger.activities.map(activity => activity.id === record.id ? record : activity)
            : ledger.activities.concat(record);
        saveLedger(ledger);
        delete this.dataset.editId;
        closeModal('activityModal');
        renderMinistriesPage();
        showNotification(existing ? 'Activity updated.' : 'Activity added.', 'success');
    });

    document.getElementById('resourceForm')?.addEventListener('submit', function(submitEvent) {
        submitEvent.preventDefault();
        const ledger = loadLedger();
        const editId = this.dataset.editId || '';
        const existing = ledger.resources.find(resource => resource.id === editId);
        const budget = document.getElementById('resourceBudget').value;
        const record = {
            id: editId || createId('res'),
            ministryId: document.getElementById('resourceMinistry').value,
            title: document.getElementById('resourceTitle').value.trim(),
            type: document.getElementById('resourceType').value,
            url: document.getElementById('resourceUrl').value.trim(),
            budget: budget === '' ? '' : Number(budget),
            description: document.getElementById('resourceDescription').value.trim(),
            notes: document.getElementById('resourceNotes').value.trim()
        };
        if (!record.ministryId) {
            showNotification('Choose a ministry for this resource.', 'error');
            return;
        }
        ledger.resources = existing
            ? ledger.resources.map(resource => resource.id === record.id ? record : resource)
            : ledger.resources.concat(record);
        saveLedger(ledger);
        delete this.dataset.editId;
        closeModal('resourceModal');
        renderMinistriesPage();
        showNotification(existing ? 'Resource updated.' : 'Resource added.', 'success');
    });

    document.getElementById('ministryPhotoFile')?.addEventListener('change', async function() {
        const file = this.files && this.files[0];
        if (!file) return;
        const photoProblem = ministryPhotoProblem(file);
        if (photoProblem) {
            showNotification(photoProblem, 'error');
            this.value = '';
            return;
        }
        ministryPhotoBusy = true;
        showNotification('Preparing the photo…', 'info');
        const key = typeof createMinistryPhotoKey === 'function' ? createMinistryPhotoKey() : '';
        try {
            if (!key || typeof saveMinistryPhotoBlob !== 'function' || typeof blobToDataUrl !== 'function') {
                throw new Error('unreadable');
            }
            await saveMinistryPhotoBlob(key, file);
            const previewUrl = await blobToDataUrl(file);
            const previous = ministryPhotoData;
            const editId = document.getElementById('ministryForm')?.dataset.editId || '';
            const stored = editId ? (loadLedger().ministries.find(item => item.id === editId)?.image || '') : '';
            if (previous && previous !== stored && typeof ministryPhotoKey === 'function' && ministryPhotoKey(previous)) {
                deleteMinistryPhotoBlob(ministryPhotoKey(previous));
            }
            const link = document.getElementById('ministryImage');
            if (link) link.value = '';
            showMinistryPhoto('idb:' + key, previewUrl);
            showNotification('Photo ready. Save the ministry to show it on the website.', 'success');
        } catch (error) {
            if (key && typeof deleteMinistryPhotoBlob === 'function') deleteMinistryPhotoBlob(key);
            showNotification(error && error.message === 'heic'
                ? 'This photo is HEIC. Save it as a JPG or PNG, then upload that file.'
                : 'This photo could not be saved. Try a smaller JPG or PNG.', 'error');
            this.value = '';
        } finally {
            ministryPhotoBusy = false;
        }
    });

    document.getElementById('ministryImage')?.addEventListener('input', function() {
        const value = this.value.trim();
        if (!value) {
            if (String(ministryPhotoData).startsWith('http')) showMinistryPhoto('');
            return;
        }
        if (/^https?:\/\//i.test(value)) showMinistryPhoto(value);
    });

    document.getElementById('ministryPhotoClear')?.addEventListener('click', function() {
        const file = document.getElementById('ministryPhotoFile');
        const link = document.getElementById('ministryImage');
        if (file) file.value = '';
        if (link) link.value = '';
        showMinistryPhoto('');
    });
}

function openAddMinistryModal() {
    const form = document.getElementById('ministryForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
    }
    const title = document.getElementById('ministryModalTitle');
    if (title) title.innerHTML = '<i class="fas fa-hands-praying"></i> Add Ministry';
    const file = document.getElementById('ministryPhotoFile');
    if (file) file.value = '';
    showMinistryPhoto('');
    openModal('ministryModal');
}

function editMinistry(id) {
    const ministry = loadLedger().ministries.find(item => item.id === id);
    if (!ministry) return;
    openAddMinistryModal();
    const form = document.getElementById('ministryForm');
    form.dataset.editId = ministry.id;
    document.getElementById('ministryModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Ministry';
    document.getElementById('ministryName').value = ministry.name;
    document.getElementById('ministryCategory').value = ministry.category || 'general';
    document.getElementById('ministryLeader').value = ministry.leader || '';
    document.getElementById('ministryLeaderEmail').value = ministry.leaderEmail || '';
    document.getElementById('ministryLeaderPhone').value = ministry.leaderPhone || '';
    document.getElementById('ministryMeetingDay').value = ministry.meetingDay || '';
    document.getElementById('ministryMeetingTime').value = ministry.meetingTime || '';
    document.getElementById('ministryMeetingLocation').value = ministry.meetingLocation || '';
    document.getElementById('ministryBudget').value = ministry.budget === '' || ministry.budget == null ? '' : ministry.budget;
    document.getElementById('ministryStatus').value = ministry.status || 'active';
    document.getElementById('ministryIcon').value = ministry.icon || 'fa-hands-praying';
    document.getElementById('ministryDescription').value = ministry.description || '';
    showMinistryPhoto(ministry.image || '');
}

function deleteMinistryRecord(id) {
    const ledger = loadLedger();
    const ministry = ledger.ministries.find(item => item.id === id);
    if (!ministry) return;
    if (!confirm('Delete "' + ministry.name + '"? Its volunteers, activities, and resources will be removed too.')) return;
    const photoKey = typeof ministryPhotoKey === 'function' ? ministryPhotoKey(ministry.image) : '';
    if (photoKey && typeof deleteMinistryPhotoBlob === 'function') deleteMinistryPhotoBlob(photoKey);
    ledger.ministries = ledger.ministries.filter(item => item.id !== id);
    ledger.volunteers = ledger.volunteers.filter(item => item.ministryId !== id);
    ledger.activities = ledger.activities.filter(item => item.ministryId !== id);
    ledger.resources = ledger.resources.filter(item => item.ministryId !== id);
    saveLedger(ledger);
    renderMinistriesPage();
    showNotification('Ministry deleted.', 'success');
}

function openAddMemberModal() {
    if (!requireMinistry('volunteer')) return;
    const form = document.getElementById('ministryMemberForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
    }
    document.getElementById('ministryMemberModalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Add Volunteer';
    fillFormMinistrySelect('memberMinistry');
    openModal('ministryMemberModal');
}

function quickAddVolunteer(ministryId) {
    openAddMemberModal();
    const select = document.getElementById('memberMinistry');
    if (select) select.value = ministryId;
}

function editVolunteer(id) {
    const volunteer = loadLedger().volunteers.find(item => item.id === id);
    if (!volunteer) return;
    openAddMemberModal();
    const form = document.getElementById('ministryMemberForm');
    form.dataset.editId = volunteer.id;
    document.getElementById('ministryMemberModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Volunteer';
    document.getElementById('memberMinistry').value = volunteer.ministryId;
    document.getElementById('memberName').value = volunteer.name;
    document.getElementById('memberRole').value = volunteer.role || 'member';
    document.getElementById('memberEmail').value = volunteer.email || '';
    document.getElementById('memberPhone').value = volunteer.phone || '';
    document.getElementById('memberJoinedDate').value = volunteer.joinedDate || '';
    document.getElementById('memberNotes').value = volunteer.notes || '';
}

function deleteVolunteerRecord(id) {
    const ledger = loadLedger();
    const volunteer = ledger.volunteers.find(item => item.id === id);
    if (!volunteer) return;
    if (!confirm('Remove "' + volunteer.name + '"?')) return;
    ledger.volunteers = ledger.volunteers.filter(item => item.id !== id);
    saveLedger(ledger);
    renderMinistriesPage();
    showNotification('Volunteer removed.', 'success');
}

function openAddActivityModal() {
    if (!requireMinistry('activity')) return;
    const form = document.getElementById('activityForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
    }
    document.getElementById('activityModalTitle').innerHTML = '<i class="fas fa-calendar-alt"></i> Add Activity';
    fillFormMinistrySelect('activityMinistry');
    openModal('activityModal');
}

function editActivity(id) {
    const activity = loadLedger().activities.find(item => item.id === id);
    if (!activity) return;
    openAddActivityModal();
    const form = document.getElementById('activityForm');
    form.dataset.editId = activity.id;
    document.getElementById('activityModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Activity';
    document.getElementById('activityMinistry').value = activity.ministryId;
    document.getElementById('activityTitle').value = activity.title;
    document.getElementById('activityDate').value = activity.activityDate || '';
    document.getElementById('activityLocation').value = activity.location || '';
    document.getElementById('activityAttendance').value = activity.attendance === '' || activity.attendance == null ? '' : activity.attendance;
    document.getElementById('activityBudget').value = activity.budgetUsed === '' || activity.budgetUsed == null ? '' : activity.budgetUsed;
    document.getElementById('activityDescription').value = activity.description || '';
    document.getElementById('activityOutcome').value = activity.outcome || '';
}

function deleteActivityRecord(id) {
    const ledger = loadLedger();
    const activity = ledger.activities.find(item => item.id === id);
    if (!activity) return;
    if (!confirm('Delete "' + activity.title + '"?')) return;
    ledger.activities = ledger.activities.filter(item => item.id !== id);
    saveLedger(ledger);
    renderMinistriesPage();
    showNotification('Activity deleted.', 'success');
}

function openAddResourceModal() {
    if (!requireMinistry('resource')) return;
    const form = document.getElementById('resourceForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
    }
    document.getElementById('resourceModalTitle').innerHTML = '<i class="fas fa-folder-plus"></i> Add Resource';
    fillFormMinistrySelect('resourceMinistry');
    openModal('resourceModal');
}

function editResource(id) {
    const resource = loadLedger().resources.find(item => item.id === id);
    if (!resource) return;
    openAddResourceModal();
    const form = document.getElementById('resourceForm');
    form.dataset.editId = resource.id;
    document.getElementById('resourceModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Resource';
    document.getElementById('resourceMinistry').value = resource.ministryId;
    document.getElementById('resourceTitle').value = resource.title;
    document.getElementById('resourceType').value = resource.type || 'document';
    document.getElementById('resourceUrl').value = resource.url || '';
    document.getElementById('resourceBudget').value = resource.budget === '' || resource.budget == null ? '' : resource.budget;
    document.getElementById('resourceDescription').value = resource.description || '';
    document.getElementById('resourceNotes').value = resource.notes || '';
}

function deleteResourceRecord(id) {
    const ledger = loadLedger();
    const resource = ledger.resources.find(item => item.id === id);
    if (!resource) return;
    if (!confirm('Delete "' + resource.title + '"?')) return;
    ledger.resources = ledger.resources.filter(item => item.id !== id);
    saveLedger(ledger);
    renderMinistriesPage();
    showNotification('Resource deleted.', 'success');
}

function filterMinistriesList() {
    renderMinistriesGrid();
}

function filterMembersTable() {
    renderVolunteersTable();
}

function filterActivities() {
    renderActivitiesGrid();
}

function filterResources() {
    renderResourcesGrid();
}

function switchMiniTab(tabId, button) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-navigation .tab-btn').forEach(tab => tab.classList.remove('active'));
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    if (button) button.classList.add('active');
}

function requireMinistry(kind) {
    if (loadLedger().ministries.length) return true;
    showNotification('Add a ministry first, then you can add a ' + kind + '.', 'error');
    return false;
}

function fillFormMinistrySelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const ministries = loadLedger().ministries;
    select.innerHTML = '<option value="">Select ministry…</option>' +
        ministries.map(ministry => `<option value="${escapeHtml(ministry.id)}">${escapeHtml(ministry.name)}</option>`).join('');
}

function ministryName(ledger, id) {
    const ministry = ledger.ministries.find(item => item.id === id);
    return ministry ? ministry.name : 'Former ministry';
}

let ministryPhotoData = '';
let ministryPhotoBusy = false;

function ministryPhotoProblem(file) {
    const name = String(file.name || '').toLowerCase();
    const type = String(file.type || '').toLowerCase();
    if (type.includes('heic') || type.includes('heif') || name.endsWith('.heic') || name.endsWith('.heif')) {
        return 'This photo is HEIC. Save it as a JPG or PNG, then upload that file.';
    }
    const allowedType = type.startsWith('image/') && !type.includes('svg');
    const allowedName = /\.(jpe?g|png|webp|gif|bmp)$/i.test(name);
    if (!allowedType && !allowedName) {
        return 'Use a JPG or PNG photo.';
    }
    return '';
}

function showMinistryPhoto(value, previewUrl) {
    const image = String(value || '').trim();
    ministryPhotoData = typeof isStoredMinistryPhoto === 'function' && isStoredMinistryPhoto(image) ? image : '';
    const preview = document.getElementById('ministryPhotoPreview');
    const empty = document.getElementById('ministryPhotoEmpty');
    const clearButton = document.getElementById('ministryPhotoClear');
    const link = document.getElementById('ministryImage');
    const direct = previewUrl || (typeof isMinistryImage === 'function' && isMinistryImage(ministryPhotoData) ? ministryPhotoData : '');
    if (preview) {
        if (direct) {
            preview.src = direct;
            preview.hidden = false;
        } else {
            preview.removeAttribute('src');
            preview.hidden = true;
        }
    }
    const photoKey = typeof ministryPhotoKey === 'function' ? ministryPhotoKey(ministryPhotoData) : '';
    if (photoKey && !direct && typeof loadMinistryPhotoBlob === 'function' && typeof blobToDataUrl === 'function') {
        loadMinistryPhotoBlob(photoKey).then(function(blob) {
            if (!blob || ministryPhotoKey(ministryPhotoData) !== photoKey) return null;
            return blobToDataUrl(blob);
        }).then(function(url) {
            if (!url || !preview || ministryPhotoKey(ministryPhotoData) !== photoKey) return;
            preview.src = url;
            preview.hidden = false;
        }).catch(function() {});
    }
    if (empty) empty.hidden = Boolean(ministryPhotoData);
    if (clearButton) clearButton.hidden = !ministryPhotoData;
    if (link && document.activeElement !== link) {
        link.value = ministryPhotoData.startsWith('http') ? ministryPhotoData : '';
    }
}

function chosenMinistryPhoto() {
    const typed = document.getElementById('ministryImage')?.value.trim() || '';
    if (/^https?:\/\//i.test(typed)) return typed;
    return ministryPhotoData;
}

function safeAdminImage(value) {
    const image = String(value || '').trim();
    return typeof isMinistryImage === 'function' && isMinistryImage(image) ? image : '';
}

function categoryName(value) {
    return CATEGORY_NAMES[value] || value || 'General';
}

function roleName(value) {
    const names = { leader: 'Leader', 'co-leader': 'Co-Leader', member: 'Member', volunteer: 'Volunteer' };
    return names[value] || value || 'Member';
}

function formatMinistryDate(value) {
    if (!value) return '-';
    const parts = String(value).slice(0, 10).split('-');
    if (parts.length !== 3) return value;
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(value) {
    const parts = String(value || '').split(':');
    const hour = Number(parts[0]);
    if (Number.isNaN(hour)) return value;
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return hour12 + ':' + (parts[1] || '00') + ' ' + suffix;
}

function createId(prefix) {
    return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function emptyState(icon, title, message) {
    return `<div class="loading-state"><i class="fas fa-${icon}" style="font-size:2rem;opacity:.35;display:block;margin-bottom:.75rem;"></i><h3 style="margin-bottom:.35rem;color:#2d3748;">${escapeHtml(title)}</h3><p>${escapeHtml(message)}</p></div>`;
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

window.openAddMinistryModal = openAddMinistryModal;
window.editMinistry = editMinistry;
window.deleteMinistryRecord = deleteMinistryRecord;
window.openAddMemberModal = openAddMemberModal;
window.quickAddVolunteer = quickAddVolunteer;
window.editVolunteer = editVolunteer;
window.deleteVolunteerRecord = deleteVolunteerRecord;
window.openAddActivityModal = openAddActivityModal;
window.editActivity = editActivity;
window.deleteActivityRecord = deleteActivityRecord;
window.openAddResourceModal = openAddResourceModal;
window.editResource = editResource;
window.deleteResourceRecord = deleteResourceRecord;
window.filterMinistriesList = filterMinistriesList;
window.filterMembersTable = filterMembersTable;
window.filterActivities = filterActivities;
window.filterResources = filterResources;
window.switchMiniTab = switchMiniTab;

if (!document.getElementById('admin-ministries-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'admin-ministries-styles';
    styleElement.textContent = `
.ministry-site-note{margin:.35rem 0 0;color:#4a5568;font-size:.92rem;max-width:46rem;line-height:1.45;}
.ministry-photo-picker{display:flex;flex-direction:column;gap:.75rem;margin-bottom:.75rem;}
.ministry-photo-picker img{width:100%;height:200px;object-fit:cover;object-position:center;border-radius:10px;background:#edf2f7;}
#ministryPhotoEmpty,.ministry-photo-hint{margin:0;color:#4a5568;}
.ministry-photo-hint{font-size:.85rem;}
.ministry-photo-actions{display:flex;gap:.5rem;flex-wrap:wrap;}
.ministry-photo-upload{position:relative;overflow:hidden;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem;}
.ministry-photo-upload input{position:absolute;inset:0;opacity:0;cursor:pointer;}
.ministry-admin-photo{display:block;width:100%;height:140px;object-fit:cover;}
.filter-bar{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem;}
.filter-bar select{padding:.5rem 1rem;border:1px solid var(--border-color,#e2e8f0);border-radius:var(--radius-md,8px);background:#fff;color:#1a202c;}
.ministries-grid,.activities-grid,.resources-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.5rem;}
.ministry-card,.activity-card,.resource-card{background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.08);}
.ministry-card-header{display:flex;align-items:center;gap:1rem;padding:1.25rem;}
.ministry-icon{width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
.ministry-card-header h3,.activity-card h3,.resource-header h3{margin:0 0 .25rem;color:#1a202c;}
.ministry-desc,.ministry-detail,.activity-card p,.resource-desc{color:#4a5568;}
.ministry-desc{padding:0 1.25rem .75rem;margin:0;}
.ministry-details{padding:0 1.25rem 1rem;}
.ministry-detail{display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;font-size:.9rem;}
.ministry-actions,.card-actions{display:flex;gap:.5rem;align-items:center;padding:1rem 1.25rem;border-top:1px solid #e2e8f0;}
.activity-card{padding:1.25rem;}
.activity-header,.resource-header{display:flex;justify-content:space-between;gap:.75rem;align-items:center;margin-bottom:.75rem;}
.activity-meta,.resource-meta{display:flex;gap:.75rem;flex-wrap:wrap;color:#4a5568;font-size:.9rem;}
.activity-outcome{margin-top:.75rem;color:#276749;}
.resource-card{display:flex;gap:1rem;padding:1.25rem;align-items:flex-start;}
.resource-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;background:#2c5282;flex-shrink:0;}
.resource-body{flex:1;min-width:0;}
.resource-ministry{color:#2c5282;margin:.25rem 0;}
.resource-link{color:#2c5282;}
.resource-actions{display:flex;flex-direction:column;gap:.25rem;}
.loading-state{text-align:center;padding:2.5rem 1rem;color:#718096;grid-column:1/-1;}
@media(max-width:768px){
.ministries-grid,.activities-grid,.resources-grid{grid-template-columns:1fr;}
.resource-card{flex-direction:column;}
}
`;
    document.head.appendChild(styleElement);
}
