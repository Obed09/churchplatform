// ============================================
// ADMINISTRATION DEPARTMENT
// ============================================

// Sample members data
const sampleMembers = [
    {
        id: 1,
        firstName: 'Jean',
        lastName: 'Baptiste',
        email: 'jean.baptiste@email.com',
        phone: '829-123-4567',
        joinDate: '2024-01-15',
        ministry: 'Worship Team',
        status: 'Active',
        photo: null
    },
    {
        id: 2,
        firstName: 'Marie',
        lastName: 'Laurent',
        email: 'marie.laurent@email.com',
        phone: '829-234-5678',
        joinDate: '2025-03-20',
        ministry: 'Children\'s Ministry',
        status: 'Active',
        photo: null
    },
    {
        id: 3,
        firstName: 'Pierre',
        lastName: 'Dubois',
        email: 'pierre.dubois@email.com',
        phone: '829-345-6789',
        joinDate: '2023-06-10',
        ministry: 'Youth Ministry',
        status: 'Active',
        photo: null
    },
    {
        id: 4,
        firstName: 'Sophie',
        lastName: 'Martin',
        email: 'sophie.martin@email.com',
        phone: '829-456-7890',
        joinDate: '2024-11-05',
        ministry: 'Hospitality',
        status: 'Active',
        photo: null
    },
    {
        id: 5,
        firstName: 'Andre',
        lastName: 'Joseph',
        email: 'andre.joseph@email.com',
        phone: '829-567-8901',
        joinDate: '2022-08-22',
        ministry: 'Tech Team',
        status: 'Inactive',
        photo: null
    }
];

// Sample staff data
const sampleStaff = [
    {
        id: 1,
        name: 'Pastor Emmanuel Dieujuste',
        role: 'Senior Pastor',
        department: 'Pastoral Team',
        email: 'pastor@tabernacle.church',
        phone: '829-377-1099',
        startDate: '2020-01-01',
        employmentType: 'full-time',
        bio: 'Leading the church with passion and dedication',
        photo: null
    },
    {
        id: 2,
        name: 'Marie-Claire Joseph',
        role: 'Finance Director',
        department: 'Finance',
        email: 'finance@tabernacle.church',
        phone: '829-303-0241',
        startDate: '2021-03-15',
        employmentType: 'full-time',
        bio: 'Managing church finances and budget planning',
        photo: null
    },
    {
        id: 3,
        name: 'Jacques Laurent',
        role: 'Worship Leader',
        department: 'Worship',
        email: 'worship@tabernacle.church',
        phone: '829-123-4567',
        startDate: '2019-06-01',
        employmentType: 'part-time',
        bio: 'Leading worship and music ministry',
        photo: null
    },
    {
        id: 4,
        name: 'Sophie Martin',
        role: 'Children\'s Director',
        department: 'Children\'s Ministry',
        email: 'children@tabernacle.church',
        phone: '829-234-5678',
        startDate: '2022-09-01',
        employmentType: 'full-time',
        bio: 'Nurturing the next generation',
        photo: null
    }
];

// Get staff from localStorage or use sample data
function getStaffData() {
    const stored = localStorage.getItem('churchStaff');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            console.log('✅ Loaded staff from localStorage:', data.length, 'staff members');
            return data;
        } catch (e) {
            console.error('❌ Error parsing staff data:', e);
            return sampleStaff;
        }
    } else {
        console.log('⚠️ No staff in localStorage, using sample data');
        localStorage.setItem('churchStaff', JSON.stringify(sampleStaff));
        return sampleStaff;
    }
}

// Save staff to localStorage
function saveStaffData(staffData) {
    try {
        localStorage.setItem('churchStaff', JSON.stringify(staffData));
        console.log('✅ Saved staff to localStorage:', staffData.length, 'staff members');
        console.log('Staff data:', staffData);
    } catch (e) {
        console.error('❌ Error saving staff:', e);
        alert('Error saving staff member. Please try again.');
    }
}

// Get members from localStorage or use sample data
function getMembersData() {
    const stored = localStorage.getItem('churchMembers');
    if (stored) {
        const members = JSON.parse(stored);
        // Sync with sampleMembers array
        sampleMembers.length = 0;
        sampleMembers.push(...members);
        return members;
    } else {
        localStorage.setItem('churchMembers', JSON.stringify(sampleMembers));
        return sampleMembers;
    }
}

// Save members to localStorage
function saveMembersData(membersData) {
    localStorage.setItem('churchMembers', JSON.stringify(membersData));
    // Sync with sampleMembers array
    sampleMembers.length = 0;
    sampleMembers.push(...membersData);
}

// Initialize administration page
document.addEventListener('DOMContentLoaded', function() {
    // Load members from localStorage
    getMembersData();
    
    loadAdminStats();
    renderMembersTable();
    renderStaffGrid();
    renderDonationsTable();
    initializeMemberForm();
    initializeStaffForm();
    initializeDonationForm();
});

// Load admin statistics
function loadAdminStats() {
    const members = getMembersData();
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'Active').length;
    const staffCount = getStaffData().length;
    const volunteerCount = 45; // Sample count
    
    document.getElementById('totalMembers').textContent = totalMembers;
    document.getElementById('activeMembers').textContent = activeMembers;
    document.getElementById('staffCount').textContent = staffCount;
    document.getElementById('volunteerCount').textContent = volunteerCount;
}

