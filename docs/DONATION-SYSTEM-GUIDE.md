# Donation Management System - User Guide

## Overview
The Donation Management System is a comprehensive solution for tracking, managing, and reporting on church donations. It supports both one-time and recurring donations with full donor management and tax receipt generation.

## Features

### ✅ Donation Types
- **One-Time Donations**: Single donations for any category
- **Recurring Donations**: Automatic tracking of weekly, monthly, quarterly, or yearly giving

### ✅ Payment Methods Supported
- PayPal (integrated)
- Cash
- Check
- Bank Transfer
- Credit Card

### ✅ Donation Categories
- General Fund/Tithes
- Building Fund
- Missions
- Youth Ministry
- Special Events

### ✅ Donor Management
- Link donations to member profiles
- Support for anonymous donations
- Collect tax receipt information (name, email, phone, address)
- Track donor giving history

### ✅ Admin Features
- Complete donation history
- Advanced filtering (category, date range, donor)
- Search functionality
- Export to CSV/Excel
- Comprehensive reports and analytics
- Tax receipt generation
- Dashboard statistics

## How to Use

### Accessing Donations
1. Log into the Admin Panel
2. Go to **Administration** section
3. Click the **Donations** tab

### Adding a Donation

#### Option 1: Manual Entry
1. Click the **"Add Donation"** button
2. Fill in the donation information:
   - **Date**: When the donation was received
   - **Amount**: Donation amount in USD
   - **Category**: Select from dropdown
   - **Payment Method**: How they paid
   - **Type**: One-time or Recurring

3. Enter donor information:
   - **For Member Donors**: Select from "Link to Member" dropdown (auto-fills contact info)
   - **For Non-Members**: Enter name, email, phone, address manually
   - **For Anonymous**: Check "Anonymous Donation" box

4. Add additional details:
   - Transaction/Reference ID (for PayPal, check, etc.)
   - Status (Completed, Pending, Failed)
   - Notes

5. Click **"Save Donation"**

#### Option 2: PayPal Integration
PayPal donations can be manually recorded after receiving payment confirmation:
1. Add donation as described above
2. Select "PayPal" as payment method
3. Enter PayPal Transaction ID in the Reference ID field

### Recurring Donations
For recurring donations:
1. Set **Donation Type** to "Recurring"
2. Select **Frequency**: Weekly, Monthly, Quarterly, or Yearly
3. Add the first donation
4. Manually add subsequent donations as they are received

**Note**: Automatic recurring payments require PayPal subscription setup separately. This system tracks recurring donation records.

### Viewing Donations

#### Donations Table
The main table displays:
- Date of donation
- Donor name (or "Anonymous")
- Member badge if linked to a member
- Category with color-coded badge
- Amount
- Payment method
- Type (one-time or recurring with frequency)
- Status (completed, pending, failed)
- Action buttons

#### Filtering Donations
Use the filter options at the top:
- **Search**: Search by donor name, category, method, amount, or transaction ID
- **Category Filter**: Show donations for specific category only
- **Date Filter**: 
  - All Time
  - Today
  - This Week
  - This Month
  - This Year

### Editing Donations
1. Click the **Edit** icon (pencil) on any donation
2. Modify the information
3. Click **"Save Donation"**

### Deleting Donations
1. Click the **Delete** icon (trash) on any donation
2. Confirm the deletion
3. The record will be permanently removed

### Viewing Donation Details
Click the **Eye** icon to see full donation details including:
- All donation information
- Complete donor details
- Transaction ID
- Notes

## Reports & Analytics

### Accessing Reports
Click the **"Reports"** button in the Donations tab header

### Generating Reports
1. Set report parameters:
   - **Start Date**: Beginning of date range (optional)
   - **End Date**: End of date range (optional)
   - **Category**: Specific category or all categories

2. Click **"Generate Report"**

### Report Includes
- **Summary Statistics**:
  - Total amount for period
  - Total number of donations
  - Average donation amount
  - Number of unique donors

- **Breakdown by Category**: Shows total for each category

- **Top Donors**: Lists top 10 donors by total amount given

### Exporting Reports
- **Export to Excel**: Download report as spreadsheet
- **Print Report**: Print-friendly format

## Dashboard Statistics

The Donations tab displays four key metrics:

1. **Total Donations (All Time)**: Complete giving since records began
2. **This Month**: Current month's total
3. **Total Donors**: Number of unique donors
4. **Active Recurring**: Number of active recurring donation setups

## Tax Receipts

