// ============================================
// SUPABASE AUTHORIZED USERS OPERATIONS
// ============================================

if (typeof supabase === 'undefined') {
    console.error('Supabase client not initialized for auth users operations');
}

async function sha256Hex(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getAuthorizedUsers() {
    const { data, error } = await supabase
        .from('authorized_users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

async function saveAuthorizedUser(user) {
    const nowIso = new Date().toISOString();
    const payload = {
        username: user.username,
        full_name: user.fullName,
        role: user.role,
        department: user.department,
        access_level: user.accessLevel,
        is_active: user.isActive,
        updated_at: nowIso
    };

    if (user.password && user.password.trim()) {
        payload.password_hash = await sha256Hex(user.password.trim());
    }

    if (user.id) {
        const { data, error } = await supabase
            .from('authorized_users')
            .update(payload)
            .eq('id', user.id)
            .select();
        if (error) throw error;
        return data[0];
    }

    if (!payload.password_hash) {
        throw new Error('Password is required for new users');
    }

    const { data, error } = await supabase
        .from('authorized_users')
        .insert([payload])
        .select();

    if (error) throw error;
    return data[0];
}

async function deleteAuthorizedUser(id) {
    const { error } = await supabase
        .from('authorized_users')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

async function updateAuthorizedUserLastLogin(id) {
    const { error } = await supabase
        .from('authorized_users')
        .update({ last_login: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw error;
    return true;
}

async function validateAuthorizedUser(username, password, department) {
    const normalized = (username || '').trim().toLowerCase();
    const passHash = await sha256Hex(password || '');

    const { data, error } = await supabase
        .from('authorized_users')
        .select('*')
        .eq('username', normalized)
        .eq('is_active', true)
        .limit(1);

    if (error) throw error;
    if (!data || !data.length) return null;

    const user = data[0];
    const userDepartment = (user.department || '').toLowerCase();
    const selectedDepartment = (department || '').toLowerCase();
    const departmentAllowed = userDepartment === 'all' || userDepartment === selectedDepartment;

    if (user.password_hash !== passHash || !departmentAllowed) return null;
    return user;
}

function convertAuthorizedUserFromDB(dbUser) {
    return {
        id: dbUser.id,
        username: dbUser.username,
        fullName: dbUser.full_name,
        role: dbUser.role,
        department: dbUser.department,
        accessLevel: dbUser.access_level,
        isActive: dbUser.is_active,
        lastLogin: dbUser.last_login,
        createdAt: dbUser.created_at
    };
}