// Render members table
function renderMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = sampleMembers.map(member => {
        const photoDisplay = member.photo 
            ? `<img src="${member.photo}" alt="${member.firstName}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">`
            : `<div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${member.firstName.charAt(0)}${member.lastName.charAt(0)}</div>`;
        
        return `
            <tr>
                <td>${photoDisplay}</td>
                <td><strong>${member.firstName} ${member.lastName}</strong></td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${formatDate(member.joinDate)}</td>
                <td><span class="badge badge-info">${member.ministry}</span></td>
                <td><span class="badge badge-${member.status === 'Active' ? 'success' : 'secondary'}">${member.status}</span></td>
                <td class="table-actions">
                    <button class="action-btn" onclick="viewMember(${member.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editMember(${member.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteMember(${member.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render staff grid
function renderStaffGrid() {
    const staffGrid = document.getElementById('staffGrid');
    if (!staffGrid) return;
    
    const staffData = getStaffData();
    
    if (staffData.length === 0) {
        staffGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-tie"></i>
                <h3>No Staff Members Yet</h3>
                <p>Click "Add Staff" to add your first staff member</p>
            </div>
        `;
        return;
    }
    
    staffGrid.innerHTML = staffData.map(staff => {
        const avatarContent = staff.photo 
            ? `<img src="${staff.photo}" alt="${staff.name}">`
            : `<i class="fas fa-user-tie"></i>`;
        
        return `
            <div class="staff-card">
                <div class="staff-avatar">
                    ${avatarContent}
                </div>
                <h3>${staff.name}</h3>
                <p class="staff-role">${staff.role}</p>
                <p class="staff-department"><i class="fas fa-building"></i> ${staff.department}</p>
                <div class="staff-contact">
                    <p><i class="fas fa-envelope"></i> ${staff.email}</p>
                    <p><i class="fas fa-phone"></i> ${staff.phone}</p>
                </div>
                <div class="staff-actions">
                    <button class="btn-secondary btn-sm" onclick="contactStaff('${staff.email}')" title="Contact">
                        <i class="fas fa-envelope"></i> Contact
                    </button>
                    <button class="btn-primary btn-sm" onclick="editStaff(${staff.id})" title="Edit">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-danger btn-sm" onclick="deleteStaff(${staff.id})" title="Delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Initialize staff form
function initializeStaffForm() {
    const form = document.getElementById('staffForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const staffId = document.getElementById('staffId').value;
        const staffData = getStaffData();
        
        const staffMember = {
            id: staffId ? parseInt(staffId) : Date.now(),
            name: document.getElementById('staffName').value,
            email: document.getElementById('staffEmail').value,
            phone: document.getElementById('staffPhone').value,
            role: document.getElementById('staffRole').value,
            department: document.getElementById('staffDepartment').value,
            startDate: document.getElementById('staffStartDate').value,
            employmentType: document.getElementById('staffEmploymentType').value,
            bio: document.getElementById('staffBio').value,
            photo: document.getElementById('staffPhotoData').value || null
        };
        
        if (staffId) {
            // Update existing staff
            const index = staffData.findIndex(s => s.id === parseInt(staffId));
            if (index !== -1) {
                staffData[index] = staffMember;
                showNotification('Staff member updated successfully!', 'success');
            }
        } else {
            // Add new staff
            staffData.push(staffMember);
            console.log('➕ Adding new staff member:', staffMember);
            showNotification(`${staffMember.name} added successfully!`, 'success');
        }
        
        saveStaffData(staffData);
        console.log('📊 Total staff after save:', staffData.length);
        closeModal('staffModal');
        form.reset();
        document.getElementById('staffPhotoData').value = '';
        resetStaffPhotoPreview();
        renderStaffGrid();
        loadAdminStats();
    });
}

// Edit staff member
function editStaff(id) {
    const staffData = getStaffData();
    const staff = staffData.find(s => s.id === id);
    
    if (!staff) {
        showNotification('Staff member not found', 'error');
        return;
    }
    
    // Populate form with staff data
    document.getElementById('staffId').value = staff.id;
    document.getElementById('staffName').value = staff.name;
    document.getElementById('staffEmail').value = staff.email;
    document.getElementById('staffPhone').value = staff.phone;
    document.getElementById('staffRole').value = staff.role;
    document.getElementById('staffDepartment').value = staff.department;
    document.getElementById('staffStartDate').value = staff.startDate || '';
    document.getElementById('staffEmploymentType').value = staff.employmentType || 'full-time';
    document.getElementById('staffBio').value = staff.bio || '';
    
    // Load photo if exists
    if (staff.photo) {
        document.getElementById('staffPhotoData').value = staff.photo;
        displayStaffPhoto(staff.photo);
    } else {
        resetStaffPhotoPreview();
    }
    
    // Update modal title
    document.getElementById('staffModalTitle').textContent = 'Edit Staff Member';
    document.getElementById('staffSubmitBtn').textContent = 'Update Staff';
    
    openModal('staffModal');
}

// Delete staff member
function deleteStaff(id) {
    const staffData = getStaffData();
    const staff = staffData.find(s => s.id === id);
    
    if (!staff) {
        showNotification('Staff member not found', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to remove ${staff.name} from the staff directory?\\n\\nThis action cannot be undone.`)) {
        const updatedStaff = staffData.filter(s => s.id !== id);
        saveStaffData(updatedStaff);
        showNotification(`${staff.name} removed from staff directory`, 'success');
        renderStaffGrid();
        loadAdminStats();
    }
}

// Reset staff form when opening for new staff
function openStaffModal() {
    document.getElementById('staffForm').reset();
    document.getElementById('staffId').value = '';
    document.getElementById('staffPhotoData').value = '';
    resetStaffPhotoPreview();
    document.getElementById('staffModalTitle').textContent = 'Add New Staff';
    document.getElementById('staffSubmitBtn').textContent = 'Add Staff';
    openModal('staffModal');
}

/* ============================================ */
/* PHOTO UPLOAD FUNCTIONS */
/* ============================================ */

// Staff Photo Functions
function handleStaffPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('Image size must be less than 2MB', 'error');
        event.target.value = '';
        return;
    }
    
    // Validate file type
    if (!file.type.match('image.*')) {
        showNotification('Please select a valid image file', 'error');
        event.target.value = '';
        return;
    }
    
    // Read and convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        document.getElementById('staffPhotoData').value = photoData;
        displayStaffPhoto(photoData);
    };
    reader.readAsDataURL(file);
}

