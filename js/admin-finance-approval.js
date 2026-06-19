/* ============================================ */
/* FINANCE APPROVAL WORKFLOW - JAVASCRIPT */
/* ============================================ */

// Current user role (in production, this would come from authentication)
let currentUserRole = 'finance-officer'; // Can be: department-head, finance-officer, treasurer, pastor

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadApprovalQueue();
    loadApprovalRules();
    loadApprovalHistory();
    setupApprovalForm();
});

/* ============================================ */
/* LOAD APPROVAL QUEUE */
/* ============================================ */
function loadApprovalQueue() {
    const requests = getFinanceRequests();
    const pendingApprovals = requests.filter(r => needsApproval(r, currentUserRole));
    
    // Update pending count
    const pendingCount = pendingApprovals.length;
    document.getElementById('pendingApprovalsCount').textContent = pendingCount;
    
    if (pendingCount === 0) {
        document.getElementById('pendingApprovalsBanner').style.display = 'none';
    }
    
    renderApprovalCards(pendingApprovals);
}

function needsApproval(request, userRole) {
    // Check if request needs approval from current user role
    if (request.status !== 'Submitted' && request.status !== 'Under Review') {
        return false;
    }
    
    // Get approval chain
    const approvalChain = getApprovalChain(request);
    const currentApproverIndex = approvalChain.findIndex(level => level.role === userRole);
    
    if (currentApproverIndex === -1) {
        return false;
    }
    
    // Check if previous approvals are completed
    if (currentApproverIndex === 0) {
        return true; // First approver
    }
    
    const previousLevels = approvalChain.slice(0, currentApproverIndex);
    return previousLevels.every(level => 
        request.approvalHistory.some(h => h.role === level.role && h.action === 'Approved')
    );
}

function getApprovalChain(request) {
    // Default approval chain
    let chain = [
        { role: 'department-head', title: 'Department Head' },
        { role: 'finance-officer', title: 'Finance Officer' }
    ];
    
    // Add treasurer for amounts over 10,000
    if (request.requestDetails.amount > 10000) {
        chain.push({ role: 'treasurer', title: 'Treasurer' });
    }
    
    // Add pastor for amounts over 25,000 or urgent priority
    if (request.requestDetails.amount > 25000 || request.requestDetails.priority === 'urgent') {
        chain.push({ role: 'pastor', title: 'Pastor/Authorized Signatory' });
    }
    
    return chain;
}

