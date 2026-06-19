/* ============================================ */
/* FINANCE REQUEST PORTAL - JAVASCRIPT */
/* ============================================ */

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupFileUpload();
    setupAlternativePayment();
    setMinDate();
});

// Current step tracking
let currentStep = 1;

/* ============================================ */
/* FORM INITIALIZATION */
/* ============================================ */
function initializeForm() {
    const form = document.getElementById('financeRequestForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Set minimum date for dateNeeded to today
    const dateInput = document.getElementById('dateNeeded');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

function setMinDate() {
    const dateInput = document.getElementById('dateNeeded');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

/* ============================================ */
/* MULTI-STEP NAVIGATION */
/* ============================================ */
function nextStep() {
    if (validateCurrentSection()) {
        currentStep++;
        updateStepDisplay();
        
        // Generate review summary on final step
        if (currentStep === 4) {
            generateReviewSummary();
        }
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateStepDisplay() {
    // Update progress steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });

    // Update form sections
    const sections = document.querySelectorAll('.form-section');
    sections.forEach((section, index) => {
        const sectionNumber = index + 1;
        section.classList.remove('active');
        
        if (sectionNumber === currentStep) {
            section.classList.add('active');
        }
    });
}

/* ============================================ */
/* FORM VALIDATION */
/* ============================================ */
function validateCurrentSection() {
    const currentSection = document.querySelector(`.form-section[data-section="${currentStep}"]`);
    if (!currentSection) return true;

    const requiredFields = currentSection.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        // Clear previous error styling
        field.style.borderColor = '';

        // Check if field is valid
        if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
            isValid = false;
            field.style.borderColor = 'var(--danger)';
            
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }

        // Special validation for amount
        if (field.id === 'amount' && field.value) {
            const amount = parseFloat(field.value);
            if (amount <= 0) {
                isValid = false;
                field.style.borderColor = 'var(--danger)';
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        }

        // Special validation for email
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                field.style.borderColor = 'var(--danger)';
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields correctly', 'error');
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    return isValid;
}

/* ============================================ */
/* FILE UPLOAD HANDLING */
/* ============================================ */
let uploadedFiles = [];

function setupFileUpload() {
    const fileInput = document.getElementById('attachments');
    const fileUploadArea = document.getElementById('fileUploadArea');

    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Drag and drop handlers
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--primary)';
            fileUploadArea.style.background = 'rgba(44, 82, 130, 0.05)';
        });

        fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '';
            fileUploadArea.style.background = '';
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = '';
            fileUploadArea.style.background = '';
            
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    Array.from(files).forEach(file => {
        if (file.size > maxSize) {
            showNotification(`File "${file.name}" exceeds 10MB limit`, 'error');
            return;
        }

        uploadedFiles.push(file);
        addFileToList(file);
    });
}

function addFileToList(file) {
    const fileList = document.getElementById('fileList');
    
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div class="file-item-info">
            <i class="fas fa-file"></i>
            <span>${file.name} (${formatFileSize(file.size)})</span>
        </div>
        <button type="button" onclick="removeFile('${file.name}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    fileList.appendChild(fileItem);
}

function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    updateFileList();
}

function updateFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    uploadedFiles.forEach(file => addFileToList(file));
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/* ============================================ */
/* ALTERNATIVE PAYMENT HANDLING */
/* ============================================ */
function setupAlternativePayment() {
    const alternativePayment = document.getElementById('alternativePayment');
    const alternativeDetailsGroup = document.getElementById('alternativeDetailsGroup');
    
    if (alternativePayment && alternativeDetailsGroup) {
        alternativePayment.addEventListener('change', function() {
            if (this.value && this.value !== '') {
                alternativeDetailsGroup.style.display = 'block';
            } else {
                alternativeDetailsGroup.style.display = 'none';
            }
        });
    }
}

/* ============================================ */
/* REVIEW SUMMARY GENERATION */
/* ============================================ */
function generateReviewSummary() {
    const reviewSummary = document.getElementById('reviewSummary');
    if (!reviewSummary) return;

    const formData = getFormData();
    
    let summaryHTML = `
        <div class="summary-section">
            <h3><i class="fas fa-user"></i> Requestor Information</h3>
            <div class="summary-item">
                <strong>Name:</strong>
                <span>${formData.fullName}</span>
            </div>
            <div class="summary-item">
                <strong>Phone:</strong>
                <span>${formData.phone}</span>
            </div>
            <div class="summary-item">
                <strong>Email:</strong>
                <span>${formData.email}</span>
            </div>
            <div class="summary-item">
                <strong>Department:</strong>
                <span>${getDepartmentName(formData.department)}</span>
            </div>
            <div class="summary-item">
                <strong>Position:</strong>
                <span>${formData.position}</span>
            </div>
        </div>

        <div class="summary-section">
            <h3><i class="fas fa-dollar-sign"></i> Financial Request Details</h3>
            <div class="summary-item">
                <strong>Amount Requested:</strong>
                <span class="summary-amount">RD$ ${parseFloat(formData.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div class="summary-item">
                <strong>Budget Category:</strong>
                <span>${getCategoryName(formData.budgetCategory)}</span>
            </div>
            <div class="summary-item">
                <strong>Purpose:</strong>
                <span>${formData.purpose}</span>
            </div>
            <div class="summary-item">
                <strong>Date Needed:</strong>
                <span>${formatDate(formData.dateNeeded)}</span>
            </div>
            <div class="summary-item">
                <strong>Priority:</strong>
                <span>${getPriorityName(formData.priority)}</span>
            </div>
            <div class="summary-item" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
                <strong>Detailed Explanation:</strong>
                <span style="text-align: left;">${formData.explanation}</span>
            </div>
        </div>

        <div class="summary-section">
            <h3><i class="fas fa-wallet"></i> Payment Information</h3>
            <div class="summary-item">
                <strong>Billet Account Name:</strong>
                <span>${formData.billetAccountName}</span>
            </div>
            <div class="summary-item">
                <strong>Billet Phone:</strong>
                <span>${formData.billetPhone}</span>
            </div>
            ${formData.billetAccountDetails ? `
            <div class="summary-item">
                <strong>Account Details:</strong>
                <span>${formData.billetAccountDetails}</span>
            </div>
            ` : ''}
            ${formData.alternativePayment ? `
            <div class="summary-item">
                <strong>Alternative Payment:</strong>
                <span>${getAlternativePaymentName(formData.alternativePayment)}</span>
            </div>
            ` : ''}
        </div>

        ${uploadedFiles.length > 0 ? `
        <div class="summary-section">
            <h3><i class="fas fa-paperclip"></i> Attached Documents</h3>
            ${uploadedFiles.map(file => `
                <div class="summary-item">
                    <span><i class="fas fa-file"></i> ${file.name}</span>
                    <span>${formatFileSize(file.size)}</span>
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;
    
    reviewSummary.innerHTML = summaryHTML;
}

function getFormData() {
    return {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value,
        position: document.getElementById('position').value,
        amount: document.getElementById('amount').value,
        budgetCategory: document.getElementById('budgetCategory').value,
        purpose: document.getElementById('purpose').value,
        explanation: document.getElementById('explanation').value,
        dateNeeded: document.getElementById('dateNeeded').value,
        priority: document.getElementById('priority').value,
        billetAccountName: document.getElementById('billetAccountName').value,
        billetPhone: document.getElementById('billetPhone').value,
        billetAccountDetails: document.getElementById('billetAccountDetails').value,
        alternativePayment: document.getElementById('alternativePayment').value,
        alternativeDetails: document.getElementById('alternativeDetails').value
    };
}

function getDepartmentName(value) {
    const departments = {
        'worship': 'Worship Team',
        'childrens': "Children's Ministry",
        'youth': 'Youth Ministry',
        'womens': "Women's Ministry",
        'mens': "Men's Ministry",
        'hospitality': 'Hospitality',
        'tech': 'Tech Team',
        'facilities': 'Facilities',
        'administration': 'Administration',
        'outreach': 'Outreach',
        'other': 'Other'
    };
    return departments[value] || value;
}

function getCategoryName(value) {
    const categories = {
        'ministry-supplies': 'Ministry Supplies',
        'equipment': 'Equipment',
        'maintenance': 'Maintenance & Repairs',
        'utilities': 'Utilities',
        'transportation': 'Transportation',
        'events': 'Events & Programs',
        'outreach': 'Outreach & Missions',
        'technology': 'Technology',
        'salaries': 'Salaries & Wages',
        'other': 'Other'
    };
    return categories[value] || value;
}

function getPriorityName(value) {
    const priorities = {
        'low': 'Low - Can wait 2+ weeks',
        'normal': 'Normal - Needed within 1-2 weeks',
        'high': 'High - Needed within a few days',
        'urgent': 'Urgent - Needed immediately'
    };
    return priorities[value] || value;
}

function getAlternativePaymentName(value) {
    const methods = {
        'bank-transfer': 'Bank Transfer',
        'check': 'Check',
        'cash': 'Cash',
        'other': 'Other'
    };
    return methods[value] || value;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/* ============================================ */
/* FORM SUBMISSION */
/* ============================================ */
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Final validation
    if (!validateCurrentSection()) {
        return;
    }

    // Generate unique request number
    const requestNumber = generateRequestNumber();
    
    // Get form data
    const formData = getFormData();
    
    // Create request object
    const request = {
        requestNumber: requestNumber,
        submissionDate: new Date().toISOString(),
        status: 'Submitted',
        requestorInfo: {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            department: formData.department,
            position: formData.position
        },
        requestDetails: {
            amount: parseFloat(formData.amount),
            budgetCategory: formData.budgetCategory,
            purpose: formData.purpose,
            explanation: formData.explanation,
            dateNeeded: formData.dateNeeded,
            priority: formData.priority
        },
        paymentInfo: {
            billetAccountName: formData.billetAccountName,
            billetPhone: formData.billetPhone,
            billetAccountDetails: formData.billetAccountDetails,
            alternativePayment: formData.alternativePayment,
            alternativeDetails: formData.alternativeDetails
        },
        attachments: uploadedFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
        })),
        approvalHistory: [],
        paymentHistory: [],
        receiptHistory: []
    };

    // In production, send to backend API
    // Example:
    // submitToBackend(request);
    
    // For demo mode, save to localStorage
    saveRequestToLocalStorage(request);
    
    // Show success message
    displaySuccessMessage(request);
}

function generateRequestNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `FR-${year}${month}${day}-${random}`;
}

function saveRequestToLocalStorage(request) {
    // Get existing requests
    let requests = JSON.parse(localStorage.getItem('financeRequests') || '[]');
    
    // Add new request
    requests.push(request);
    
    // Save back to localStorage
    localStorage.setItem('financeRequests', JSON.stringify(requests));
}

function displaySuccessMessage(request) {
    // Hide form
    document.getElementById('financeRequestForm').style.display = 'none';
    document.querySelector('.instructions-section').style.display = 'none';
    document.querySelector('.progress-steps').style.display = 'none';
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    
    // Populate success message details
    document.getElementById('requestNumber').textContent = request.requestNumber;
    document.getElementById('submissionDate').textContent = formatDate(request.submissionDate.split('T')[0]);
    document.getElementById('requestAmount').textContent = `RD$ ${request.requestDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Send notification email (in production)
    // sendConfirmationEmail(request);
}

/* ============================================ */
/* BACKEND INTEGRATION (For Production) */
/* ============================================ */
async function submitToBackend(request) {
    try {
        const response = await fetch('/api/finance-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit request');
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error submitting request:', error);
        showNotification('Failed to submit request. Please try again.', 'error');
        throw error;
    }
}

async function sendConfirmationEmail(request) {
    try {
        await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: request.requestorInfo.email,
                subject: `Finance Request ${request.requestNumber} Received`,
                template: 'request-confirmation',
                data: request
            })
        });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
}

/* ============================================ */
/* NOTIFICATION SYSTEM */
/* ============================================ */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        'success': '#38a169',
        'error': '#e53e3e',
        'warning': '#d69e2e',
        'info': '#2c5282'
    };
    return colors[type] || colors.info;
}

/* ============================================ */
/* ANIMATION STYLES (Injected dynamically) */
/* ============================================ */
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content i {
        font-size: 1.25rem;
    }
`;
document.head.appendChild(animationStyles);