function displayStaffPhoto(photoData) {
    const preview = document.getElementById('staffPhotoPreview');
    preview.innerHTML = `<img src="${photoData}" alt="Staff Photo">`;
    preview.classList.add('has-image');
    document.getElementById('removeStaffPhotoBtn').style.display = 'inline-flex';
}

function resetStaffPhotoPreview() {
    const preview = document.getElementById('staffPhotoPreview');
    preview.innerHTML = `
        <i class="fas fa-user-tie"></i>
        <span>Upload Photo</span>
    `;
    preview.classList.remove('has-image');
    document.getElementById('staffPhotoInput').value = '';
    document.getElementById('removeStaffPhotoBtn').style.display = 'none';
}

function removeStaffPhoto() {
    document.getElementById('staffPhotoData').value = '';
    resetStaffPhotoPreview();
    showNotification('Photo removed', 'info');
}

// Member Photo Functions
function handleMemberPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
        showNotification('Image size must be less than 2MB', 'error');
        event.target.value = '';
        return;
    }
    
    if (!file.type.match('image.*')) {
        showNotification('Please select a valid image file', 'error');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        document.getElementById('memberPhotoData').value = photoData;
        displayMemberPhoto(photoData);
    };
    reader.readAsDataURL(file);
}

function displayMemberPhoto(photoData) {
    const preview = document.getElementById('memberPhotoPreview');
    preview.innerHTML = `<img src="${photoData}" alt="Member Photo">`;
    preview.classList.add('has-image');
    document.getElementById('removeMemberPhotoBtn').style.display = 'inline-flex';
}

function resetMemberPhotoPreview() {
    const preview = document.getElementById('memberPhotoPreview');
    preview.innerHTML = `
        <i class="fas fa-user"></i>
        <span>Upload Photo</span>
    `;
    preview.classList.remove('has-image');
    document.getElementById('memberPhotoInput').value = '';
    document.getElementById('removeMemberPhotoBtn').style.display = 'none';
}

function removeMemberPhoto() {
    document.getElementById('memberPhotoData').value = '';
    resetMemberPhotoPreview();
    showNotification('Photo removed', 'info');
}

// Visitor Photo Functions
function handleVisitorPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
        showNotification('Image size must be less than 2MB', 'error');
        event.target.value = '';
        return;
    }
    
    if (!file.type.match('image.*')) {
        showNotification('Please select a valid image file', 'error');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        document.getElementById('visitorPhotoData').value = photoData;
        displayVisitorPhoto(photoData);
    };
    reader.readAsDataURL(file);
}

function displayVisitorPhoto(photoData) {
    const preview = document.getElementById('visitorPhotoPreview');
    preview.innerHTML = `<img src="${photoData}" alt="Visitor Photo">`;
    preview.classList.add('has-image');
    document.getElementById('removeVisitorPhotoBtn').style.display = 'inline-flex';
}

function resetVisitorPhotoPreview() {
    const preview = document.getElementById('visitorPhotoPreview');
    preview.innerHTML = `
        <i class="fas fa-user-friends"></i>
        <span>Upload Photo</span>
    `;
    preview.classList.remove('has-image');
    document.getElementById('visitorPhotoInput').value = '';
    document.getElementById('removeVisitorPhotoBtn').style.display = 'none';
}

function removeVisitorPhoto() {
    document.getElementById('visitorPhotoData').value = '';
    resetVisitorPhotoPreview();
    showNotification('Photo removed', 'info');
}

/* ============================================ */
/* END PHOTO UPLOAD FUNCTIONS */
/* ============================================ */

// Initialize member form
function initializeMemberForm() {
    const form = document.getElementById('memberForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const members = getMembersData();
        const editId = form.dataset.editId;
        
        const memberData = {
            firstName: document.getElementById('memberFirstName').value,
            lastName: document.getElementById('memberLastName').value,
            email: document.getElementById('memberEmail').value,
            phone: document.getElementById('memberPhone').value,
            birthDate: document.getElementById('memberBirthdate').value || null,
            gender: document.getElementById('memberGender').value || null,
            address: document.getElementById('memberAddress').value || null,
            joinDate: document.getElementById('memberJoinDate').value,
            ministry: document.getElementById('memberMinistry').value,
            status: 'Active',
            notes: document.getElementById('memberNotes').value || null,
            photo: document.getElementById('memberPhotoData').value || null
        };
        
        if (editId) {
            // Update existing member
            const index = members.findIndex(m => m.id == editId);
            if (index !== -1) {
                members[index] = { ...members[index], ...memberData };
                showNotification(`Member ${memberData.firstName} ${memberData.lastName} updated successfully!`, 'success');
            }
            delete form.dataset.editId;
        } else {
            // Add new member
            const maxId = members.reduce((max, m) => Math.max(max, m.id || 0), 0);
            memberData.id = maxId + 1;
            members.push(memberData);
            showNotification(`Member ${memberData.firstName} ${memberData.lastName} added successfully!`, 'success');
        }
        
        saveMembersData(members);
        
        closeModal('memberModal');
        form.reset();
        resetMemberPhotoPreview();
        
        // Update display
        renderMembersTable();
        loadAdminStats();
    });
}

// Search and filter functions
function searchMembers() {
    const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
    console.log('Searching for:', searchTerm);
    // Implement actual search logic
}

function filterMembers() {
    const filter = document.getElementById('memberFilter').value;
    console.log('Filtering by:', filter);
    // Implement actual filtering logic
}

function filterVolunteers() {
    const filter = document.getElementById('volunteerFilter').value;
    console.log('Filtering volunteers by:', filter);
    // Implement actual filtering logic
}