function renderApprovalCards(requests) {
    const grid = document.getElementById('approvalCardsGrid');
    if (!grid) return;
    
    if (requests.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>No Pending Approvals</h3>
                <p>You have no finance requests awaiting your approval at this time.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = requests.map(request => {
        const daysWaiting = Math.floor((new Date() - new Date(request.submissionDate)) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="approval-card ${request.requestDetails.priority}" data-request="${request.requestNumber}">
                <div class="approval-card-header">
                    <div class="approval-card-priority">${getPriorityBadge(request.requestDetails.priority)}</div>
                    <div class="approval-card-waiting">
                        <i class="fas fa-clock"></i> ${daysWaiting} day${daysWaiting !== 1 ? 's' : ''} waiting
                    </div>
                </div>
                
                <div class="approval-card-body">
                    <h3>${request.requestDetails.purpose}</h3>
                    <div class="approval-card-amount">RD$ ${request.requestDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    
                    <div class="approval-card-info">
                        <div class="info-item">
                            <i class="fas fa-user"></i>
                            <span><strong>Requestor:</strong> ${request.requestorInfo.fullName}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-building"></i>
                            <span><strong>Department:</strong> ${getDepartmentName(request.requestorInfo.department)}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-calendar"></i>
                            <span><strong>Needed by:</strong> ${formatDate(request.requestDetails.dateNeeded)}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-hashtag"></i>
                            <span><strong>Request #:</strong> ${request.requestNumber}</span>
                        </div>
                    </div>
                    
                    <div class="approval-card-excerpt">
                        <p>${request.requestDetails.explanation.substring(0, 150)}${request.requestDetails.explanation.length > 150 ? '...' : ''}</p>
                    </div>
                    
                    ${renderApprovalProgress(request)}
                </div>
                
                <div class="approval-card-actions">
                    <button class="btn-success" onclick="openApprovalModal('${request.requestNumber}', 'approve')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn-secondary" onclick="viewFullRequest('${request.requestNumber}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn-danger" onclick="openApprovalModal('${request.requestNumber}', 'reject')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderApprovalProgress(request) {
    const chain = getApprovalChain(request);
    const currentIndex = chain.findIndex(level => !request.approvalHistory.some(h => h.role === level.role && h.action === 'Approved'));
    
    return `
        <div class="approval-progress">
            <div class="approval-progress-label">Approval Progress</div>
            <div class="approval-progress-chain">
                ${chain.map((level, index) => {
                    const approved = request.approvalHistory.some(h => h.role === level.role && h.action === 'Approved');
                    const current = index === currentIndex;
                    
                    return `
                        <div class="approval-progress-step ${approved ? 'completed' : ''} ${current ? 'current' : ''}">
                            <div class="step-icon">
                                ${approved ? '<i class="fas fa-check"></i>' : current ? '<i class="fas fa-hourglass-half"></i>' : '<i class="fas fa-circle"></i>'}
                            </div>
                            <div class="step-label">${level.title}</div>
                        </div>
                    `;
                }).join('<div class="progress-connector"></div>')}
            </div>
        </div>
    `;
}

/* ============================================ */
/* APPROVAL MODAL */
/* ============================================ */
function openApprovalModal(requestNumber, suggestedAction = '') {
    const requests = getFinanceRequests();
    const request = requests.find(r => r.requestNumber === requestNumber);
    
    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }
    
    // Populate request summary
    const summary = document.getElementById('approvalRequestSummary');
    summary.innerHTML = `
        <div class="approval-summary-card">
            <div class="summary-row">
                <strong>Request Number:</strong>
                <span>${request.requestNumber}</span>
            </div>
            <div class="summary-row">
                <strong>Requestor:</strong>
                <span>${request.requestorInfo.fullName} (${request.requestorInfo.department})</span>
            </div>
            <div class="summary-row">
                <strong>Amount:</strong>
                <span class="amount-highlight">RD$ ${request.requestDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="summary-row">
                <strong>Purpose:</strong>
                <span>${request.requestDetails.purpose}</span>
            </div>
            <div class="summary-row">
                <strong>Priority:</strong>
                <span>${getPriorityBadge(request.requestDetails.priority)}</span>
            </div>
        </div>
    `;
    
    // Set request number in hidden field
    document.getElementById('approvalRequestNumber').value = requestNumber;
    
    // Set suggested action
    if (suggestedAction) {
        document.getElementById('approvalAction').value = suggestedAction;
        toggleApprovalFields();
    }
    
    openModal('approvalActionModal');
}

function viewFullRequest(requestNumber) {
    // Redirect to finance page with request details
    window.location.href = `admin-finance.html?viewRequest=${requestNumber}`;
}

function setupApprovalForm() {
    const form = document.getElementById('approvalActionForm');
    if (form) {
        form.addEventListener('submit', handleApprovalSubmit);
    }
    
    const ruleConditionSelect = document.getElementById('ruleCondition');
    if (ruleConditionSelect) {
        ruleConditionSelect.addEventListener('change', toggleRuleFields);
    }
    
    const addRuleForm = document.getElementById('addRuleForm');
    if (addRuleForm) {
        addRuleForm.addEventListener('submit', handleAddRule);
    }
}

function toggleApprovalFields() {
    const action = document.getElementById('approvalAction').value;
    const conditionsGroup = document.getElementById('approvalConditionsGroup');
    const submitBtn = document.getElementById('submitApprovalBtn');
    
    if (action === 'approve') {
        conditionsGroup.style.display = 'block';
        submitBtn.className = 'btn-success';
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Approve Request';
    } else if (action === 'reject') {
        conditionsGroup.style.display = 'none';
        submitBtn.className = 'btn-danger';
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Reject Request';
    } else if (action === 'request-info') {
        conditionsGroup.style.display = 'none';
        submitBtn.className = 'btn-warning';
        submitBtn.innerHTML = '<i class="fas fa-question-circle"></i> Request Information';
    }
}

function handleApprovalSubmit(e) {
    e.preventDefault();
    
    const requestNumber = document.getElementById('approvalRequestNumber').value;
    const action = document.getElementById('approvalAction').value;
    const comments = document.getElementById('approvalComments').value;
    const conditions = document.getElementById('approvalConditions').value;
    
    // In production, send to backend API
    const approvalData = {
        requestNumber: requestNumber,
        approver: getCurrentUserName(),
        role: getRoleTitle(currentUserRole),
        action: action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Requested More Information',
        date: new Date().toISOString(),
        comments: comments,
        conditions: conditions
    };
    
    // Update request in localStorage (demo mode)
    updateRequestApproval(approvalData);
    
    // Show success message
    showNotification(`Request ${approvalData.action.toLowerCase()} successfully`, 'success');
    
    // Close modal and refresh
    closeModal('approvalActionModal');
    document.getElementById('approvalActionForm').reset();
    
    // Reload approval queue
    setTimeout(() => {
        loadApprovalQueue();
        loadApprovalHistory();
    }, 500);
}

function updateRequestApproval(approvalData) {
    const requests = getFinanceRequests();
    const requestIndex = requests.findIndex(r => r.requestNumber === approvalData.requestNumber);
    
    if (requestIndex !== -1) {
        // Add to approval history
        if (!requests[requestIndex].approvalHistory) {
            requests[requestIndex].approvalHistory = [];
        }
        
        requests[requestIndex].approvalHistory.push(approvalData);
        
        // Update status
        if (approvalData.action === 'Approved') {
            const chain = getApprovalChain(requests[requestIndex]);
            const allApproved = chain.every(level => 
                requests[requestIndex].approvalHistory.some(h => h.role === level.role && h.action === 'Approved')
            );
            
            if (allApproved) {
                requests[requestIndex].status = 'Approved';
            } else {
                requests[requestIndex].status = 'Under Review';
            }
        } else if (approvalData.action === 'Rejected') {
            requests[requestIndex].status = 'Rejected';
        } else {
            requests[requestIndex].status = 'Awaiting Information';
        }
        
        // Save back to localStorage
        localStorage.setItem('financeRequests', JSON.stringify(requests));
    }
}

/* ============================================ */
/* APPROVAL RULES */
/* ============================================ */
function loadApprovalRules() {
    const rules = getApprovalRules();
    renderApprovalRules(rules);
}

function getApprovalRules() {
    // In production, fetch from backend
    const rules = JSON.parse(localStorage.getItem('approvalRules') || '[]');
    
    if (rules.length === 0) {
        const defaultRules = [
            {
                id: 1,
                condition: 'amount',
                value: { min: 0, max: 10000 },
                approvers: ['department-head', 'finance-officer'],
                description: 'Requests under RD$ 10,000 require Department Head and Finance Officer approval'
            },
            {
                id: 2,
                condition: 'amount',
                value: { min: 10001, max: 25000 },
                approvers: ['department-head', 'finance-officer', 'treasurer'],
                description: 'Requests RD$ 10,001 - 25,000 require additional Treasurer approval'
            },
            {
                id: 3,
                condition: 'amount',
                value: { min: 25001, max: null },
                approvers: ['department-head', 'finance-officer', 'treasurer', 'pastor'],
                description: 'Requests over RD$ 25,000 require Pastor/Authorized Signatory approval'
            },
            {
                id: 4,
                condition: 'priority',
                value: 'urgent',
                approvers: ['finance-officer', 'pastor'],
                description: 'Urgent priority requests require Finance Officer and Pastor approval'
            }
        ];
        
        localStorage.setItem('approvalRules', JSON.stringify(defaultRules));
        return defaultRules;
    }
    
    return rules;
}

function renderApprovalRules(rules) {
    const grid = document.getElementById('approvalRulesGrid');
    if (!grid) return;
    
    grid.innerHTML = rules.map(rule => `
        <div class="approval-rule-card">
            <div class="rule-header">
                <h4><i class="fas fa-shield-alt"></i> ${getConditionLabel(rule.condition)}</h4>
                <button class="btn-icon" onclick="deleteRule(${rule.id})" title="Delete Rule">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <p class="rule-description">${rule.description}</p>
            <div class="rule-approvers">
                <strong>Approval Chain:</strong>
                <div class="approver-badges">
                    ${rule.approvers.map(approver => `
                        <span class="badge badge-primary">${getRoleTitle(approver)}</span>
                    `).join(' → ')}
                </div>
            </div>
        </div>
    `).join('');
}

function getConditionLabel(condition) {
    const labels = {
        'amount': 'Amount-Based Rule',
        'department': 'Department-Based Rule',
        'category': 'Category-Based Rule',
        'priority': 'Priority-Based Rule'
    };
    return labels[condition] || condition;
}

function toggleRuleFields() {
    const condition = document.getElementById('ruleCondition').value;
    const amountFields = document.getElementById('amountRangeFields');
    const valueField = document.getElementById('ruleValueField');
    const valueSelect = document.getElementById('ruleValue');
    
    // Hide all
    amountFields.style.display = 'none';
    valueField.style.display = 'none';
    
    if (condition === 'amount') {
        amountFields.style.display = 'flex';
    } else if (condition === 'department') {
        valueField.style.display = 'block';
        valueSelect.innerHTML = `
            <option value="">Select department</option>
            <option value="worship">Worship Team</option>
            <option value="childrens">Children's Ministry</option>
            <option value="youth">Youth Ministry</option>
            <option value="womens">Women's Ministry</option>
            <option value="mens">Men's Ministry</option>
            <option value="hospitality">Hospitality</option>
            <option value="tech">Tech Team</option>
            <option value="facilities">Facilities</option>
            <option value="administration">Administration</option>
            <option value="outreach">Outreach</option>
        `;
    } else if (condition === 'category') {
        valueField.style.display = 'block';
        valueSelect.innerHTML = `
            <option value="">Select category</option>
            <option value="ministry-supplies">Ministry Supplies</option>
            <option value="equipment">Equipment</option>
            <option value="maintenance">Maintenance & Repairs</option>
            <option value="utilities">Utilities</option>
            <option value="transportation">Transportation</option>
            <option value="events">Events & Programs</option>
            <option value="outreach">Outreach & Missions</option>
            <option value="technology">Technology</option>
            <option value="salaries">Salaries & Wages</option>
        `;
    } else if (condition === 'priority') {
        valueField.style.display = 'block';
        valueSelect.innerHTML = `
            <option value="">Select priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
        `;
    }
}

function handleAddRule(e) {
    e.preventDefault();
    showNotification('Rule added successfully', 'success');
    closeModal('addRuleModal');
    loadApprovalRules();
}

function deleteRule(ruleId) {
    if (confirm('Are you sure you want to delete this approval rule?')) {
        let rules = getApprovalRules();
        rules = rules.filter(r => r.id !== ruleId);
        localStorage.setItem('approvalRules', JSON.stringify(rules));
        loadApprovalRules();
        showNotification('Rule deleted successfully', 'success');
    }
}

/* ============================================ */
/* APPROVAL HISTORY */
/* ============================================ */
function loadApprovalHistory() {
    const requests = getFinanceRequests();
    const myApprovals = [];
    
    // Find all requests where current user has taken action
    requests.forEach(request => {
        if (request.approvalHistory) {
            const myActions = request.approvalHistory.filter(h => h.role === getRoleTitle(currentUserRole));
            myActions.forEach(action => {
                myApprovals.push({
                    ...action,
                    requestNumber: request.requestNumber,
                    requestorName: request.requestorInfo.fullName,
                    amount: request.requestDetails.amount,
                    purpose: request.requestDetails.purpose,
                    currentStatus: request.status
                });
            });
        }
    });
    
    // Sort by date (most recent first)
    myApprovals.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    renderApprovalHistory(myApprovals);
}

function renderApprovalHistory(approvals) {
    const tbody = document.getElementById('approvalHistoryTableBody');
    if (!tbody) return;
    
    if (approvals.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-history" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-light);">No approval history found.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = approvals.map(approval => `
        <tr>
            <td>${formatDateTime(approval.date)}</td>
            <td><strong>${approval.requestNumber}</strong></td>
            <td>${approval.requestorName}</td>
            <td><strong>RD$ ${approval.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
            <td>${approval.purpose}</td>
            <td>${getActionBadge(approval.action)}</td>
            <td>${getStatusBadge(approval.currentStatus)}</td>
        </tr>
    `).join('');
}

function getActionBadge(action) {
    if (action === 'Approved') {
        return '<span class="badge badge-success"><i class="fas fa-check"></i> Approved</span>';
    } else if (action === 'Rejected') {
        return '<span class="badge badge-danger"><i class="fas fa-times"></i> Rejected</span>';
    } else {
        return '<span class="badge badge-warning"><i class="fas fa-question-circle"></i> Requested Info</span>';
    }
}

/* ============================================ */
/* FILTER FUNCTIONS */
/* ============================================ */
function filterApprovalQueue() {
    // Reload with filters
    loadApprovalQueue();
}

function filterApprovalHistory() {
    // Reload with filters
    loadApprovalHistory();
}

/* ============================================ */
/* HELPER FUNCTIONS */
/* ============================================ */
function getFinanceRequests() {
    return JSON.parse(localStorage.getItem('financeRequests') || '[]');
}

function getCurrentUserName() {
    // In production, get from authentication
    const roleNames = {
        'department-head': 'John Smith',
        'finance-officer': 'Finance Director',
        'treasurer': 'Maria Rodriguez',
        'pastor': 'Pastor Luis Rodriguez'
    };
    return roleNames[currentUserRole] || 'Admin User';
}

function getRoleTitle(role) {
    const titles = {
        'department-head': 'Department Head',
        'finance-officer': 'Finance Officer',
        'treasurer': 'Treasurer',
        'pastor': 'Pastor/Authorized Signatory'
    };
    return titles[role] || role;
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

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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
