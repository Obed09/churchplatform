/* ============================================ */
/* FINANCE REQUESTS MANAGEMENT - JAVASCRIPT */
/* ============================================ */

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load requests if we're on the requests tab
    if (document.getElementById('requests-tab')) {
        loadFinanceRequests();
        updateRequestStats();
    }
});

/* ============================================ */
/* LOAD AND DISPLAY REQUESTS */
/* ============================================ */
function loadFinanceRequests() {
    const requests = getFinanceRequests();
    renderRequestsTable(requests);
}

function getFinanceRequests() {
    // In production, fetch from backend API
    // For demo mode, load from localStorage
    const requests = JSON.parse(localStorage.getItem('financeRequests') || '[]');
    
    // Add sample requests if none exist
    if (requests.length === 0) {
        const sampleRequests = generateSampleRequests();
        localStorage.setItem('financeRequests', JSON.stringify(sampleRequests));
        return sampleRequests;
    }
    
    return requests;
}

function generateSampleRequests() {
    return [
        {
            requestNumber: 'FR-20260615-0001',
            submissionDate: '2026-06-15T10:30:00Z',
            status: 'Submitted',
            requestorInfo: {
                fullName: 'Marie Dupont',
                phone: '829-555-1234',
                email: 'marie.dupont@example.com',
                department: 'worship',
                position: 'Worship Leader'
            },
            requestDetails: {
                amount: 8500.00,
                budgetCategory: 'equipment',
                purpose: 'New microphones for worship team',
                explanation: 'We need 4 wireless microphones for the worship team. Current microphones are producing static and affecting service quality.',
                dateNeeded: '2026-06-25',
                priority: 'high'
            },
            paymentInfo: {
                billetAccountName: 'Marie Dupont',
                billetPhone: '829-555-1234',
                billetAccountDetails: ''
            },
            attachments: [
                { name: 'microphone-quote.pdf', size: 156789, type: 'application/pdf' }
            ],
            approvalHistory: [],
            paymentHistory: [],
            receiptHistory: []
        },
        {
            requestNumber: 'FR-20260614-0002',
            submissionDate: '2026-06-14T14:20:00Z',
            status: 'Approved',
            requestorInfo: {
                fullName: 'Jean Baptiste',
                phone: '809-555-2345',
                email: 'jean.baptiste@example.com',
                department: 'youth',
                position: 'Youth Pastor'
            },
            requestDetails: {
                amount: 3200.00,
                budgetCategory: 'events',
                purpose: 'Youth camp supplies',
                explanation: 'Materials and supplies needed for the upcoming youth camp including food, materials, and transportation.',
                dateNeeded: '2026-07-01',
                priority: 'normal'
            },
            paymentInfo: {
                billetAccountName: 'Jean Baptiste',
                billetPhone: '809-555-2345',
                billetAccountDetails: ''
            },
            attachments: [],
            approvalHistory: [
                {
                    approver: 'Pastor Luis Rodriguez',
                    role: 'Pastor',
                    action: 'Approved',
                    date: '2026-06-15T09:15:00Z',
                    comments: 'Approved for youth ministry development'
                }
            ],
            paymentHistory: [],
            receiptHistory: []
        },
        {
            requestNumber: 'FR-20260613-0003',
            submissionDate: '2026-06-13T11:45:00Z',
            status: 'Paid',
            requestorInfo: {
                fullName: 'Sophie Laurent',
                phone: '829-555-3456',
                email: 'sophie.laurent@example.com',
                department: 'facilities',
                position: 'Facilities Manager'
            },
            requestDetails: {
                amount: 12500.00,
                budgetCategory: 'maintenance',
                purpose: 'Air conditioning repair',
                explanation: 'Main sanctuary AC unit needs urgent repair. Temperature has been uncomfortable during services.',
                dateNeeded: '2026-06-16',
                priority: 'urgent'
            },
            paymentInfo: {
                billetAccountName: 'Sophie Laurent',
                billetPhone: '829-555-3456',
                billetAccountDetails: ''
            },
            attachments: [
                { name: 'ac-repair-invoice.pdf', size: 234567, type: 'application/pdf' }
            ],
            approvalHistory: [
                {
                    approver: 'Finance Director',
                    role: 'Finance Officer',
                    action: 'Approved',
                    date: '2026-06-13T14:30:00Z',
                    comments: 'Emergency repair approved'
                }
            ],
            paymentHistory: [
                {
                    paidBy: 'Treasurer',
                    paidDate: '2026-06-14T10:00:00Z',
                    amount: 12500.00,
                    method: 'Billet',
                    transactionId: 'BILLET-20260614-12345'
                }
            ],
            receiptHistory: []
        },
        {
            requestNumber: 'FR-20260612-0004',
            submissionDate: '2026-06-12T09:00:00Z',
            status: 'Completed',
            requestorInfo: {
                fullName: 'Pierre Martin',
                phone: '809-555-4567',
                email: 'pierre.martin@example.com',
                department: 'tech',
                position: 'Tech Team Lead'
            },
            requestDetails: {
                amount: 5600.00,
                budgetCategory: 'technology',
                purpose: 'Livestream camera upgrade',
                explanation: 'Upgrade camera for better livestream quality. Current camera does not support HD resolution.',
                dateNeeded: '2026-06-20',
                priority: 'normal'
            },
            paymentInfo: {
                billetAccountName: 'Pierre Martin',
                billetPhone: '809-555-4567',
                billetAccountDetails: ''
            },
            attachments: [],
            approvalHistory: [
                {
                    approver: 'Department Head',
                    role: 'Communications Director',
                    action: 'Approved',
                    date: '2026-06-12T11:00:00Z',
                    comments: 'Approved for ministry enhancement'
                }
            ],
            paymentHistory: [
                {
                    paidBy: 'Finance Team',
                    paidDate: '2026-06-13T15:30:00Z',
                    amount: 5600.00,
                    method: 'Billet',
                    transactionId: 'BILLET-20260613-67890'
                }
            ],
            receiptHistory: [
                {
                    uploadedBy: 'Pierre Martin',
                    uploadedDate: '2026-06-14T16:45:00Z',
                    fileName: 'camera-receipt.jpg',
                    verified: true,
                    verifiedBy: 'Finance Officer',
                    verifiedDate: '2026-06-15T08:00:00Z',
                    comments: 'Receipt verified and archived'
                }
            ]
        },
        {
            requestNumber: 'FR-20260611-0005',
            submissionDate: '2026-06-11T13:30:00Z',
            status: 'Rejected',
            requestorInfo: {
                fullName: 'Anne Dubois',
                phone: '829-555-5678',
                email: 'anne.dubois@example.com',
                department: 'hospitality',
                position: 'Hospitality Coordinator'
            },
            requestDetails: {
                amount: 15000.00,
                budgetCategory: 'other',
                purpose: 'New coffee machine',
                explanation: 'Request for high-end espresso machine for hospitality area.',
                dateNeeded: '2026-06-30',
                priority: 'low'
            },
            paymentInfo: {
                billetAccountName: 'Anne Dubois',
                billetPhone: '829-555-5678',
                billetAccountDetails: ''
            },
            attachments: [],
            approvalHistory: [
                {
                    approver: 'Finance Director',
                    role: 'Finance Officer',
                    action: 'Rejected',
                    date: '2026-06-12T10:00:00Z',
                    comments: 'Exceeds budget for hospitality items. Please submit request for more affordable option.'
                }
            ],
            paymentHistory: [],
            receiptHistory: []
        }
    ];
}