// Open member modal for adding new member
function openMemberModal() {
    const form = document.getElementById('memberForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
        resetMemberPhotoPreview();
    }
    openModal('memberModal');
}

// Action functions
function viewMember(id) {
    const members = getMembersData();
    const member = members.find(m => m.id === id);
    if (member) {
        alert(`Member Details:\n\nName: ${member.firstName} ${member.lastName}\nEmail: ${member.email}\nPhone: ${member.phone}\nJoined: ${formatDate(member.joinDate)}\nMinistry: ${member.ministry}\nStatus: ${member.status}`);
    }
}

function editMember(id) {
    const members = getMembersData();
    const member = members.find(m => m.id === id);
    if (!member) return;
    
    // Populate form with member data
    document.getElementById('memberFirstName').value = member.firstName;
    document.getElementById('memberLastName').value = member.lastName;
    document.getElementById('memberEmail').value = member.email;
    document.getElementById('memberPhone').value = member.phone;
    document.getElementById('memberBirthdate').value = member.birthDate || '';
    document.getElementById('memberGender').value = member.gender || '';
    document.getElementById('memberAddress').value = member.address || '';
    document.getElementById('memberJoinDate').value = member.joinDate;
    document.getElementById('memberMinistry').value = member.ministry;
    document.getElementById('memberNotes').value = member.notes || '';
    
    // Load photo if exists
    if (member.photo) {
        document.getElementById('memberPhotoData').value = member.photo;
        displayMemberPhoto(member.photo);
    }
    
    // Store the ID for update
    document.getElementById('memberForm').dataset.editId = id;
    
    // Open modal
    openModal('memberModal');
}

function deleteMember(id) {
    if (confirm('Are you sure you want to remove this member?')) {
        const members = getMembersData();
        const updatedMembers = members.filter(m => m.id !== id);
        saveMembersData(updatedMembers);
        
        showNotification('Member removed successfully!', 'success');
        renderMembersTable();
        loadAdminStats();
    }
}

function contactStaff(email) {
    window.location.href = `mailto:${email}`;
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

/* ============================================ */
/* CSV IMPORT FUNCTIONALITY */
/* ============================================ */

let csvParsedData = [];

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.name.endsWith('.csv')) {
        showNotification('Please select a valid CSV file', 'error');
        event.target.value = '';
        return;
    }
    
    // Update file name display
    document.getElementById('csvFileName').textContent = file.name;
    
    // Read and parse CSV
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvText = e.target.result;
        parseCSV(csvText);
    };
    reader.readAsText(file);
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
        showNotification('CSV file is empty or invalid', 'error');
        return;
    }
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    
    // Validate headers
    const requiredHeaders = ['First Name', 'Last Name', 'Email', 'Phone', 'Join Date', 'Ministry', 'Status'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
        showNotification(`Missing required columns: ${missingHeaders.join(', ')}`, 'error');
        return;
    }
    
    // Parse data rows
    csvParsedData = [];
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === 0) continue;
        
        const record = {};
        headers.forEach((header, index) => {
            record[header] = values[index] || '';
        });
        
        // Validate record
        const validation = validateMemberRecord(record, i + 1);
        if (validation.valid) {
            csvParsedData.push(record);
        } else {
            errors.push(...validation.errors);
        }
    }
    
    // Display preview
    if (csvParsedData.length > 0) {
        displayCSVPreview(headers, csvParsedData);
        if (errors.length > 0) {
            displayValidationErrors(errors);
        }
    } else {
        showNotification('No valid records found in CSV file', 'error');
    }
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    
    return result;
}

