// ============================================
// SUPABASE — COMMUNICATIONS DATA OPERATIONS
// ============================================

console.log('✅ Supabase communications operations loaded');

// ── Messages ───────────────────────────────────────────────

async function getMessages() {
    try {
        const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error('Error loading messages:', e);
        showNotification('Error loading messages', 'error');
        return [];
    }
}

async function saveMessage(msg) {
    try {
        const db = {
            subject:        msg.subject,
            body:           msg.body || null,
            message_type:   msg.messageType || 'email',
            recipient_group: msg.recipientGroup || 'all',
            priority:       msg.priority || 'normal',
            status:         msg.status || 'sent',
            sent_at:        msg.status === 'sent' ? new Date().toISOString() : null,
            scheduled_at:   msg.scheduledAt || null,
            open_rate:      msg.openRate || 0
        };

        if (msg.id) {
            const { data, error } = await supabase.from('messages').update(db).eq('id', msg.id).select();
            if (error) throw error;
            return data[0];
        } else {
            const { data, error } = await supabase.from('messages').insert([db]).select();
            if (error) throw error;
            return data[0];
        }
    } catch (e) {
        console.error('Error saving message:', e);
        showNotification('Error saving message: ' + e.message, 'error');
        throw e;
    }
}

async function deleteMessage(id) {
    try {
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error deleting message:', e);
        showNotification('Error deleting message', 'error');
        return false;
    }
}

function convertMessageFromDB(m) {
    return {
        id:             m.id,
        subject:        m.subject,
        body:           m.body,
        messageType:    m.message_type,
        recipientGroup: m.recipient_group,
        priority:       m.priority,
        status:         m.status,
        sentAt:         m.sent_at,
        scheduledAt:    m.scheduled_at,
        openRate:       m.open_rate || 0,
        date:           m.sent_at || m.created_at
    };
}

// ── Announcements ──────────────────────────────────────────

async function getAnnouncements() {
    try {
        const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error('Error loading announcements:', e);
        showNotification('Error loading announcements', 'error');
        return [];
    }
}

async function saveAnnouncement(ann) {
    const basic = {
        title:      ann.title,
        content:    ann.content,
        priority:   ann.priority || 'normal',
        start_date: ann.startDate || null,
        end_date:   ann.endDate   || null,
        is_active:  ann.isActive !== undefined ? ann.isActive : true
    };

    const withImage = {
        ...basic,
        image_url: ann.imageUrl || null
    };

    async function doSave(payload) {
        if (ann.id) {
            const { data, error } = await supabase.from('announcements').update(payload).eq('id', ann.id).select();
            if (error) throw error;
            return data[0];
        }
        const { data, error } = await supabase.from('announcements').insert([payload]).select();
        if (error) throw error;
        return data[0];
    }

    try {
        return await doSave(withImage);
    } catch (e) {
        // Fallback for older schema without image_url
        if (e.code === '42703' || (e.message && e.message.toLowerCase().includes('image_url'))) {
            console.warn('announcements.image_url missing, saving without image_url field');
            return await doSave(basic);
        }
        console.error('Error saving announcement:', e);
        showNotification('Error saving announcement: ' + e.message, 'error');
        throw e;
    }
}

async function deleteAnnouncement(id) {
    try {
        const { error } = await supabase.from('announcements').delete().eq('id', id);
        if (error) throw error;
        return true;
    } catch (e) {
        console.error('Error deleting announcement:', e);
        showNotification('Error deleting announcement', 'error');
        return false;
    }
}

function convertAnnouncementFromDB(a) {
    return {
        id:        a.id,
        title:     a.title,
        content:   a.content,
        imageUrl:  a.image_url || null,
        priority:  a.priority,
        startDate: a.start_date,
        endDate:   a.end_date,
        isActive:  a.is_active,
        status:    a.is_active ? 'active' : 'inactive'
    };
}