/* ============================================ */
/* RENDER REQUESTS TABLE */
/* ============================================ */
function renderRequestsTable(requests) {
    const tableBody = document.getElementById('requestsTableBody');
    if (!tableBody) return;

    if (requests.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-light);">No finance requests found. Requests submitted through the public portal will appear here.</p>
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = requests.map(request => {
        const date = new Date(request.submissionDate);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <tr>
                <td><strong>${request.requestNumber}</strong></td>
                <td>${formattedDate}</td>
                <td>${request.requestorInfo.fullName}</td>
                <td>${getDepartmentName(request.requestorInfo.department)}</td>
                <td>${request.requestDetails.purpose}</td>
                <td><strong>RD$ ${request.requestDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
                <td>${getPriorityBadge(request.requestDetails.priority)}</td>
                <td>${getStatusBadge(request.status)}</td>
                <td>
                    <button class="btn-icon" onclick="viewRequestDetails('${request.requestNumber}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${getActionButtons(request)}
                </td>
            </tr>
        `;
    }).join('');
}

function getPriorityBadge(priority) {
    const badges = {
        'urgent': '<span class="badge badge-danger"><i class="fas fa-exclamation-circle"></i> Urgent</span>',
        'high': '<span class="badge badge-warning"><i class="fas fa-arrow-up"></i> High</span>',
        'normal': '<span class="badge badge-info"><i class="fas fa-minus"></i> Normal</span>',
        'low': '<span class="badge badge-secondary"><i class="fas fa-arrow-down"></i> Low</span>'
    };
    return badges[priority] || badges.normal;
}

function getStatusBadge(status) {
    const badges = {
        'Submitted': '<span class="badge badge-info">Submitted</span>',
        'Under Review': '<span class="badge badge-warning">Under Review</span>',
        'Awaiting Information': '<span class="badge badge-warning">Awaiting Info</span>',
        'Approved': '<span class="badge badge-success">Approved</span>',
        'Rejected': '<span class="badge badge-danger">Rejected</span>',
        'Awaiting Payment': '<span class="badge badge-primary">Awaiting Payment</span>',
        'Paid': '<span class="badge badge-success">Paid</span>',
        'Receipt Pending': '<span class="badge badge-warning">Receipt Pending</span>',
        'Completed': '<span class="badge badge-success">Completed</span>'
    };
    return badges[status] || `<span class="badge badge-secondary">${status}</span>`;
}

function getActionButtons(request) {
    let buttons = '';
    
    if (request.status === 'Submitted' || request.status === 'Under Review') {
        buttons += `
            <button class="btn-icon" onclick="approveRequest('${request.requestNumber}')" title="Approve">
                <i class="fas fa-check"></i>
            </button>
            <button class="btn-icon" onclick="rejectRequest('${request.requestNumber}')" title="Reject">
                <i class="fas fa-times"></i>
            </button>
        `;
    }
    
    if (request.status === 'Approved' || request.status === 'Awaiting Payment') {
        buttons += `
            <button class="btn-icon" onclick="processPayment('${request.requestNumber}')" title="Process Payment">
                <i class="fas fa-dollar-sign"></i>
            </button>
        `;
    }
    
    if (request.status === 'Paid' || request.status === 'Receipt Pending') {
        buttons += `
            <button class="btn-icon" onclick="uploadReceipt('${request.requestNumber}')" title="Upload Receipt">
                <i class="fas fa-receipt"></i>
            </button>
        `;
    }
    
    return buttons;
}

/* ============================================ */
/* UPDATE REQUEST STATISTICS */
/* ============================================ */
function updateRequestStats() {
    const requests = getFinanceRequests();
    
    // Count by status
    const pending = requests.filter(r => 
        r.status === 'Submitted' || r.status === 'Under Review' || r.status === 'Awaiting Information'
    ).length;
    
    const approved = requests.filter(r => r.status === 'Approved').length;
    const awaitingPayment = requests.filter(r => r.status === 'Awaiting Payment').length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    
    // Calculate amounts
    const totalRequested = requests.reduce((sum, r) => sum + r.requestDetails.amount, 0);
    const totalApproved = requests
        .filter(r => r.status === 'Approved' || r.status === 'Paid' || r.status === 'Completed')
        .reduce((sum, r) => sum + r.requestDetails.amount, 0);
    
    // Update DOM
    updateElementText('pendingRequestsCount', pending);
    updateElementText('approvedRequestsCount', approved);
    updateElementText('awaitingPaymentCount', awaitingPayment);
    updateElementText('completedRequestsCount', completed);
    updateElementText('totalRequestedAmount', `RD$ ${totalRequested.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
    updateElementText('totalApprovedAmount', `RD$ ${totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

/* ============================================ */
/* FILTER REQUESTS */
/* ============================================ */
function filterRequests() {
    const statusFilter = document.getElementById('requestStatusFilter').value;
    const departmentFilter = document.getElementById('requestDepartmentFilter').value;
    
    let requests = getFinanceRequests();
    
    // Filter by status
    if (statusFilter !== 'all') {
        requests = requests.filter(r => {
            const status = r.status.toLowerCase().replace(/ /g, '-');
            return status === statusFilter;
        });
    }
    
    // Filter by department
    if (departmentFilter !== 'all') {
        requests = requests.filter(r => r.requestorInfo.department === departmentFilter);
    }
    
    renderRequestsTable(requests);
}

/* ============================================ */
/* VIEW REQUEST DETAILS */
/* ============================================ */
function viewRequestDetails(requestNumber) {
    const requests = getFinanceRequests();
    const request = requests.find(r => r.requestNumber === requestNumber);
    
    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }
    
    const content = document.getElementById('requestDetailsContent');
    if (!content) return;
    
    content.innerHTML = `
        <div class="request-detail-view">
            <!-- Request Header -->
            <div class="detail-section">
                <div class="detail-header">
                    <h3>Request Information</h3>
                    <div class="detail-status">${getStatusBadge(request.status)}</div>
                </div>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Request Number:</span>
                        <span class="detail-value"><strong>${request.requestNumber}</strong></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Submission Date:</span>
                        <span class="detail-value">${formatDateTime(request.submissionDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Priority:</span>
                        <span class="detail-value">${getPriorityBadge(request.requestDetails.priority)}</span>
                    </div>
                </div>
            </div>

            <!-- Requestor Information -->
            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Requestor Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${request.requestorInfo.fullName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${request.requestorInfo.phone}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${request.requestorInfo.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Department:</span>
                        <span class="detail-value">${getDepartmentName(request.requestorInfo.department)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Position:</span>
                        <span class="detail-value">${request.requestorInfo.position}</span>
                    </div>
                </div>
            </div>

            <!-- Financial Request Details -->
            <div class="detail-section">
                <h3><i class="fas fa-dollar-sign"></i> Financial Request Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Amount Requested:</span>
                        <span class="detail-value amount-highlight">RD$ ${request.requestDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Budget Category:</span>
                        <span class="detail-value">${getCategoryName(request.requestDetails.budgetCategory)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date Needed:</span>
                        <span class="detail-value">${formatDate(request.requestDetails.dateNeeded)}</span>
                    </div>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">Purpose:</span>
                    <span class="detail-value"><strong>${request.requestDetails.purpose}</strong></span>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">Detailed Explanation:</span>
                    <p class="detail-explanation">${request.requestDetails.explanation}</p>
                </div>
            </div>

            <!-- Payment Information -->
            <div class="detail-section">
                <h3><i class="fas fa-wallet"></i> Payment Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Billet Account Name:</span>
                        <span class="detail-value">${request.paymentInfo.billetAccountName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Billet Phone:</span>
                        <span class="detail-value">${request.paymentInfo.billetPhone}</span>
                    </div>
                    ${request.paymentInfo.billetAccountDetails ? `
                    <div class="detail-item">
                        <span class="detail-label">Account Details:</span>
                        <span class="detail-value">${request.paymentInfo.billetAccountDetails}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Attachments -->
            ${request.attachments && request.attachments.length > 0 ? `
            <div class="detail-section">
                <h3><i class="fas fa-paperclip"></i> Attached Documents</h3>
                <div class="attachments-list">
                    ${request.attachments.map(att => `
                        <div class="attachment-item">
                            <i class="fas fa-file"></i>
                            <span>${att.name}</span>
                            <span class="file-size">${formatFileSize(att.size)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Approval History -->
            ${request.approvalHistory && request.approvalHistory.length > 0 ? `
            <div class="detail-section">
                <h3><i class="fas fa-check-circle"></i> Approval History</h3>
                <div class="timeline">
                    ${request.approvalHistory.map(approval => `
                        <div class="timeline-item">
                            <div class="timeline-icon ${approval.action === 'Approved' ? 'success' : 'danger'}">
                                <i class="fas fa-${approval.action === 'Approved' ? 'check' : 'times'}"></i>
                            </div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    <strong>${approval.approver}</strong> - ${approval.role}
                                </div>
                                <div class="timeline-action">${approval.action}</div>
                                <div class="timeline-date">${formatDateTime(approval.date)}</div>
                                ${approval.comments ? `<div class="timeline-comments">${approval.comments}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Payment History -->
            ${request.paymentHistory && request.paymentHistory.length > 0 ? `
            <div class="detail-section">
                <h3><i class="fas fa-money-check-alt"></i> Payment History</h3>
                <div class="timeline">
                    ${request.paymentHistory.map(payment => `
                        <div class="timeline-item">
                            <div class="timeline-icon success">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    Payment of RD$ ${payment.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                                <div class="timeline-details">
                                    Method: ${payment.method} | Transaction: ${payment.transactionId}
                                </div>
                                <div class="timeline-date">Paid by ${payment.paidBy} on ${formatDateTime(payment.paidDate)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Receipt History -->
            ${request.receiptHistory && request.receiptHistory.length > 0 ? `
            <div class="detail-section">
                <h3><i class="fas fa-receipt"></i> Receipt History</h3>
                <div class="timeline">
                    ${request.receiptHistory.map(receipt => `
                        <div class="timeline-item">
                            <div class="timeline-icon ${receipt.verified ? 'success' : 'warning'}">
                                <i class="fas fa-${receipt.verified ? 'check-circle' : 'clock'}"></i>
                            </div>
                            <div class="timeline-content">
                                <div class="timeline-header">
                                    Receipt: ${receipt.fileName}
                                </div>
                                <div class="timeline-date">Uploaded by ${receipt.uploadedBy} on ${formatDateTime(receipt.uploadedDate)}</div>
                                ${receipt.verified ? `
                                    <div class="timeline-verified">
                                        <i class="fas fa-check-circle"></i> Verified by ${receipt.verifiedBy} on ${formatDateTime(receipt.verifiedDate)}
                                    </div>
                                ` : ''}
                                ${receipt.comments ? `<div class="timeline-comments">${receipt.comments}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}

            <!-- Action Buttons -->
            <div class="detail-actions">
                ${getDetailActionButtons(request)}
            </div>
        </div>
    `;
    
    openModal('requestDetailsModal');
}

function getDetailActionButtons(request) {
    let buttons = '';
    
    if (request.status === 'Submitted' || request.status === 'Under Review') {
        buttons += `
            <button class="btn-success" onclick="approveRequest('${request.requestNumber}')">
                <i class="fas fa-check"></i> Approve Request
            </button>
            <button class="btn-danger" onclick="rejectRequest('${request.requestNumber}')">
                <i class="fas fa-times"></i> Reject Request
            </button>
            <button class="btn-warning" onclick="requestMoreInfo('${request.requestNumber}')">
                <i class="fas fa-question-circle"></i> Request More Information
            </button>
        `;
    }
    
    if (request.status === 'Approved' || request.status === 'Awaiting Payment') {
        buttons += `
            <button class="btn-primary" onclick="processPayment('${request.requestNumber}')">
                <i class="fas fa-dollar-sign"></i> Process Payment
            </button>
        `;
    }
    
    if (request.status === 'Paid' || request.status === 'Receipt Pending') {
        buttons += `
            <button class="btn-primary" onclick="uploadReceipt('${request.requestNumber}')">
                <i class="fas fa-receipt"></i> Upload Receipt
            </button>
        `;
    }
    
    buttons += `
        <button class="btn-secondary" onclick="closeModal('requestDetailsModal')">
            <i class="fas fa-times"></i> Close
        </button>
    `;
    
    return buttons;
}

/* ============================================ */
/* REQUEST ACTIONS */
/* ============================================ */
function approveRequest(requestNumber) {
    // In production, send to backend API
    showNotification('Request approved successfully', 'success');
    closeModal('requestDetailsModal');
    loadFinanceRequests();
    updateRequestStats();
}

function rejectRequest(requestNumber) {
    // In production, send to backend API
    showNotification('Request rejected', 'error');
    closeModal('requestDetailsModal');
    loadFinanceRequests();
    updateRequestStats();
}

function requestMoreInfo(requestNumber) {
    // In production, send to backend API
    showNotification('Information request sent to requestor', 'info');
    closeModal('requestDetailsModal');
}

function processPayment(requestNumber) {
    const requests = getFinanceRequests();
    const request = requests.find(r => r.requestNumber === requestNumber);
    
    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }
    
    // Populate payment summary
    const summary = document.getElementById('paymentRequestSummary');
    if (summary) {
        summary.innerHTML = `
            <div class="payment-summary-card">
                <div class="summary-row">
                    <strong>Request Number:</strong>
                    <span>${request.requestNumber}</span>
                </div>
                <div class="summary-row">
                    <strong>Requestor:</strong>
                    <span>${request.requestorInfo.fullName}</span>
                </div>
                <div class="summary-row">
                    <strong>Purpose:</strong>
                    <span>${request.requestDetails.purpose}</span>
                </div>
                <div class="summary-row">
                    <strong>Amount to Pay:</strong>
                    <span class="amount-highlight">RD$ ${request.requestDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        `;
    }
    
    // Populate payment info
    document.getElementById('paymentRequestNumber').value = requestNumber;
    document.getElementById('paymentBilletName').textContent = request.paymentInfo.billetAccountName;
    document.getElementById('paymentBilletPhone').textContent = request.paymentInfo.billetPhone;
    document.getElementById('paymentAmount').value = request.requestDetails.amount.toFixed(2);
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('paymentDate').value = today;
    
    // Setup form submission
    const form = document.getElementById('processPaymentForm');
    if (form) {
        form.onsubmit = handlePaymentSubmit;
    }
    
    openModal('processPaymentModal');
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const requestNumber = document.getElementById('paymentRequestNumber').value;
    const amount = parseFloat(document.getElementById('paymentAmount').value);
    const method = document.getElementById('paymentMethod').value;
    const transactionId = document.getElementById('transactionId').value;
    const paymentDate = document.getElementById('paymentDate').value;
    const notes = document.getElementById('paymentNotes').value;
    const confirmed = document.getElementById('confirmPayment').checked;
    
    if (!confirmed) {
        showNotification('Please confirm the payment', 'warning');
        return;
    }
    
    // Create payment record
    const paymentData = {
        paidBy: getCurrentUserName(),
        paidDate: new Date(paymentDate).toISOString(),
        amount: amount,
        method: method,
        transactionId: transactionId,
        notes: notes
    };
    
    // Update request with payment
    const requests = getFinanceRequests();
    const requestIndex = requests.findIndex(r => r.requestNumber === requestNumber);
    
    if (requestIndex !== -1) {
        if (!requests[requestIndex].paymentHistory) {
            requests[requestIndex].paymentHistory = [];
        }
        
        requests[requestIndex].paymentHistory.push(paymentData);
        requests[requestIndex].status = 'Paid';
        
        localStorage.setItem('financeRequests', JSON.stringify(requests));
    }
    
    showNotification('Payment processed successfully via ' + method, 'success');
    closeModal('processPaymentModal');
    document.getElementById('processPaymentForm').reset();
    
    // Reload data
    setTimeout(() => {
        loadFinanceRequests();
        updateRequestStats();
    }, 500);
}

function uploadReceipt(requestNumber) {
    const requests = getFinanceRequests();
    const request = requests.find(r => r.requestNumber === requestNumber);
    
    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }
    
    // Populate receipt summary
    const summary = document.getElementById('receiptRequestSummary');
    if (summary) {
        summary.innerHTML = `
            <div class="receipt-summary-card">
                <div class="summary-row">
                    <strong>Request Number:</strong>
                    <span>${request.requestNumber}</span>
                </div>
                <div class="summary-row">
                    <strong>Requestor:</strong>
                    <span>${request.requestorInfo.fullName}</span>
                </div>
                <div class="summary-row">
                    <strong>Amount Paid:</strong>
                    <span class="amount-highlight">RD$ ${request.requestDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        `;
    }
    
    // Populate payment info
    const paymentInfo = document.getElementById('receiptPaymentInfo');
    if (paymentInfo && request.paymentHistory && request.paymentHistory.length > 0) {
        const lastPayment = request.paymentHistory[request.paymentHistory.length - 1];
        paymentInfo.innerHTML = `
            <div class="info-grid">
                <div class="info-item">
                    <strong>Payment Method:</strong>
                    <span>${lastPayment.method}</span>
                </div>
                <div class="info-item">
                    <strong>Transaction ID:</strong>
                    <span>${lastPayment.transactionId}</span>
                </div>
                <div class="info-item">
                    <strong>Payment Date:</strong>
                    <span>${formatDateTime(lastPayment.paidDate)}</span>
                </div>
                <div class="info-item">
                    <strong>Paid By:</strong>
                    <span>${lastPayment.paidBy}</span>
                </div>
            </div>
        `;
    }
    
    document.getElementById('receiptRequestNumber').value = requestNumber;
    
    // Setup file input preview
    const fileInput = document.getElementById('receiptFile');
    if (fileInput) {
        fileInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                displayFilePreview(file);
            }
        };
    }
    
    // Setup form submission
    const form = document.getElementById('uploadReceiptForm');
    if (form) {
        form.onsubmit = handleReceiptUpload;
    }
    
    openModal('uploadReceiptModal');
}

function displayFilePreview(file) {
    const preview = document.getElementById('receiptFilePreview');
    if (!preview) return;
    
    const fileSize = formatFileSize(file.size);
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size exceeds 5MB limit', 'error');
        document.getElementById('receiptFile').value = '';
        preview.innerHTML = '';
        return;
    }
    
    preview.innerHTML = `
        <div class="file-preview-item">
            <i class="fas fa-file-${file.type.includes('pdf') ? 'pdf' : 'image'}"></i>
            <div class="file-info">
                <strong>${file.name}</strong>
                <span>${fileSize}</span>
            </div>
            <button type="button" onclick="clearFilePreview()" class="btn-icon">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function clearFilePreview() {
    document.getElementById('receiptFile').value = '';
    document.getElementById('receiptFilePreview').innerHTML = '';
}

function handleReceiptUpload(e) {
    e.preventDefault();
    
    const requestNumber = document.getElementById('receiptRequestNumber').value;
    const file = document.getElementById('receiptFile').files[0];
    const receiptType = document.getElementById('receiptType').value;
    const notes = document.getElementById('receiptNotes').value;
    const verify = document.getElementById('verifyReceipt').checked;
    
    if (!file) {
        showNotification('Please select a file to upload', 'warning');
        return;
    }
    
    // Create receipt record
    const receiptData = {
        uploadedBy: getCurrentUserName(),
        uploadedDate: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        receiptType: receiptType,
        notes: notes,
        verified: verify,
        verifiedBy: verify ? getCurrentUserName() : null,
        verifiedDate: verify ? new Date().toISOString() : null,
        comments: verify ? 'Receipt uploaded and verified' : 'Receipt uploaded, pending verification'
    };
    
    // In production, upload file to server
    // const formData = new FormData();
    // formData.append('receipt', file);
    // formData.append('requestNumber', requestNumber);
    // await fetch('/api/upload-receipt', { method: 'POST', body: formData });
    
    // Update request with receipt
    const requests = getFinanceRequests();
    const requestIndex = requests.findIndex(r => r.requestNumber === requestNumber);
    
    if (requestIndex !== -1) {
        if (!requests[requestIndex].receiptHistory) {
            requests[requestIndex].receiptHistory = [];
        }
        
        requests[requestIndex].receiptHistory.push(receiptData);
        requests[requestIndex].status = verify ? 'Completed' : 'Receipt Pending';
        
        localStorage.setItem('financeRequests', JSON.stringify(requests));
    }
    
    showNotification('Receipt uploaded successfully', 'success');
    closeModal('uploadReceiptModal');
    document.getElementById('uploadReceiptForm').reset();
    clearFilePreview();
    
    // Reload data
    setTimeout(() => {
        loadFinanceRequests();
        updateRequestStats();
    }, 500);
}

function getCurrentUserName() {
    // In production, get from authentication
    const user = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    return user.name || 'Admin User';
}

/* ============================================ */
/* HELPER FUNCTIONS */
/* ============================================ */
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

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDateTime(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