function validateMemberRecord(record, lineNumber) {
    const errors = [];
    
    // Required fields validation
    if (!record['First Name']) errors.push(`Line ${lineNumber}: First Name is required`);
    if (!record['Last Name']) errors.push(`Line ${lineNumber}: Last Name is required`);
    if (!record['Email']) errors.push(`Line ${lineNumber}: Email is required`);
    if (!record['Phone']) errors.push(`Line ${lineNumber}: Phone is required`);
    if (!record['Join Date']) errors.push(`Line ${lineNumber}: Join Date is required`);
    if (!record['Ministry']) errors.push(`Line ${lineNumber}: Ministry is required`);
    if (!record['Status']) errors.push(`Line ${lineNumber}: Status is required`);
    
    // Email validation
    if (record['Email'] && !record['Email'].includes('@')) {
        errors.push(`Line ${lineNumber}: Invalid email format`);
    }
    
    // Date validation
    if (record['Join Date'] && !isValidDate(record['Join Date'])) {
        errors.push(`Line ${lineNumber}: Invalid Join Date format (use YYYY-MM-DD)`);
    }
    
    // Status validation
    const validStatuses = ['Active', 'Inactive', 'New'];
    if (record['Status'] && !validStatuses.includes(record['Status'])) {
        errors.push(`Line ${lineNumber}: Status must be Active, Inactive, or New`);
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

function displayCSVPreview(headers, data) {
    // Show preview section
    document.getElementById('csvPreviewSection').style.display = 'block';
    document.getElementById('csvImportActions').style.display = 'flex';
    
    // Update record count
    document.getElementById('csvRecordCount').textContent = `${data.length} records`;
    document.getElementById('importCount').textContent = data.length;
    
    // Build preview table
    const thead = document.getElementById('csvPreviewHead');
    const tbody = document.getElementById('csvPreviewBody');
    
    // Create header row
    const headerRow = document.createElement('tr');
    const displayHeaders = ['First Name', 'Last Name', 'Email', 'Phone', 'Join Date', 'Ministry', 'Status'];
    displayHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.innerHTML = '';
    thead.appendChild(headerRow);
    
    // Create data rows (show first 10 for preview)
    tbody.innerHTML = '';
    const previewData = data.slice(0, 10);
    previewData.forEach(record => {
        const row = document.createElement('tr');
        displayHeaders.forEach(header => {
            const td = document.createElement('td');
            td.textContent = record[header] || '';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    
    // Add "and X more" message if there are more records
    if (data.length > 10) {
        const moreRow = document.createElement('tr');
        const moreTd = document.createElement('td');
        moreTd.colSpan = displayHeaders.length;
        moreTd.style.textAlign = 'center';
        moreTd.style.fontStyle = 'italic';
        moreTd.style.color = 'var(--text-light)';
        moreTd.textContent = `... and ${data.length - 10} more records`;
        moreRow.appendChild(moreTd);
        tbody.appendChild(moreRow);
    }
}

function displayValidationErrors(errors) {
    const errorSection = document.getElementById('csvValidationErrors');
    errorSection.style.display = 'block';
    
    errorSection.innerHTML = `
        <h4><i class="fas fa-exclamation-triangle"></i> Validation Errors (${errors.length})</h4>
        <ul>
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
        <p><strong>Note:</strong> Records with errors will be skipped. Only valid records will be imported.</p>
    `;
}

function importCSVData() {
    if (csvParsedData.length === 0) {
        showNotification('No data to import', 'warning');
        return;
    }
    
    // Get existing members from localStorage
    let existingMembers = JSON.parse(localStorage.getItem('churchMembers') || '[]');
    
    // If no existing members, use sample data
    if (existingMembers.length === 0) {
        existingMembers = sampleMembers;
    }
    
    // Find the highest existing ID
    let maxId = existingMembers.reduce((max, member) => Math.max(max, member.id || 0), 0);
    
    // Convert CSV records to member objects
    const newMembers = csvParsedData.map(record => {
        maxId++;
        return {
            id: maxId,
            firstName: record['First Name'],
            lastName: record['Last Name'],
            email: record['Email'],
            phone: record['Phone'],
            joinDate: record['Join Date'],
            ministry: record['Ministry'],
            status: record['Status'],
            birthDate: record['Birth Date'] || null,
            gender: record['Gender'] || null,
            address: record['Address'] || null,
            notes: record['Notes'] || null,
            photo: null
        };
    });
    
    // Add new members to existing members
    const updatedMembers = [...existingMembers, ...newMembers];
    
    // Save to localStorage
    localStorage.setItem('churchMembers', JSON.stringify(updatedMembers));
    
    // Update the global sampleMembers array
    sampleMembers.length = 0;
    sampleMembers.push(...updatedMembers);
    
    // Show success message
    showNotification(`Successfully imported ${newMembers.length} members!`, 'success');
    
    // Close modal and reset
    closeModal('csvImportModal');
    resetCSVImport();
    
    // Refresh the members table
    renderMembersTable();
    loadAdminStats();
}

function resetCSVImport() {
    csvParsedData = [];
    document.getElementById('csvFileInput').value = '';
    document.getElementById('csvFileName').textContent = 'No file selected';
    document.getElementById('csvPreviewSection').style.display = 'none';
    document.getElementById('csvImportActions').style.display = 'none';
    document.getElementById('csvValidationErrors').style.display = 'none';
}

/* ============================================ */
/* END CSV IMPORT FUNCTIONALITY */
/* ============================================ */

/* ============================================ */
/* DONATION MANAGEMENT */
/* ============================================ */

// PayPal Configuration
const PAYPAL_CONFIG = {
    email: 'amorporelcalvario@gmail.com',
    currency: 'DOP',
    currencySymbol: 'RD$',
    environment: 'live'
};

// Sample donation data
const sampleDonations = [
    {
        id: 1,
        date: '2026-06-01',
        donorName: 'Jean Baptiste',
        donorEmail: 'jean.baptiste@email.com',
        donorPhone: '829-123-4567',
        donorAddress: '123 Main St, Santo Domingo',
        memberId: 1,
        category: 'General Fund/Tithes',
        amount: 15000.00,
        method: 'PayPal',
        type: 'recurring',
        frequency: 'monthly',
        status: 'completed',
        transactionId: 'PP-2026060112345',
        isAnonymous: false,
        notes: 'Monthly tithe'
    },
    {
        id: 2,
        date: '2026-06-05',
        donorName: 'Anonymous',
        category: 'Building Fund',
        amount: 30000.00,
        method: 'Cash',
        type: 'one-time',
        status: 'completed',
        isAnonymous: true,
        notes: 'For new sanctuary construction'
    },
    {
        id: 3,
        date: '2026-06-10',
        donorName: 'Marie Laurent',
        donorEmail: 'marie.laurent@email.com',
        donorPhone: '829-234-5678',
        memberId: 2,
        category: 'Missions',
        amount: 7500.00,
        method: 'Bank Transfer',
        type: 'one-time',
        status: 'completed',
        notes: 'Haiti mission trip support'
    },
    {
        id: 4,
        date: '2026-06-12',
        donorName: 'Pierre Dubois',
        donorEmail: 'pierre.dubois@email.com',
        memberId: 3,
        category: 'Youth Ministry',
        amount: 4500.00,
        method: 'PayPal',
        type: 'recurring',
        frequency: 'monthly',
        status: 'completed',
        transactionId: 'PP-2026061212345'
    },
    {
        id: 5,
        date: '2026-06-15',
        donorName: 'Sophie Martin',
        donorEmail: 'sophie.martin@email.com',
        memberId: 4,
        category: 'Special Events',
        amount: 2250.00,
        method: 'Check',
        type: 'one-time',
        status: 'completed',
        notes: 'Summer camp sponsorship'
    }
];

// Get donations from localStorage
function getDonationsData() {
    const stored = localStorage.getItem('churchDonations');
    if (stored) {
        return JSON.parse(stored);
    } else {
        localStorage.setItem('churchDonations', JSON.stringify(sampleDonations));
        return sampleDonations;
    }
}

// Save donations to localStorage
function saveDonationsData(donations) {
    localStorage.setItem('churchDonations', JSON.stringify(donations));
}

// Render donations table
function renderDonationsTable(donations = null) {
    const tbody = document.getElementById('donationsTableBody');
    if (!tbody) return;
    
    const donationsData = donations || getDonationsData();
    
    tbody.innerHTML = donationsData.map(donation => {
        const statusClass = donation.status === 'completed' ? 'success' : 
                           donation.status === 'pending' ? 'warning' : 'danger';
        const typeIcon = donation.type === 'recurring' ? '<i class="fas fa-repeat"></i>' : '<i class="fas fa-hand-holding-usd"></i>';
        
        return `
            <tr>
                <td>${formatDate(donation.date)}</td>
                <td>
                    ${donation.isAnonymous ? '<i class="fas fa-user-secret"></i> Anonymous' : donation.donorName}
                    ${donation.memberId ? '<span class="badge badge-info" style="margin-left: 0.5rem;">Member</span>' : ''}
                </td>
                <td><span class="badge badge-primary">${donation.category}</span></td>
                <td><strong>${PAYPAL_CONFIG.currencySymbol}${donation.amount.toLocaleString('es-DO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong></td>
                <td>${donation.method}</td>
                <td>${typeIcon} ${donation.type === 'recurring' ? `${donation.frequency}` : 'One-time'}</td>
                <td><span class="badge badge-${statusClass}">${donation.status}</span></td>
                <td class="table-actions">
                    <button class="action-btn" onclick="viewDonation(${donation.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editDonation(${donation.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteDonation(${donation.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${!donation.isAnonymous ? `<button class="action-btn" onclick="generateTaxReceipt(${donation.id})" title="Tax Receipt">
                        <i class="fas fa-file-invoice"></i>
                    </button>` : ''}
                </td>
            </tr>
        `;
    }).join('');
    
    updateDonationStats();
}

// Update donation statistics
function updateDonationStats() {
    const donations = getDonationsData();
    
    // Total donations (all time)
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    document.getElementById('totalDonationsAmount').textContent = `${PAYPAL_CONFIG.currencySymbol}${totalAmount.toLocaleString('es-DO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // This month donations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthDonations = donations.filter(d => {
        const donationDate = new Date(d.date);
        return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
    });
    const monthAmount = monthDonations.reduce((sum, d) => sum + d.amount, 0);
    document.getElementById('monthDonationsAmount').textContent = `${PAYPAL_CONFIG.currencySymbol}${monthAmount.toLocaleString('es-DO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // Unique donors
    const uniqueDonors = new Set(donations.map(d => d.donorName));
    document.getElementById('totalDonors').textContent = uniqueDonors.size;
    
    // Active recurring donations
    const recurringCount = donations.filter(d => d.type === 'recurring' && d.status === 'completed').length;
    document.getElementById('recurringDonations').textContent = recurringCount;
}

// Initialize donation form
function initializeDonationForm() {
    const form = document.getElementById('donationForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const donations = getDonationsData();
        const editId = form.dataset.editId;
        
        const isAnonymous = document.getElementById('anonymousDonation').checked;
        const donationType = document.getElementById('donationType').value;
        
        const donationData = {
            date: document.getElementById('donationDate').value,
            amount: parseFloat(document.getElementById('donationAmount').value),
            category: document.getElementById('donationCategory').value,
            method: document.getElementById('donationMethod').value,
            type: donationType,
            frequency: donationType === 'recurring' ? document.getElementById('recurringFrequency').value : null,
            isAnonymous: isAnonymous,
            donorName: isAnonymous ? 'Anonymous' : document.getElementById('donorName').value,
            donorEmail: isAnonymous ? null : document.getElementById('donorEmail').value || null,
            donorPhone: isAnonymous ? null : document.getElementById('donorPhone').value || null,
            donorAddress: isAnonymous ? null : document.getElementById('donorAddress').value || null,
            memberId: document.getElementById('donorMember').value ? parseInt(document.getElementById('donorMember').value) : null,
            transactionId: document.getElementById('transactionId').value || null,
            status: document.getElementById('donationStatus').value,
            notes: document.getElementById('donationNotes').value || null
        };
        
        if (editId) {
            // Update existing donation
            const index = donations.findIndex(d => d.id == editId);
            if (index !== -1) {
                donations[index] = { ...donations[index], ...donationData };
                showNotification('Donation updated successfully!', 'success');
            }
            delete form.dataset.editId;
        } else {
            // Add new donation
            const maxId = donations.reduce((max, d) => Math.max(max, d.id || 0), 0);
            donationData.id = maxId + 1;
            donations.push(donationData);
            showNotification('Donation added successfully!', 'success');
        }
        
        saveDonationsData(donations);
        
        closeModal('donationModal');
        form.reset();
        renderDonationsTable();
    });
}

// Open donation modal for new donation
function openDonationModal() {
    const form = document.getElementById('donationForm');
    if (form) {
        form.reset();
        delete form.dataset.editId;
        document.getElementById('donationModalTitle').textContent = 'Add New Donation';
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('donationDate').value = today;
        
        // Show donor fields by default
        document.getElementById('anonymousDonation').checked = false;
        document.getElementById('donorFieldsGroup').style.display = 'block';
        
        // Hide recurring options by default
        document.getElementById('donationType').value = 'one-time';
        document.getElementById('recurringFrequencyGroup').style.display = 'none';
        
        // Populate member dropdown
        populateMemberDropdown();
    }
    openModal('donationModal');
}

// Populate member dropdown
function populateMemberDropdown() {
    const select = document.getElementById('donorMember');
    if (!select) return;
    
    const members = getMembersData();
    
    // Clear existing options except the first one
    select.innerHTML = '<option value="">-- Select Member --</option>';
    
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = `${member.firstName} ${member.lastName}`;
        option.dataset.email = member.email;
        option.dataset.phone = member.phone;
        select.appendChild(option);
    });
}

// Load member info when member selected
function loadMemberInfo() {
    const select = document.getElementById('donorMember');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.value) {
        const members = getMembersData();
        const member = members.find(m => m.id == selectedOption.value);
        
        if (member) {
            document.getElementById('donorName').value = `${member.firstName} ${member.lastName}`;
            document.getElementById('donorEmail').value = member.email || '';
            document.getElementById('donorPhone').value = member.phone || '';
            document.getElementById('donorAddress').value = member.address || '';
        }
    }
}

// Toggle donor fields when anonymous checkbox changes
function toggleDonorFields() {
    const isAnonymous = document.getElementById('anonymousDonation').checked;
    const donorFields = document.getElementById('donorFieldsGroup');
    
    if (isAnonymous) {
        donorFields.style.display = 'none';
    } else {
        donorFields.style.display = 'block';
    }
}

// Toggle recurring options
function toggleRecurringOptions() {
    const donationType = document.getElementById('donationType').value;
    const recurringGroup = document.getElementById('recurringFrequencyGroup');
    
    if (donationType === 'recurring') {
        recurringGroup.style.display = 'block';
    } else {
        recurringGroup.style.display = 'none';
    }
}

// View donation details
function viewDonation(id) {
    const donations = getDonationsData();
    const donation = donations.find(d => d.id === id);
    
    if (donation) {
        let details = `Donation Details:\n\n`;
        details += `Date: ${formatDate(donation.date)}\n`;
        details += `Amount: ${PAYPAL_CONFIG.currencySymbol}${donation.amount.toLocaleString('es-DO', {minimumFractionDigits: 2})}\n`;
        details += `Category: ${donation.category}\n`;
        details += `Method: ${donation.method}\n`;
        details += `Type: ${donation.type}\n`;
        if (donation.frequency) details += `Frequency: ${donation.frequency}\n`;
        details += `Status: ${donation.status}\n\n`;
        
        if (!donation.isAnonymous) {
            details += `Donor: ${donation.donorName}\n`;
            if (donation.donorEmail) details += `Email: ${donation.donorEmail}\n`;
            if (donation.donorPhone) details += `Phone: ${donation.donorPhone}\n`;
            if (donation.donorAddress) details += `Address: ${donation.donorAddress}\n`;
        } else {
            details += `Donor: Anonymous\n`;
        }
        
        if (donation.transactionId) details += `\nTransaction ID: ${donation.transactionId}\n`;
        if (donation.notes) details += `\nNotes: ${donation.notes}`;
        
        alert(details);
    }
}

// Edit donation
function editDonation(id) {
    const donations = getDonationsData();
    const donation = donations.find(d => d.id === id);
    
    if (!donation) return;
    
    // Populate form
    document.getElementById('donationDate').value = donation.date;
    document.getElementById('donationAmount').value = donation.amount;
    document.getElementById('donationCategory').value = donation.category;
    document.getElementById('donationMethod').value = donation.method;
    document.getElementById('donationType').value = donation.type;
    document.getElementById('donationStatus').value = donation.status;
    document.getElementById('transactionId').value = donation.transactionId || '';
    document.getElementById('donationNotes').value = donation.notes || '';
    
    // Handle recurring
    if (donation.type === 'recurring') {
        document.getElementById('recurringFrequencyGroup').style.display = 'block';
        document.getElementById('recurringFrequency').value = donation.frequency;
    }
    
    // Handle anonymous
    document.getElementById('anonymousDonation').checked = donation.isAnonymous;
    if (donation.isAnonymous) {
        document.getElementById('donorFieldsGroup').style.display = 'none';
    } else {
        document.getElementById('donorFieldsGroup').style.display = 'block';
        document.getElementById('donorMember').value = donation.memberId || '';
        document.getElementById('donorName').value = donation.donorName || '';
        document.getElementById('donorEmail').value = donation.donorEmail || '';
        document.getElementById('donorPhone').value = donation.donorPhone || '';
        document.getElementById('donorAddress').value = donation.donorAddress || '';
    }
    
    // Set edit mode
    document.getElementById('donationModalTitle').textContent = 'Edit Donation';
    document.getElementById('donationForm').dataset.editId = id;
    
    populateMemberDropdown();
    openModal('donationModal');
}

// Delete donation
function deleteDonation(id) {
    if (confirm('Are you sure you want to delete this donation record?')) {
        const donations = getDonationsData();
        const updatedDonations = donations.filter(d => d.id !== id);
        saveDonationsData(updatedDonations);
        
        showNotification('Donation deleted successfully!', 'success');
        renderDonationsTable();
    }
}

// Search donations
function searchDonations() {
    const searchTerm = document.getElementById('donationSearch').value.toLowerCase();
    const donations = getDonationsData();
    
    const filtered = donations.filter(d => 
        d.donorName.toLowerCase().includes(searchTerm) ||
        d.category.toLowerCase().includes(searchTerm) ||
        d.method.toLowerCase().includes(searchTerm) ||
        d.amount.toString().includes(searchTerm) ||
        (d.transactionId && d.transactionId.toLowerCase().includes(searchTerm))
    );
    
    renderDonationsTable(filtered);
}

// Filter donations
function filterDonations() {
    const categoryFilter = document.getElementById('donationCategoryFilter').value;
    const dateFilter = document.getElementById('donationDateFilter').value;
    const donations = getDonationsData();
    
    let filtered = donations;
    
    // Category filter
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(d => d.category === categoryFilter);
    }
    
    // Date filter
    if (dateFilter !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        filtered = filtered.filter(d => {
            const donationDate = new Date(d.date);
            
            switch(dateFilter) {
                case 'today':
                    return donationDate >= today;
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return donationDate >= weekAgo;
                case 'month':
                    return donationDate.getMonth() === now.getMonth() && 
                           donationDate.getFullYear() === now.getFullYear();
                case 'year':
                    return donationDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    }
    
    renderDonationsTable(filtered);
}

// Export donations to CSV
function exportDonations() {
    const donations = getDonationsData();
    
    const headers = ['Date', 'Donor', 'Email', 'Phone', 'Category', 'Amount', 'Method', 'Type', 'Frequency', 'Status', 'Transaction ID', 'Notes'];
    const rows = donations.map(d => [
        d.date,
        d.donorName,
        d.donorEmail || '',
        d.donorPhone || '',
        d.category,
        d.amount,
        d.method,
        d.type,
        d.frequency || '',
        d.status,
        d.transactionId || '',
        d.notes || ''
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showNotification('Donations exported successfully!', 'success');
}

// Generate report
function generateReport() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const category = document.getElementById('reportCategory').value;
    
    let donations = getDonationsData();
    
    // Filter by date range
    if (startDate) {
        donations = donations.filter(d => d.date >= startDate);
    }
    if (endDate) {
        donations = donations.filter(d => d.date <= endDate);
    }
    
    // Filter by category
    if (category !== 'all') {
        donations = donations.filter(d => d.category === category);
    }
    
    // Calculate statistics
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const totalDonations = donations.length;
    const avgDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;
    const uniqueDonors = new Set(donations.map(d => d.donorName)).size;
    
    // Update report display
    document.getElementById('reportTotalAmount').textContent = `${PAYPAL_CONFIG.currencySymbol}${totalAmount.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    document.getElementById('reportTotalDonations').textContent = totalDonations;
    document.getElementById('reportAvgDonation').textContent = `${PAYPAL_CONFIG.currencySymbol}${avgDonation.toLocaleString('es-DO', {minimumFractionDigits: 2})}`;
    document.getElementById('reportUniqueDonors').textContent = uniqueDonors;
    
    // Category breakdown
    const categoryTotals = {};
    donations.forEach(d => {
        categoryTotals[d.category] = (categoryTotals[d.category] || 0) + d.amount;
    });
    
    const categoryHTML = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amount]) => `
            <div class="category-item">
                <span class="category-name">${cat}</span>
                <span class="category-amount">${PAYPAL_CONFIG.currencySymbol}${amount.toLocaleString('es-DO', {minimumFractionDigits: 2})}</span>
            </div>
        `).join('');
    document.getElementById('categoryBreakdown').innerHTML = categoryHTML;
    
    // Top donors
    const donorTotals = {};
    donations.forEach(d => {
        if (!d.isAnonymous) {
            donorTotals[d.donorName] = (donorTotals[d.donorName] || 0) + d.amount;
        }
    });
    
    const topDonorsHTML = Object.entries(donorTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([donor, amount], index) => `
            <div class="donor-item">
                <span class="donor-rank">#${index + 1}</span>
                <span class="donor-name">${donor}</span>
                <span class="donor-amount">${PAYPAL_CONFIG.currencySymbol}${amount.toLocaleString('es-DO', {minimumFractionDigits: 2})}</span>
            </div>
        `).join('');
    document.getElementById('topDonorsList').innerHTML = topDonorsHTML;
    
    // Show results
    document.getElementById('reportResults').style.display = 'block';
    
    showNotification('Report generated successfully!', 'success');
}

// Export report
function exportReport() {
    showNotification('Exporting report to Excel...', 'info');
    // Implementation would generate Excel file
}

// Print report
function printReport() {
    window.print();
}

// Generate tax receipt
function generateTaxReceipt(id) {
    const donations = getDonationsData();
    const donation = donations.find(d => d.id === id);
    
    if (!donation || donation.isAnonymous) {
        showNotification('Cannot generate tax receipt for anonymous donation', 'warning');
        return;
    }
    
    alert(`Tax Receipt Generation\n\nTax receipt will be generated for:\nDonor: ${donation.donorName}\nAmount: ${PAYPAL_CONFIG.currencySymbol}${donation.amount.toLocaleString('es-DO', {minimumFractionDigits: 2})}\nDate: ${formatDate(donation.date)}\nCategory: ${donation.category}\n\nThis feature will create a PDF receipt.`);
    showNotification('Tax receipt generated!', 'success');
}

/* ============================================ */
/* END DONATION MANAGEMENT */
/* ============================================ */

/* ============================================ */
/* DEBUGGING HELPERS */
/* ============================================ */

// Helper function to check localStorage data from browser console
function debugLocalStorage() {
    console.log('=== CHURCH PLATFORM LOCALSTORAGE DEBUG ===');
    
    const staff = localStorage.getItem('churchStaff');
    const members = localStorage.getItem('churchMembers');
    const donations = localStorage.getItem('churchDonations');
    
    console.log('\n📊 STAFF DATA:');
    if (staff) {
        const staffData = JSON.parse(staff);
        console.log(`Total Staff: ${staffData.length}`);
        console.table(staffData);
    } else {
        console.log('❌ No staff data in localStorage');
    }
    
    console.log('\n👥 MEMBERS DATA:');
    if (members) {
        const membersData = JSON.parse(members);
        console.log(`Total Members: ${membersData.length}`);
        console.table(membersData);
    } else {
        console.log('❌ No members data in localStorage');
    }
    
    console.log('\n💰 DONATIONS DATA:');
    if (donations) {
        const donationsData = JSON.parse(donations);
        console.log(`Total Donations: ${donationsData.length}`);
        console.table(donationsData);
    } else {
        console.log('❌ No donations data in localStorage');
    }
    
    console.log('\n=== END DEBUG ===');
}

// Make it globally accessible
window.debugLocalStorage = debugLocalStorage;
console.log('💡 TIP: Type debugLocalStorage() in console to check your data anytime!');
