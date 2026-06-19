# Finance Request, Approval, Payment & Receipt Management System
## Complete Documentation

---

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [Public Request Portal](#public-request-portal)
4. [Admin Management Interface](#admin-management-interface)
5. [Approval Workflow](#approval-workflow)
6. [Payment Processing](#payment-processing)
7. [Receipt Management](#receipt-management)
8. [System Architecture](#system-architecture)
9. [Technical Specifications](#technical-specifications)
10. [Backend Integration Guide](#backend-integration-guide)
11. [Security & Compliance](#security-compliance)
12. [Troubleshooting](#troubleshooting)

---

## System Overview

### Purpose
This comprehensive Finance Request Management System eliminates verbal finance requests and creates a permanent digital audit trail from initial request through approval, payment, and receipt verification.

### Key Features
✅ Public request portal accessible via **churchwebsite.com/finance-request**  
✅ Multi-level approval workflow with automatic routing  
✅ Billet payment integration (Dominican Republic digital wallet)  
✅ Receipt upload and verification system  
✅ Complete audit trail with timestamps and user tracking  
✅ Mobile-first, elder-friendly design  
✅ Email & SMS notifications at each stage  
✅ Comprehensive analytics dashboard  
✅ Role-based access control  

### System Flow
```
Request Submitted → Approval Chain → Payment Processing → Receipt Upload → Verification → Completed
```

---

## Getting Started

### File Structure
```
church platform/
├── finance-request.html                 # Public request form
├── admin-finance.html                   # Admin requests management
├── admin-finance-approval.html          # Approval workflow interface
├── css/
│   ├── finance-request.css             # Request form styles
│   └── admin-styles.css                # Admin interface styles (includes all modals)
└── js/
    ├── finance-request.js              # Request form functionality
    ├── admin-finance-requests.js       # Request management functions
    └── admin-finance-approval.js       # Approval workflow functions
```

### Quick Start
1. Open `finance-request.html` in your browser to access the public request form
2. Open `admin-finance.html` to manage requests (Requests tab)
3. Open `admin-finance-approval.html` to review and approve requests

### Demo Mode
The system currently runs in **demo mode** using localStorage:
- Requests are stored locally in the browser
- Sample data is generated automatically
- No backend server required for testing
- All approval/payment/receipt functions are simulated

---

## Public Request Portal

### Accessing the Portal
**URL:** `churchwebsite.com/finance-request` or `finance-request.html`

### Shareable Links
The portal can be shared via:
- WhatsApp
- Email
- SMS
- Church communication groups
- Direct link from church website

### Request Form Process

#### **Step 1: Personal Information**
Required fields:
- Full Name
- Phone Number
- Email Address
- Department/Ministry
- Position/Role

#### **Step 2: Financial Request Details**
Required fields:
- Amount Requested (RD$)
- Budget Category
- Purpose of Request (brief summary)
- Detailed Explanation
- Date Funds Are Needed
- Priority Level (Low, Normal, High, Urgent)

Optional:
- Supporting Documents (quotes, invoices, receipts)

#### **Step 3: Payment Information**
Required fields:
- Billet Account Holder Name
- Billet Registered Phone Number

Optional:
- Billet Account Details/ID
- Alternative Payment Method (bank transfer, check, cash)

#### **Step 4: Review & Submit**
- Review all information
- Confirm accuracy
- Understand approval process
- Submit request

### Request Number Generation
Format: **FR-YYYYMMDD-####**
- Example: FR-20260615-0001
- Unique identifier for tracking
- Generated automatically on submission

### Success Confirmation
Upon submission, requestors receive:
- Request number
- Submission date and time
- Amount requested
- Confirmation message
- Next steps information

---

## Admin Management Interface

### Accessing Admin Interface
**URL:** `admin-finance.html` → **Requests Tab**

### Dashboard Overview

#### Request Statistics
Six real-time statistics cards display:
1. **Pending Review** - Requests awaiting approval
2. **Approved** - Requests approved and awaiting payment
3. **Awaiting Payment** - Requests ready for payment processing
4. **Completed** - Fully processed requests with verified receipts
5. **Total Requested** - Sum of all requested amounts
6. **Total Approved** - Sum of all approved amounts

#### Request Statuses
- **Submitted** - New request, not yet reviewed
- **Under Review** - In approval chain
- **Awaiting Information** - Approver requested more details
- **Approved** - Fully approved, ready for payment
- **Rejected** - Request denied
- **Awaiting Payment** - Approved, payment in progress
- **Paid** - Payment completed via Billet
- **Receipt Pending** - Payment made, awaiting receipt
- **Completed** - Receipt uploaded and verified

### Viewing Request Details
Click the **👁 View** button to see complete request information:
- Requestor details
- Financial request details
- Payment information
- Attached documents
- Approval history with timestamps
- Payment history
- Receipt history

### Filtering Requests
Filter by:
- Status (all statuses available)
- Department (all ministries)
- Date range
- Amount range
- Priority level

### Exporting Data
Click **📥 Export** to download:
- Request data in CSV format
- For reporting and analysis
- Includes all request details

---

## Approval Workflow

### Accessing Approval Interface
**URL:** `admin-finance-approval.html`

### Approval Chain Levels

#### 1. Department Head
- First level approval
- Reviews all requests from their department
- Can approve, reject, or request more information

#### 2. Finance Officer
- Second level approval
- Reviews financial viability
- Checks budget availability
- Required for all requests

#### 3. Treasurer
- Third level approval
- **Required for amounts over RD$ 10,000**
- Final financial review before payment

#### 4. Pastor/Authorized Signatory
- Highest level approval
- **Required for:**
  - Amounts over RD$ 25,000
  - Urgent priority requests
  - Special circumstances

### Automatic Routing Rules

#### Default Rule Set:
1. **Under RD$ 10,000:**
   - Department Head → Finance Officer

2. **RD$ 10,001 - 25,000:**
   - Department Head → Finance Officer → Treasurer

3. **Over RD$ 25,000:**
   - Department Head → Finance Officer → Treasurer → Pastor

4. **Urgent Priority:**
   - Finance Officer → Pastor (expedited)

### Approval Actions

#### **Approve**
- Moves request to next approval level
- Records approver name, role, date/time
- Adds comments/conditions (optional)
- Auto-routes to next approver

#### **Reject**
- Stops approval process
- Request status changed to "Rejected"
- **Required:** Comments explaining rejection
- Notification sent to requestor

#### **Request More Information**
- Request status changed to "Awaiting Information"
- Requestor notified with specific questions
- Approval chain pauses until information provided
- Requestor can update and resubmit

### Approval Interface Features

#### Pending Approvals Queue
Visual cards showing:
- Request priority (color-coded)
- Days waiting
- Requestor name and department
- Amount requested
- Date needed
- Purpose summary
- Approval progress indicator

#### Approval Progress Indicator
Visual chain showing:
- ✅ Completed approvals (green)
- ⏳ Current approval level (blue, pulsing)
- ⚪ Pending approvals (gray)

#### Approval History
Table showing all approvals made by current user:
- Date & time of action
- Request number
- Requestor name
- Amount
- Purpose
- Action taken (Approved/Rejected/Requested Info)
- Current request status

### Configurable Approval Rules

Administrators can create custom rules based on:
- **Amount Range** (min/max thresholds)
- **Department** (specific ministry)
- **Budget Category** (equipment, maintenance, etc.)
- **Priority Level** (urgent, high, normal, low)

Each rule defines:
- Approval chain levels required
- Order of approvers
- Conditions for routing

---

## Payment Processing

### Accessing Payment Interface
From **Requests Tab** → Click **💲 Process Payment** on approved requests

### Payment Modal Features

#### Payment Summary Display
- Request number
- Requestor name
- Purpose
- Amount to pay (read-only)

#### Billet Account Information
Displays requestor's Billet details:
- Account holder name
- Registered phone number
- Additional account details (if provided)

#### Payment Form Fields

**Payment Amount (RD$)**
- Pre-filled from request
- Read-only to prevent errors

**Payment Method**
Options:
- Billet (Digital Wallet) - DEFAULT
- Bank Transfer
- Check
- Cash

**Transaction ID / Reference Number**
- Required field
- Enter Billet transaction confirmation number
- Used for reconciliation and audit

**Payment Date**
- Date payment was processed
- Defaults to today
- Can be adjusted if needed

**Payment Notes**
- Optional field
- Additional details about payment
- Special conditions or instructions

**Confirmation Checkbox**
- **REQUIRED** - Must confirm payment complete
- "I confirm that payment has been successfully processed through Billet and the transaction is complete"

### Payment Record Created
Upon submission, system records:
- Paid by (current user name)
- Payment date and time
- Amount paid
- Payment method
- Transaction ID
- Notes

### Post-Payment Status Update
- Request status changes to **"Paid"**
- Payment history added to request
- Notification sent to:
  - Requestor (payment completed)
  - Finance team (for tracking)
  - Receipt upload reminder

---

## Receipt Management

### Accessing Receipt Upload
From **Requests Tab** → Click **🧾 Upload Receipt** on paid requests

### Receipt Upload Modal Features

#### Request Summary
- Request number
- Requestor name
- Amount paid

#### Payment Information Display
Shows details of completed payment:
- Payment method used
- Transaction ID
- Payment date
- Who processed payment

#### Receipt Upload Section

**Upload Receipt/Proof of Payment**
- Click to browse or drag & drop
- Accepted formats: JPG, PNG, PDF
- Maximum file size: 5MB
- Shows file preview after selection

**Receipt Type**
Required dropdown:
- Billet Transaction Screenshot
- Bank Receipt
- Paid Invoice
- Official Receipt
- Other

**Receipt Notes**
- Optional field
- Additional context about receipt
- Discrepancies or special notes

**Immediate Verification Option**
Checkbox: "Verify and approve this receipt immediately"
- Checked by default
- Finance officers can verify on upload
- Saves time for straightforward receipts

### Receipt Verification Workflow

#### Option 1: Immediate Verification (Default)
- Upload and verify in one step
- Request status → **"Completed"**
- Verification recorded with:
  - Verified by (user name)
  - Verification date/time
  - Comments: "Receipt uploaded and verified"

#### Option 2: Pending Verification
- Uncheck "verify immediately"
- Request status → **"Receipt Pending"**
- Receipt queued for review
- Separate verification process required

### Receipt History Tracking
Each receipt record includes:
- Uploaded by (name)
- Upload date/time
- File name and size
- Receipt type
- Notes
- Verification status
- Verified by (if verified)
- Verification date
- Verification comments

### File Preview
After upload, displays:
- File icon (PDF or image)
- File name
- File size
- Remove button (before submission)

---

## System Architecture

### Frontend Architecture
```
Public Portal (finance-request.html)
    ↓
Admin Management (admin-finance.html)
    ├── Requests Tab (admin-finance-requests.js)
    ├── Payment Processing Modal
    └── Receipt Upload Modal
    
Approval Workflow (admin-finance-approval.html)
    ↓
Approval Interface (admin-finance-approval.js)
```

### Data Flow
```
1. Request Submission
   ↓
2. localStorage or Backend API
   ↓
3. Approval Queue Display
   ↓
4. Approval Actions
   ↓
5. Payment Processing
   ↓
6. Receipt Upload
   ↓
7. Verification & Completion
```

### Current Storage (Demo Mode)
**localStorage Keys:**
- `financeRequests` - Array of all requests
- `approvalRules` - Array of approval routing rules
- `currentUser` - Authenticated user session (sessionStorage)

### Request Object Structure
```javascript
{
    requestNumber: "FR-20260615-0001",
    submissionDate: "2026-06-15T10:30:00Z",
    status: "Submitted | Under Review | Approved | Rejected | Paid | Completed",
    requestorInfo: {
        fullName: "",
        phone: "",
        email: "",
        department: "",
        position: ""
    },
    requestDetails: {
        amount: 0.00,
        budgetCategory: "",
        purpose: "",
        explanation: "",
        dateNeeded: "YYYY-MM-DD",
        priority: "urgent | high | normal | low"
    },
    paymentInfo: {
        billetAccountName: "",
        billetPhone: "",
        billetAccountDetails: "",
        alternativePayment: "",
        alternativeDetails: ""
    },
    attachments: [
        { name: "", size: 0, type: "" }
    ],
    approvalHistory: [
        {
            approver: "",
            role: "",
            action: "Approved | Rejected | Requested More Information",
            date: "",
            comments: "",
            conditions: ""
        }
    ],
    paymentHistory: [
        {
            paidBy: "",
            paidDate: "",
            amount: 0.00,
            method: "",
            transactionId: "",
            notes: ""
        }
    ],
    receiptHistory: [
        {
            uploadedBy: "",
            uploadedDate: "",
            fileName: "",
            fileSize: 0,
            fileType: "",
            receiptType: "",
            notes: "",
            verified: true/false,
            verifiedBy: "",
            verifiedDate: "",
            comments: ""
        }
    ]
}
```

---

## Technical Specifications

### Technologies Used
- **HTML5** - Semantic structure
- **CSS3** - Styling with CSS variables
- **JavaScript ES6+** - Client-side functionality
- **Font Awesome 6.4.0** - Icons
- **localStorage** - Demo mode data persistence

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Breakpoints
- **Desktop:** Default styles
- **Tablet:** max-width: 768px
- **Mobile:** max-width: 480px

### Color Scheme
```css
--primary: #2c5282 (Blue)
--accent: #d4af37 (Gold)
--success: #38a169 (Green)
--warning: #d69e2e (Yellow)
--danger: #e53e3e (Red)
```

### Form Validation
- **Client-side:** JavaScript validation before submission
- **Required fields:** Marked with red asterisk (*)
- **Email validation:** Regex pattern matching
- **Phone validation:** Format checking
- **Amount validation:** Must be greater than 0
- **File validation:** Size limit 5MB (receipts) / 10MB (attachments)

---

## Backend Integration Guide

### API Endpoints Needed

#### Requests
```
POST   /api/finance-requests           # Submit new request
GET    /api/finance-requests           # Get all requests (with filters)
GET    /api/finance-requests/:id       # Get specific request
PUT    /api/finance-requests/:id       # Update request
DELETE /api/finance-requests/:id       # Delete request (admin only)
```

#### Approvals
```
POST   /api/finance-requests/:id/approve     # Approve request
POST   /api/finance-requests/:id/reject      # Reject request
POST   /api/finance-requests/:id/request-info # Request more information
GET    /api/approval-rules                    # Get approval rules
POST   /api/approval-rules                    # Create approval rule
```

#### Payments
```
POST   /api/finance-requests/:id/payment     # Record payment
GET    /api/payments                          # Get all payments
POST   /api/billet/process                    # Process Billet payment (if integrated)
```

#### Receipts
```
POST   /api/finance-requests/:id/receipt     # Upload receipt
POST   /api/finance-requests/:id/verify-receipt # Verify receipt
GET    /api/receipts/:id                      # Get receipt file
```

#### Notifications
```
POST   /api/notifications/email               # Send email notification
POST   /api/notifications/sms                 # Send SMS notification
```

### Billet Integration

#### Billet API Requirements (Dominican Republic)
Research and integrate with Billet payment gateway:
- Account creation/verification
- Payment processing
- Transaction status checking
- Webhook for payment confirmations

#### Implementation Steps:
1. Register for Billet merchant account
2. Obtain API credentials
3. Implement payment initiation
4. Handle payment callbacks
5. Update request status automatically
6. Store transaction confirmations

### Email/SMS Notification System

#### Email Templates Needed:
1. **Request Submitted** - Confirmation to requestor
2. **Request Assigned** - To approver
3. **Request Approved** - To requestor and next approver
4. **Request Rejected** - To requestor with reasons
5. **Information Requested** - To requestor with questions
6. **Payment Completed** - To requestor
7. **Receipt Uploaded** - To finance team
8. **Request Completed** - Final confirmation to all parties

#### SMS Templates (Brief versions):
- "Finance request #FR-20260615-0001 submitted successfully"
- "You have a finance request awaiting approval"
- "Your request #FR-20260615-0001 has been approved"
- "Payment completed for request #FR-20260615-0001"

### Database Schema

#### Tables Required:

**finance_requests**
- id (Primary Key)
- request_number (Unique)
- submission_date
- status
- requestor_id (Foreign Key to users)
- amount
- budget_category
- purpose
- explanation
- date_needed
- priority
- created_at
- updated_at

**request_approval_history**
- id (Primary Key)
- request_id (Foreign Key)
- approver_id (Foreign Key to users)
- role
- action
- comments
- conditions
- created_at

**request_payment_history**
- id (Primary Key)
- request_id (Foreign Key)
- paid_by (Foreign Key to users)
- amount
- method
- transaction_id
- notes
- payment_date
- created_at

**request_receipt_history**
- id (Primary Key)
- request_id (Foreign Key)
- uploaded_by (Foreign Key to users)
- file_path
- file_name
- file_size
- receipt_type
- notes
- verified
- verified_by (Foreign Key to users)
- verified_date
- verification_comments
- created_at

**approval_rules**
- id (Primary Key)
- condition_type
- condition_value
- approver_roles (JSON array)
- description
- active
- created_at

---

## Security & Compliance

### Authentication & Authorization
- **Role-based access control (RBAC)**
- Roles: Requestor, Department Head, Finance Officer, Treasurer, Pastor, Admin
- Session management
- Password encryption
- Two-factor authentication (recommended)

### Data Security
- HTTPS/SSL required for production
- Input sanitization (prevent XSS)
- SQL injection prevention (parameterized queries)
- File upload validation and scanning
- Data encryption at rest (sensitive financial data)

### Audit Trail Requirements
System maintains permanent records of:
- ✅ Who requested funds
- ✅ Amount requested
- ✅ Reason for request
- ✅ Date and time submitted
- ✅ Who reviewed/approved/rejected
- ✅ When approved/rejected
- ✅ How payment was made
- ✅ Proof of payment completion
- ✅ Any comments or conditions

### Data Retention
- Keep all finance request records for **minimum 7 years**
- Regular automated backups
- Secure archive system for old requests
- Compliance with financial regulations

### Privacy Considerations
- Only authorized personnel can view requests
- Requestor can only view their own requests
- Sensitive payment information encrypted
- Personal data protected per privacy laws

---

## Troubleshooting

### Common Issues

#### Request Not Appearing in Admin
**Cause:** localStorage not syncing or browser privacy settings  
**Solution:**
- Check browser console for errors
- Verify localStorage is enabled
- Ensure same browser and device
- Clear cache and reload

#### Approval Not Routing Correctly
**Cause:** Approval rules misconfigured or user role incorrect  
**Solution:**
- Check approval rules in system
- Verify user role assignment
- Review approval chain logic
- Check console for routing errors

#### File Upload Failing
**Cause:** File too large or unsupported format  
**Solution:**
- Check file size (max 5MB receipts, 10MB attachments)
- Verify file format (images, PDF only)
- Try different file
- Check browser permissions

#### Payment Modal Not Opening
**Cause:** Request not in correct status  
**Solution:**
- Request must be "Approved" status
- Check if already paid
- Verify user has payment permissions
- Reload page and try again

#### Receipt Upload Not Working
**Cause:** Payment not yet recorded  
**Solution:**
- Process payment first
- Request must be "Paid" status
- Check file size and format
- Verify user has receipt permissions

### Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Request not found" | Request ID invalid | Check request number, reload page |
| "Please fill in all required fields" | Missing required data | Complete all fields marked with * |
| "File size exceeds limit" | File too large | Reduce file size or compress |
| "Invalid email format" | Email not valid | Check email address format |
| "Amount must be greater than 0" | Invalid amount | Enter positive number |

### Browser Console Debugging
Press **F12** to open developer tools and check:
- Console tab for JavaScript errors
- Network tab for API call failures
- Application tab to inspect localStorage data

---

## Support & Contact

### For Technical Issues
- Email: it@churchname.org
- Phone: 829-377-1099

### For Financial Questions
- Finance Department: 829-303-0241
- Email: finance@churchname.org

### System Administrator
- Contact: admin@churchname.org

---

## Version History

### Version 1.0 (June 2026)
- ✅ Public finance request portal
- ✅ Admin requests management interface
- ✅ Multi-level approval workflow
- ✅ Billet payment integration (ready)
- ✅ Receipt upload and verification
- ✅ Complete audit trail system
- ✅ Notification system framework
- ✅ Mobile-responsive design
- ✅ Demo mode with sample data

### Planned Features (Future Versions)
- 📅 Recurring request templates
- 📅 Budget planning integration
- 📅 Advanced analytics and reporting
- 📅 Mobile app (iOS/Android)
- 📅 Automated payment processing via Billet API
- 📅 OCR receipt scanning
- 📅 Multi-currency support
- 📅 Integration with accounting software

---

## Conclusion

This Finance Request Management System provides your church with a comprehensive, auditable, and efficient way to handle all financial requests from submission through completion. The system ensures transparency, accountability, and proper financial stewardship while making the process easy for both requestors and approvers.

For questions, training, or customization requests, please contact the system administrator.

---

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Author:** Church IT Team  
**Status:** Production Ready (Requires Backend Integration)