### Generating Tax Receipts
1. Click the **Receipt** icon (invoice) on any completed donation
2. System generates tax receipt with:
   - Donor information
   - Donation amount and date
   - Category
   - Church information
3. Receipt can be saved as PDF or printed

**Note**: Tax receipts can only be generated for non-anonymous donations.

### Annual Tax Receipts
To generate annual receipts for all donors:
1. Go to **Reports**
2. Set date range for the tax year (e.g., Jan 1 - Dec 31, 2026)
3. Generate report
4. Use "Top Donors" list to identify donors
5. Filter by donor and generate individual receipts

## Exporting Data

### Export All Donations
1. Click **"Export"** button in the Donations tab
2. CSV file downloads automatically with name: `donations_YYYY-MM-DD.csv`

### Export Includes
- Date
- Donor name, email, phone
- Category
- Amount
- Payment method
- Type and frequency
- Status
- Transaction ID
- Notes

### Use Cases for Export
- Accounting software import
- Backup of donation records
- End-of-year reporting
- External analysis in Excel

## Best Practices

### Recording Donations Promptly
- Enter cash and check donations immediately after receiving
- Record bank transfers when confirmed
- Add PayPal donations after transaction confirmation

### Linking to Members
- Always link member donations to their profile
- This helps with:
  - Automated year-end receipts
  - Member giving history
  - Communication about giving

### Categorizing Properly
- Use consistent categories
- "General Fund/Tithes" for regular giving
- Specific categories for designated gifts

### Anonymous Donations
- Respect donor anonymity requests
- Cannot generate tax receipts for anonymous gifts
- Still track for total giving statistics

### Transaction IDs
- Always record PayPal transaction IDs
- Use check numbers for check donations
- Create reference IDs for cash (e.g., "CASH-2026-001")

### Notes Field
- Document special instructions
- Note if donation is in honor/memory of someone
- Record any restrictions on use

## Recurring Donations Setup

### Manual Tracking Method (Current System)
1. Member commits to recurring giving
2. Add first donation with Type = "Recurring" and appropriate Frequency
3. Each time payment received, add new donation entry
4. Link all to same member for history tracking

### PayPal Recurring (External Setup)
1. Set up PayPal subscription buttons on website (requires PayPal Business account)
2. Members sign up through PayPal
3. PayPal sends payment notifications
4. Manually record each payment in this system as it's received

## Troubleshooting

### Can't Find a Donation
- Use the Search feature (searches multiple fields)
- Check date filters - may be set too narrowly
- Verify category filter is set to "All Categories"

### Donor Name Not Auto-Filling
- Ensure member is in the Members directory first
- Select from "Link to Member" dropdown
- Contact info will auto-populate

### Report Showing Wrong Totals
- Check date range filters
- Verify category filter
- Ensure you clicked "Generate Report" after changing filters

### Can't Generate Tax Receipt
- Only available for non-anonymous donations
- Donor must have name and address entered
- Donation must have status "Completed"

### Export Not Working
- Check browser's download folder
- Disable popup blockers
- Try different browser

## Security & Privacy

### Data Storage
- Donations stored in browser localStorage (demo mode)
- Production version should use secure database
- Regular backups recommended

### Anonymous Donations
- No donor information displayed in tables
- Excluded from donor history reports
- Cannot generate tax receipts

### Member Linking
- Only members visible in dropdown
- Automatically fills contact info
- Maintains giving history

## Future Enhancements

Coming soon:
- PayPal API integration for automatic recording
- Automated recurring donation tracking
- Email tax receipts directly to donors
- Pledge tracking and fulfillment
- Donor portal for viewing giving history
- Multi-currency support
- Batch tax receipt generation

## FAQs

**Q: Can I track pledges?**
A: Currently pledges must be tracked manually. Add notes when member commits, then record actual donations as received.

**Q: How do I handle split donations (multiple categories)?**
A: Create separate donation entries for each category portion.

**Q: Can donors access their giving history?**
A: Not currently. Generate reports filtered by donor name to provide them with statements.

**Q: What if a PayPal payment fails or is refunded?**
A: Edit the donation and change Status to "Failed". Add note explaining the situation.

**Q: Can I import past donations?**
A: Currently manual entry only. Consider using Export from your current system, then import to spreadsheet for reference.

**Q: How often should I backup donation data?**
A: Export to CSV weekly, and always before major system updates.

**Q: What about matching gifts?**
A: Record as separate donations from the matching organization, add note linking to original donor.

---

**Last Updated**: June 16, 2026  
**System Version**: 1.0  
**Support**: Contact your church administrator for assistance
