// ============================================
// SUPABASE DATA OPERATIONS
// All database CRUD operations for the church platform
// ============================================

// Ensure supabase client is available
if (typeof supabase === 'undefined') {
    console.error('❌ Supabase client not initialized! Make sure supabase-config.js loaded first.');
    throw new Error('Supabase client not available');
}

console.log('✅ Supabase data operations loaded');

/* ============================================ */
/* MEMBERS DATA OPERATIONS */
/* ============================================ */

// Get all members
async function getMembersData() {
    try {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log('✅ Loaded members from Supabase:', data.length);
        return data || [];
    } catch (error) {
        console.error('❌ Error loading members:', error);
        showNotification('Error loading members', 'error');
        return [];
    }
}

// Save/Update member
async function saveMember(member) {
    try {
        // Convert firstName/lastName to first_name/last_name for database
        const dbMember = {
            first_name: member.firstName,
            last_name: member.lastName,
            email: member.email,
            phone: member.phone,
            join_date: member.joinDate,
            ministry: member.ministry,
            status: member.status,
            photo: member.photo
        };

        if (member.id) {
            // Update existing
            const { data, error } = await supabase
                .from('members')
                .update(dbMember)
                .eq('id', member.id)
                .select();
            
            if (error) throw error;
            console.log('✅ Member updated:', data);
            return data[0];
        } else {
            // Insert new
            const { data, error } = await supabase
                .from('members')
                .insert([dbMember])
                .select();
            
            if (error) throw error;
            console.log('✅ Member added:', data);
            return data[0];
        }
    } catch (error) {
        console.error('❌ Error saving member:', error);
        showNotification('Error saving member: ' + error.message, 'error');
        throw error;
    }
}

// Delete member
async function deleteMember(id) {
    try {
        const { error } = await supabase
            .from('members')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        console.log('✅ Member deleted:', id);
        return true;
    } catch (error) {
        console.error('❌ Error deleting member:', error);
        showNotification('Error deleting member', 'error');
        return false;
    }
}

/* ============================================ */
/* STAFF DATA OPERATIONS */
/* ============================================ */

// Get all staff
async function getStaffData() {
    try {
        const { data, error } = await supabase
            .from('staff')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log('✅ Loaded staff from Supabase:', data.length);
        return data || [];
    } catch (error) {
        console.error('❌ Error loading staff:', error);
        showNotification('Error loading staff', 'error');
        return [];
    }
}

// Save/Update staff
async function saveStaff(staffMember) {
    try {
        const dbStaff = {
            name: staffMember.name,
            email: staffMember.email,
            phone: staffMember.phone,
            role: staffMember.role,
            department: staffMember.department,
            start_date: staffMember.startDate,
            employment_type: staffMember.employmentType,
            bio: staffMember.bio,
            photo: staffMember.photo
        };

        if (staffMember.id) {
            // Update existing
            const { data, error } = await supabase
                .from('staff')
                .update(dbStaff)
                .eq('id', staffMember.id)
                .select();
            
            if (error) throw error;
            console.log('✅ Staff updated:', data);
            return data[0];
        } else {
            // Insert new
            const { data, error } = await supabase
                .from('staff')
                .insert([dbStaff])
                .select();
            
            if (error) throw error;
            console.log('✅ Staff added:', data);
            return data[0];
        }
    } catch (error) {
        console.error('❌ Error saving staff:', error);
        showNotification('Error saving staff: ' + error.message, 'error');
        throw error;
    }
}

// Delete staff
async function deleteStaff(id) {
    try {
        const { error } = await supabase
            .from('staff')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        console.log('✅ Staff deleted:', id);
        return true;
    } catch (error) {
        console.error('❌ Error deleting staff:', error);
        showNotification('Error deleting staff', 'error');
        return false;
    }
}

/* ============================================ */
/* DONATIONS DATA OPERATIONS */
/* ============================================ */

// Get all donations
async function getDonationsData() {
    try {
        const { data, error } = await supabase
            .from('donations')
            .select('*')
            .order('date', { ascending: false });
        
        if (error) throw error;
        
        console.log('✅ Loaded donations from Supabase:', data.length);
        return data || [];
    } catch (error) {
        console.error('❌ Error loading donations:', error);
        showNotification('Error loading donations', 'error');
        return [];
    }
}

// Save/Update donation
async function saveDonation(donation) {
    try {
        const dbDonation = {
            date: donation.date,
            amount: parseFloat(donation.amount),
            currency: donation.currency || 'DOP',
            category: donation.category,
            payment_method: donation.paymentMethod,
            donation_type: donation.donationType,
            recurring_frequency: donation.recurringFrequency,
            is_anonymous: donation.isAnonymous,
            donor_name: donation.donorName,
            donor_email: donation.donorEmail,
            donor_phone: donation.donorPhone,
            member_id: donation.memberId,
            transaction_id: donation.transactionId,
            status: donation.status,
            notes: donation.notes
        };

        if (donation.id) {
            // Update existing
            const { data, error } = await supabase
                .from('donations')
                .update(dbDonation)
                .eq('id', donation.id)
                .select();
            
            if (error) throw error;
            console.log('✅ Donation updated:', data);
            return data[0];
        } else {
            // Insert new
            const { data, error } = await supabase
                .from('donations')
                .insert([dbDonation])
                .select();
            
            if (error) throw error;
            console.log('✅ Donation added:', data);
            return data[0];
        }
    } catch (error) {
        console.error('❌ Error saving donation:', error);
        showNotification('Error saving donation: ' + error.message, 'error');
        throw error;
    }
}

// Delete donation
async function deleteDonation(id) {
    try {
        const { error } = await supabase
            .from('donations')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        console.log('✅ Donation deleted:', id);
        return true;
    } catch (error) {
        console.error('❌ Error deleting donation:', error);
        showNotification('Error deleting donation', 'error');
        return false;
    }
}

/* ============================================ */
/* HELPER FUNCTIONS */
/* ============================================ */

// Convert database member to UI format
function convertMemberFromDB(dbMember) {
    return {
        id: dbMember.id,
        firstName: dbMember.first_name,
        lastName: dbMember.last_name,
        email: dbMember.email,
        phone: dbMember.phone,
        joinDate: dbMember.join_date,
        ministry: dbMember.ministry,
        status: dbMember.status,
        photo: dbMember.photo
    };
}

// Convert database staff to UI format
function convertStaffFromDB(dbStaff) {
    return {
        id: dbStaff.id,
        name: dbStaff.name,
        email: dbStaff.email,
        phone: dbStaff.phone,
        role: dbStaff.role,
        department: dbStaff.department,
        startDate: dbStaff.start_date,
        employmentType: dbStaff.employment_type,
        bio: dbStaff.bio,
        photo: dbStaff.photo
    };
}

// Convert database donation to UI format
function convertDonationFromDB(dbDonation) {
    return {
        id: dbDonation.id,
        date: dbDonation.date,
        amount: parseFloat(dbDonation.amount),
        currency: dbDonation.currency,
        category: dbDonation.category,
        paymentMethod: dbDonation.payment_method,
        donationType: dbDonation.donation_type,
        recurringFrequency: dbDonation.recurring_frequency,
        isAnonymous: dbDonation.is_anonymous,
        donorName: dbDonation.donor_name,
        donorEmail: dbDonation.donor_email,
        donorPhone: dbDonation.donor_phone,
        memberId: dbDonation.member_id,
        transactionId: dbDonation.transaction_id,
        status: dbDonation.status,
        notes: dbDonation.notes
    };
}

console.log('✅ Supabase data operations loaded');
