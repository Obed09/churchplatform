// ============================================
// COMMUNICATIONS DEPARTMENT — Supabase connected
// ============================================

const messageTemplates = [
    { id: 1, name: 'Event Reminder',     category: 'Events',      body: 'Dear [Name],\n\nThis is a reminder about our upcoming event: [Event Name] on [Date].\n\nWe hope to see you there!\n\nGod bless,\nTabernacle Amour Pour Le Calvaire' },
    { id: 2, name: 'Welcome New Member', category: 'Membership',  body: 'Dear [Name],\n\nWelcome to our church family! We are so blessed to have you with us.\n\nPlease don\'t hesitate to reach out if you need anything.\n\nIn Christ,\nTabernacle Amour Pour Le Calvaire' },
    { id: 3, name: 'Weekly Newsletter',  category: 'Newsletter',  body: 'Dear Church Family,\n\nHere are this week\'s updates:\n\n• [Update 1]\n• [Update 2]\n• [Update 3]\n\nBlessings,\nTabernacle Amour Pour Le Calvaire' },
    { id: 4, name: 'Prayer Request',     category: 'Prayer',      body: 'Dear Brothers and Sisters,\n\nPlease keep [Name/Situation] in your prayers this week.\n\nThank you for your faithful intercession.\n\nIn prayer,\nTabernacle Amour Pour Le Calvaire' }
];

const CHURCH_ANNOUNCEMENT_TEMPLATE = {
    title: 'Church Announcement Template',
    content: '',
    priority: 'high',
    imageUrl: 'images/church building1.png'
};

const CHURCH_ANNOUNCEMENT_TEMPLATE_FILE = 'templates/church-announcement-template.html';
const REUSABLE_ANNOUNCEMENT_TEMPLATE_KEY = 'churchReusableAnnouncementTemplateV1';

document.addEventListener('DOMContentLoaded', async function() {
    await loadCommunicationsStats();
    await renderMessagesList();
    await renderAnnouncementsGrid();
    renderTemplatesGrid();
    initializeMessageForm();
    initializeChurchTemplateEditor();
    initializeAnnouncementForm();
    initializeAnnouncementImageInput();
});

// ── Statistics ─────────────────────────────────────────────

async function loadCommunicationsStats() {
    try {
        const [messages, announcements] = await Promise.all([getMessages(), getAnnouncements()]);
        const msgs = messages.map(convertMessageFromDB);
        const anns = announcements.map(convertAnnouncementFromDB);

        const sent    = msgs.filter(m => m.status === 'sent').length;
        const avgRate = msgs.length ? Math.round(msgs.reduce((s, m) => s + m.openRate, 0) / msgs.length) : 0;
        const active  = anns.filter(a => a.isActive).length;

        document.getElementById('messagesSent').textContent  = sent;
        document.getElementById('openRate').textContent      = `${avgRate}%`;
        document.getElementById('subscribers').textContent   = 324;
        document.getElementById('announcements').textContent = active;
    } catch (e) {
        console.error('Error loading comms stats:', e);
    }
}

// ── Messages ───────────────────────────────────────────────

async function renderMessagesList() {
    const container = document.getElementById('messagesList');
    if (!container) return;
    try {
        const rows = await getMessages();
        const msgs = rows.map(convertMessageFromDB);

        if (!msgs.length) {
            container.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-light);"><i class="fas fa-envelope" style="font-size:3rem;opacity:.3;display:block;margin-bottom:1rem;"></i><p>No messages sent yet.</p></div>`;
            return;
        }

        container.innerHTML = msgs.map(m => `
            <div class="message-item">
                <div class="message-icon">
                    <i class="fas fa-${m.messageType === 'email' ? 'envelope' : m.messageType === 'sms' ? 'sms' : 'paper-plane'}"></i>
                </div>
                <div class="message-details">
                    <h4>${m.subject}</h4>
                    <p class="message-meta">
                        <span><i class="fas fa-users"></i> ${m.recipientGroup}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(m.date)}</span>
                        ${m.openRate ? `<span><i class="fas fa-envelope-open"></i> ${m.openRate}% open rate</span>` : ''}
                    </p>
                </div>
                <div class="message-status">
                    <span class="badge badge-${m.status === 'sent' ? 'success' : m.status === 'scheduled' ? 'warning' : 'secondary'}">${m.status}</span>
                </div>
                <div class="message-actions">
                    <button class="action-btn" onclick="viewMessage('${m.id}')" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="duplicateMessage('${m.id}')" title="Duplicate"><i class="fas fa-copy"></i></button>
                    <button class="action-btn delete" onclick="confirmDeleteMessage('${m.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    } catch (e) {
        console.error('Error rendering messages:', e);
    }
}

function initializeMessageForm() {
    const form = document.getElementById('messageForm');
    if (!form) return;

    const schedCheck = document.getElementById('messageSchedule');
    const schedGroup = document.getElementById('scheduleGroup');
    if (schedCheck && schedGroup) {
        schedCheck.addEventListener('change', function() {
            schedGroup.style.display = this.checked ? 'block' : 'none';
        });
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const recipients = Array.from(document.getElementById('messageRecipients').selectedOptions).map(o => o.text).join(', ');
        const scheduled  = document.getElementById('messageSchedule').checked;
        const schedDate  = document.getElementById('messageScheduleDate')?.value;

        const msg = {
            subject:        document.getElementById('messageSubject').value,
            body:           document.getElementById('messageBody').value,
            messageType:    document.getElementById('messageType').value,
            recipientGroup: recipients,
            status:         scheduled ? 'scheduled' : 'sent',
            scheduledAt:    scheduled && schedDate ? new Date(schedDate).toISOString() : null
        };

        try {
            await saveMessage(msg);
            showNotification(`Message ${scheduled ? 'scheduled' : 'sent'} successfully!`, 'success');
            closeModal('messageModal');
            form.reset();
            if (schedGroup) schedGroup.style.display = 'none';
            await renderMessagesList();
            await loadCommunicationsStats();
        } catch (err) {
            console.error(err);
        }
    });
}

async function viewMessage(id) {
    const rows = await getMessages();
    const m = rows.map(convertMessageFromDB).find(x => x.id === id);
    if (!m) return;
    alert(`Message Details:\n\nSubject: ${m.subject}\nRecipients: ${m.recipientGroup}\nType: ${m.messageType}\nDate: ${formatDate(m.date)}\nStatus: ${m.status}${m.openRate ? `\nOpen Rate: ${m.openRate}%` : ''}\n\n${m.body || ''}`);
}

async function duplicateMessage(id) {
    const rows = await getMessages();
    const m = rows.map(convertMessageFromDB).find(x => x.id === id);
    if (!m) return;
    document.getElementById('messageSubject').value = `Copy of ${m.subject}`;
    if (document.getElementById('messageBody')) document.getElementById('messageBody').value = m.body || '';
    openModal('messageModal');
}

async function confirmDeleteMessage(id) {
    if (!confirm('Delete this message?')) return;
    const ok = await deleteMessage(id);
    if (ok) {
        showNotification('Message deleted!', 'success');
        await renderMessagesList();
        await loadCommunicationsStats();
    }
}

async function filterMessages() {
    const filter = document.getElementById('messageFilter')?.value || 'all';
    const rows = await getMessages();
    const msgs = rows.map(convertMessageFromDB);
    const filtered = filter === 'all' ? msgs : msgs.filter(m => m.status === filter || m.messageType === filter);
    const container = document.getElementById('messagesList');
    if (!container) return;
    // re-render filtered (reuse same template)
    container.innerHTML = filtered.map(m => `
        <div class="message-item">
            <div class="message-icon"><i class="fas fa-${m.messageType === 'email' ? 'envelope' : 'sms'}"></i></div>
            <div class="message-details">
                <h4>${m.subject}</h4>
                <p class="message-meta"><span><i class="fas fa-users"></i> ${m.recipientGroup}</span><span><i class="fas fa-calendar"></i> ${formatDate(m.date)}</span></p>
            </div>
            <div class="message-status"><span class="badge badge-${m.status === 'sent' ? 'success' : 'secondary'}">${m.status}</span></div>
            <div class="message-actions">
                <button class="action-btn" onclick="viewMessage('${m.id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" onclick="confirmDeleteMessage('${m.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`).join('') || '<p style="padding:2rem;color:var(--text-light);">No messages match this filter.</p>';
}

function saveAsDraft() {
    showNotification('Draft saved! You can edit and send it later.', 'info');
}

// ── Announcements ──────────────────────────────────────────

async function renderAnnouncementsGrid() {
    const container = document.getElementById('announcementsGrid');
    if (!container) return;
    try {
        const rows = await getAnnouncements();
        const anns = rows.map(convertAnnouncementFromDB);

        if (!anns.length) {
            container.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-light);grid-column:1/-1;"><i class="fas fa-bullhorn" style="font-size:3rem;opacity:.3;display:block;margin-bottom:1rem;"></i><p>No announcements yet.</p></div>`;
            return;
        }

        container.innerHTML = anns.map(a => `
            <div class="announcement-card priority-${a.priority}">
                ${renderAnnouncementAsset(a)}
                <div class="announcement-header">
                    <span class="priority-badge ${a.priority}">${a.priority}</span>
                    <span class="status-badge ${a.status}">${a.status}</span>
                </div>
                <h3>${a.title}</h3>
                <div class="announcement-body">${renderAnnouncementContent(a.content)}</div>
                <div class="announcement-dates">
                    <span><i class="fas fa-calendar"></i> ${formatDate(a.startDate)} – ${formatDate(a.endDate)}</span>
                </div>
                <div class="announcement-actions">
                    <button class="btn-secondary" onclick="openEditAnnouncementModal('${a.id}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="action-btn delete" onclick="confirmDeleteAnnouncement('${a.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    } catch (e) {
        console.error('Error rendering announcements:', e);
    }
}

function getChurchTemplateFieldValues() {
    return {
        programme: document.getElementById('churchProgramme')?.value || '',
        dirigeant: document.getElementById('churchDirigeant')?.value || '',
        lecture: document.getElementById('churchLecture')?.value || '',
        priere_pastorale: document.getElementById('churchPrierePastorale')?.value || '',
        encouragement: document.getElementById('churchEncouragement')?.value || '',
        message_principal: document.getElementById('churchMessagePrincipal')?.value || '',
        priere_finale: document.getElementById('churchPriereFinale')?.value || '',
        footer_message: document.getElementById('churchFooterMessage')?.value || ''
    };
}

function buildChurchTemplateText(values) {
    return [
        `Programme du: ${values.programme || ''}`,
        `Dirigeant(e): ${values.dirigeant || ''}`,
        `Lecture: ${values.lecture || ''}`,
        `Prière Pastorale: ${values.priere_pastorale || ''}`,
        `Encouragement / Exhortation: ${values.encouragement || ''}`,
        `Message Principal: ${values.message_principal || ''}`,
        `Prière Finale: ${values.priere_finale || ''}`,
        `Footer Message: ${values.footer_message || ''}`
    ].join('\n');
}

function getChurchTemplateDisplayValues(values) {
    return {
        programme: values.programme || 'Saisissez le programme du service',
        dirigeant: values.dirigeant || 'Nom du dirigeant',
        lecture: values.lecture || 'Saisissez la lecture',
        priere_pastorale: values.priere_pastorale || 'Saisissez la prière pastorale',
        encouragement: values.encouragement || 'Saisissez l’encouragement',
        message_principal: values.message_principal || 'Saisissez le message principal',
        priere_finale: values.priere_finale || 'Saisissez la prière finale',
        footer_message: values.footer_message || 'Saisissez un message de clôture'
    };
}

function extractChurchTemplateFragment(templateHtml) {
    if (!templateHtml) return '';

    const styleMatch = templateHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    let fragment = '';

    if (styleMatch) {
        fragment += `<style>${styleMatch[1]}</style>`;
    }

    const start = templateHtml.indexOf('<div class="church-template-flyer">');
    if (start === -1) return templateHtml;

    const end = templateHtml.lastIndexOf('</div>');
    if (end === -1) return templateHtml;

    return `${fragment}${templateHtml.slice(start, end + 6)}`;
}

async function buildChurchTemplateMarkup(values) {
    try {
        const response = await fetch(`${CHURCH_ANNOUNCEMENT_TEMPLATE_FILE}?t=${Date.now()}`);
        let html = response.ok ? await response.text() : '';
        if (!html) return '';

        const replacements = Object.entries(getChurchTemplateDisplayValues(values)).map(([key, value]) => [new RegExp(`\\{\\{${key}\\}\\}`, 'g'), escapeHtml(value)]);
        replacements.forEach(([pattern, replacement]) => {
            html = html.replace(pattern, replacement);
        });

        return extractChurchTemplateFragment(html);
    } catch (error) {
        console.error('Could not load church template preview:', error);
        return '';
    }
}

async function initializeChurchTemplateEditor() {
    const previewContainer = document.getElementById('churchTemplatePreviewContainer');
    const hiddenContent = document.getElementById('announcementContent');
    if (!previewContainer) return;

    const fieldIds = ['churchProgramme', 'churchDirigeant', 'churchLecture', 'churchPrierePastorale', 'churchEncouragement', 'churchMessagePrincipal', 'churchPriereFinale', 'churchFooterMessage'];
    const inputs = fieldIds.map(id => document.getElementById(id)).filter(Boolean);

    const renderPreview = async () => {
        const values = getChurchTemplateFieldValues();
        if (hiddenContent) {
            hiddenContent.value = buildChurchTemplateText(values);
        }

        const markup = await buildChurchTemplateMarkup(values);
        if (markup) {
            previewContainer.innerHTML = markup;
        } else {
            previewContainer.innerHTML = '<div style="padding:1rem;color:#7a6b3e;">Template preview unavailable.</div>';
        }
    };

    inputs.forEach(input => input.addEventListener('input', () => renderPreview()));
    await renderPreview();
}

function initializeAnnouncementForm() {
    const form = document.getElementById('announcementForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const editId = form.dataset.editId;
        const contentField = document.getElementById('announcementContent');
        const values = getChurchTemplateFieldValues();
        const markup = await buildChurchTemplateMarkup(values);
        if (contentField) {
            contentField.value = markup || buildChurchTemplateText(values);
        }

        const ann = {
            id:        editId || undefined,
            title:     document.getElementById('announcementTitle').value || 'Church Announcement',
            content:   contentField?.value || '',
            imageUrl:  document.getElementById('announcementImageUrl')?.value || null,
            assetName: document.getElementById('announcementAssetName')?.value || null,
            assetType: document.getElementById('announcementAssetType')?.value || null,
            startDate: document.getElementById('announcementStartDate').value,
            endDate:   document.getElementById('announcementEndDate').value,
            priority:  document.getElementById('announcementPriority').value,
            isActive:  true
        };

        try {
            await saveAnnouncement(ann);
            showNotification(`Announcement ${editId ? 'updated' : 'published'}!`, 'success');
            delete form.dataset.editId;
            document.getElementById('announcementModalTitle').textContent = 'Create Announcement';
            closeModal('announcementModal');
            form.reset();
            if (document.getElementById('announcementAssetName')) document.getElementById('announcementAssetName').value = '';
            if (document.getElementById('announcementAssetType')) document.getElementById('announcementAssetType').value = '';
            updateAnnouncementImagePreview();
            await renderAnnouncementsGrid();
            await loadCommunicationsStats();
        } catch (err) {
            console.error(err);
        }
    });
}

async function openEditAnnouncementModal(id) {
    const rows = await getAnnouncements();
    const a = rows.map(convertAnnouncementFromDB).find(x => x.id === id);
    if (!a) return;

    document.getElementById('announcementTitle').value    = a.title;
    document.getElementById('announcementContent').value  = a.content;
    if (document.getElementById('announcementImageUrl')) {
        document.getElementById('announcementImageUrl').value = a.imageUrl || '';
    }
    if (document.getElementById('announcementAssetName')) document.getElementById('announcementAssetName').value = a.assetName || '';
    if (document.getElementById('announcementAssetType')) document.getElementById('announcementAssetType').value = a.assetType || '';
    updateAnnouncementImagePreview();
    document.getElementById('announcementStartDate').value = a.startDate || '';
    document.getElementById('announcementEndDate').value   = a.endDate   || '';
    document.getElementById('announcementPriority').value  = a.priority;

    const form = document.getElementById('announcementForm');
    form.dataset.editId = id;
    document.getElementById('announcementModalTitle').textContent = 'Edit Announcement';
    openModal('announcementModal');
}

async function confirmDeleteAnnouncement(id) {
    if (!confirm('Delete this announcement?')) return;
    const ok = await deleteAnnouncement(id);
    if (ok) {
        showNotification('Announcement deleted!', 'success');
        await renderAnnouncementsGrid();
        await loadCommunicationsStats();
    }
}

// ── Templates ──────────────────────────────────────────────

function renderTemplatesGrid() {
    const container = document.getElementById('templatesGrid');
    if (!container) return;
    container.innerHTML = messageTemplates.map(t => `
        <div class="template-card">
            <div class="template-icon"><i class="fas fa-file-alt"></i></div>
            <h3>${t.name}</h3>
            <p class="template-category">${t.category}</p>
            <div class="template-actions">
                <button class="btn-secondary" onclick="useTemplate(${t.id})"><i class="fas fa-paper-plane"></i> Use Template</button>
            </div>
        </div>`).join('');
}

function useTemplate(id) {
    const t = messageTemplates.find(x => x.id === id);
    if (!t) return;
    document.getElementById('messageSubject').value = t.name;
    if (document.getElementById('messageBody')) document.getElementById('messageBody').value = t.body;
    openModal('messageModal');
}

function setDefaultAnnouncementImage() {
    const input = document.getElementById('announcementImageUrl');
    if (!input) return;
    input.value = CHURCH_ANNOUNCEMENT_TEMPLATE.imageUrl;
    if (document.getElementById('announcementAssetName')) document.getElementById('announcementAssetName').value = 'church building1.png';
    if (document.getElementById('announcementAssetType')) document.getElementById('announcementAssetType').value = 'image/png';
    updateAnnouncementImagePreview();
}

function populateAnnouncementFormFromTemplate(template, options = {}) {
    const today = new Date();
    const end = new Date(today);
    end.setDate(end.getDate() + 7);

    const tpl = { ...template };
    const form = document.getElementById('announcementForm');
    if (!form) return;

    document.getElementById('announcementTitle').value = tpl.title || 'Church Announcement Template';
    document.getElementById('announcementContent').value = tpl.content || '';
    document.getElementById('announcementPriority').value = tpl.priority || 'high';
    if (document.getElementById('announcementImageUrl')) {
        document.getElementById('announcementImageUrl').value = tpl.imageUrl || '';
    }
    if (document.getElementById('announcementAssetName')) document.getElementById('announcementAssetName').value = tpl.assetName || 'church building1.png';
    if (document.getElementById('announcementAssetType')) document.getElementById('announcementAssetType').value = tpl.assetType || 'image/png';
    document.getElementById('announcementStartDate').value = options.startDate || today.toISOString().split('T')[0];
    document.getElementById('announcementEndDate').value = options.endDate || end.toISOString().split('T')[0];

    delete form.dataset.editId;
    document.getElementById('announcementModalTitle').textContent = options.title || 'New Church Template Announcement';
    updateAnnouncementImagePreview();
    openModal('announcementModal');
}

async function useChurchAnnouncementTemplate() {
    let templateContent = '';

    try {
        const response = await fetch(CHURCH_ANNOUNCEMENT_TEMPLATE_FILE);
        if (response.ok) {
            templateContent = await response.text();
        }
    } catch (error) {
        console.warn('Could not load church announcement template file.', error);
    }

    populateAnnouncementFormFromTemplate({
        ...CHURCH_ANNOUNCEMENT_TEMPLATE,
        content: templateContent
    }, {
        title: 'New Church Template Announcement'
    });
}

function getAnnouncementFormState() {
    const title = document.getElementById('announcementTitle')?.value || '';
    const content = document.getElementById('announcementContent')?.value || '';
    const priority = document.getElementById('announcementPriority')?.value || 'normal';
    const imageUrl = document.getElementById('announcementImageUrl')?.value || '';
    const assetName = document.getElementById('announcementAssetName')?.value || '';
    const assetType = document.getElementById('announcementAssetType')?.value || '';
    const startDate = document.getElementById('announcementStartDate')?.value || '';
    const endDate = document.getElementById('announcementEndDate')?.value || '';
    return { title, content, priority, imageUrl, assetName, assetType, startDate, endDate };
}

function saveCurrentAnnouncementAsTemplate() {
    const state = getAnnouncementFormState();
    if (!state.title.trim() || !state.content.trim()) {
        showNotification('Add at least title and content before saving reusable template.', 'warning');
        return;
    }

    const payload = {
        ...state,
        savedAt: new Date().toISOString()
    };

    localStorage.setItem(REUSABLE_ANNOUNCEMENT_TEMPLATE_KEY, JSON.stringify(payload));
    showNotification('Reusable announcement template saved. Use "Use Saved Template" anytime.', 'success');
}

function applyReusableAnnouncementTemplate() {
    const raw = localStorage.getItem(REUSABLE_ANNOUNCEMENT_TEMPLATE_KEY);
    if (!raw) {
        showNotification('No reusable template saved yet. Open announcement modal and click "Save As Reusable Template".', 'warning');
        return;
    }

    let tpl;
    try {
        tpl = JSON.parse(raw);
    } catch (error) {
        console.error('Invalid saved template payload:', error);
        showNotification('Saved template is invalid. Please save it again.', 'error');
        return;
    }

    const today = new Date();
    const end = new Date(today);
    end.setDate(end.getDate() + 7);

    populateAnnouncementFormFromTemplate(tpl, {
        title: 'Reusable Template Announcement',
        startDate: today.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
    });
}

function initializeAnnouncementImageInput() {
    updateAnnouncementImagePreview();
}

function updateAnnouncementImagePreview() {
    const input = document.getElementById('announcementImageUrl');
    const preview = document.getElementById('announcementTemplatePreview');
    const img = document.getElementById('announcementTemplatePreviewImg');
    const fileInfo = document.getElementById('announcementTemplateFileInfo');
    const assetType = document.getElementById('announcementAssetType')?.value || '';
    const assetName = document.getElementById('announcementAssetName')?.value || '';
    if (!input || !preview || !img || !fileInfo) return;

    const value = (input.value || '').trim();
    if (!value) {
        preview.style.display = 'none';
        img.removeAttribute('src');
        img.style.display = 'none';
        fileInfo.style.display = 'none';
        return;
    }

    if (isImageAsset(value, assetType)) {
        img.src = value;
        img.style.display = 'block';
        fileInfo.style.display = 'none';
    } else {
        img.removeAttribute('src');
        img.style.display = 'none';
        fileInfo.style.display = 'block';
        fileInfo.innerHTML = `<i class="fas fa-file-alt"></i> Attached template file: <strong>${escapeHtml(assetName || 'custom-template')}</strong><br><small>${escapeHtml(assetType || 'unknown type')} - this file will be stored with the announcement.</small>`;
    }
    preview.style.display = 'block';
}

function handleAnnouncementTemplateUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('Template file loaded. Non-image files will be attached and accessible from the announcement card.', 'info');
    }

    if (file.size > 8 * 1024 * 1024) {
        showNotification('File is too large. Please use a file under 8MB.', 'error');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(loadEvent) {
        const imageData = loadEvent.target.result;
        const input = document.getElementById('announcementImageUrl');
        if (input) {
            input.value = imageData;
        }
        if (document.getElementById('announcementAssetName')) document.getElementById('announcementAssetName').value = file.name || '';
        if (document.getElementById('announcementAssetType')) document.getElementById('announcementAssetType').value = file.type || '';
        updateAnnouncementImagePreview();
        showNotification('Template file loaded. Publish to save it to this announcement.', 'success');
    };
    reader.readAsDataURL(file);
}

function isImageAsset(url, mimeType) {
    if (mimeType && mimeType.startsWith('image/')) return true;
    if (!url) return false;
    if (url.startsWith('data:image/')) return true;
    return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url);
}

function renderAnnouncementContent(content) {
    if (!content) return '<p style="margin:0;color:var(--text-light);">No content provided.</p>';

    if (String(content).includes('church-template-flyer')) {
        return `<div class="announcement-rendered-template">${content}</div>`;
    }

    return `<div class="announcement-text">${escapeHtml(content).replace(/\n/g, '<br>')}</div>`;
}

function renderAnnouncementAsset(a) {
    if (!a.imageUrl) return '';

    if (isImageAsset(a.imageUrl, a.assetType)) {
        return `<div class="announcement-media"><img src="${a.imageUrl}" alt="Announcement image" loading="lazy"></div>`;
    }

    const name = a.assetName || 'Announcement template';
    const type = a.assetType || 'file';
    return `
        <div class="announcement-attachment">
            <div class="attachment-info">
                <i class="fas fa-file-alt"></i>
                <div>
                    <strong>${escapeHtml(name)}</strong>
                    <p>${escapeHtml(type)}</p>
                </div>
            </div>
            <a class="btn-secondary btn-sm" href="${a.imageUrl}" target="_blank" download="${escapeHtml(name)}">
                <i class="fas fa-download"></i> Open Template
            </a>
        </div>`;
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ── Utilities ──────────────────────────────────────────────

function formatDate(s) {
    if (!s) return '-';
    return new Date(s).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
}

// Inline styles
const styleEl = document.createElement('style');
styleEl.textContent = `
.messages-list{display:flex;flex-direction:column;gap:1rem;}
.message-item{background:var(--bg-white);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem;display:flex;align-items:center;gap:1.5rem;transition:var(--transition);}
.message-item:hover{box-shadow:var(--shadow-md);}
.message-icon{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--primary) 0%,var(--primary-light) 100%);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.25rem;flex-shrink:0;}
.message-details{flex:1;}.message-details h4{font-size:1.1rem;color:var(--text-dark);margin-bottom:.5rem;}
.message-meta{display:flex;gap:1.5rem;flex-wrap:wrap;}.message-meta span{color:var(--text-light);font-size:.85rem;display:flex;align-items:center;gap:.5rem;}
.message-status{flex-shrink:0;}.message-actions{display:flex;gap:.5rem;flex-shrink:0;}
.announcements-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;}
.announcement-card{background:var(--bg-white);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem;border-left:4px solid var(--primary);transition:var(--transition);}
.announcement-media{margin:-1.5rem -1.5rem 1rem -1.5rem;border-radius:var(--radius-lg) var(--radius-lg) 0 0;overflow:hidden;max-height:170px;}
.announcement-media img{width:100%;height:230px;object-fit:contain;display:block;background:#0f172a;}
.announcement-attachment{margin-bottom:1rem;padding:0.75rem;border:1px solid #dbe3f0;border-radius:8px;background:#f8fafc;display:flex;align-items:center;justify-content:space-between;gap:0.75rem;}
.attachment-info{display:flex;align-items:center;gap:0.6rem;color:#334155;min-width:0;}
.attachment-info i{color:var(--primary);}
.attachment-info p{margin:0;color:#64748b;font-size:.8rem;}
.announcement-card.priority-high{border-left-color:var(--danger);}.announcement-card.priority-urgent{border-left-color:#dc2626;background:#fef2f2;}
.announcement-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md);}
.announcement-header{display:flex;justify-content:space-between;margin-bottom:1rem;}
.priority-badge{padding:.25rem .75rem;border-radius:12px;font-size:.75rem;font-weight:600;text-transform:uppercase;}
.priority-badge.normal{background:#dbeafe;color:#0369a1}.priority-badge.high{background:#fef3c7;color:#d97706}.priority-badge.urgent{background:#fee2e2;color:#dc2626}
.status-badge{padding:.25rem .75rem;border-radius:12px;font-size:.75rem;font-weight:600;}
.status-badge.active{background:#d1fae5;color:var(--success)}.status-badge.inactive{background:#f1f5f9;color:#64748b}
.announcement-card h3{font-size:1.1rem;color:var(--text-dark);margin-bottom:.75rem;}
.announcement-card p{color:var(--text-light);line-height:1.6;margin-bottom:1rem;}
.announcement-dates{margin-bottom:1rem;padding-top:1rem;border-top:1px solid var(--border-color);}
.announcement-dates span{color:var(--text-light);font-size:.85rem;display:flex;align-items:center;gap:.5rem;}
.announcement-actions{display:flex;gap:.5rem;align-items:center;}.announcement-actions .btn-secondary{flex:1;}
.templates-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.5rem;}
.template-card{background:var(--bg-white);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:1.5rem;text-align:center;transition:var(--transition);}
.template-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md);}
.template-icon{width:60px;height:60px;border-radius:var(--radius-md);background:linear-gradient(135deg,var(--primary) 0%,var(--primary-light) 100%);display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;margin:0 auto 1rem;}
.template-card h3{font-size:1.1rem;color:var(--text-dark);margin-bottom:.5rem;}
.template-category{color:var(--primary);font-weight:600;font-size:.9rem;margin-bottom:.5rem;}
.template-actions{padding-top:1rem;border-top:1px solid var(--border-color);}
.template-actions .btn-secondary{width:100%;justify-content:center;}
@media(max-width:768px){.message-item{flex-direction:column;text-align:center;}.message-meta{flex-direction:column;gap:.5rem;}.announcements-grid,.templates-grid{grid-template-columns:1fr;}}
`;
document.head.appendChild(styleEl);

window.filterMessages               = filterMessages;
window.viewMessage                  = viewMessage;
window.duplicateMessage             = duplicateMessage;
window.confirmDeleteMessage         = confirmDeleteMessage;
window.saveAsDraft                  = saveAsDraft;
window.useTemplate                  = useTemplate;
window.useChurchAnnouncementTemplate = useChurchAnnouncementTemplate;
window.applyReusableAnnouncementTemplate = applyReusableAnnouncementTemplate;
window.saveCurrentAnnouncementAsTemplate = saveCurrentAnnouncementAsTemplate;
window.setDefaultAnnouncementImage = setDefaultAnnouncementImage;
window.handleAnnouncementTemplateUpload = handleAnnouncementTemplateUpload;
window.updateAnnouncementImagePreview = updateAnnouncementImagePreview;
window.openEditAnnouncementModal    = openEditAnnouncementModal;
window.confirmDeleteAnnouncement    = confirmDeleteAnnouncement;
