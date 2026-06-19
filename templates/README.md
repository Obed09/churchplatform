# Church Management System - Bulk Import Templates

## 📋 Overview
This folder contains CSV templates for bulk importing data into your church management system. Use these templates to quickly add multiple members, staff, volunteers, and visitors at once.

## 📁 Available Templates

### Template Files:
- `members-import-template.csv` - Empty template for members
- `staff-import-template.csv` - Empty template for staff
- `volunteers-import-template.csv` - Empty template for volunteers
- `visitors-import-template.csv` - Empty template for visitors
- `church-bulk-import-template.csv` - All-in-one combined template

### Sample Files (Filled Examples):
- `SAMPLE-members-filled.csv` - Example with 10 member records
- `SAMPLE-staff-filled.csv` - Example with 8 staff records

Use sample files to see exactly how data should be formatted!

---

### 1. **members-import-template.csv**
For importing church members with complete profile information.

**Required Fields:**
- First Name
- Last Name
- Email
- Phone
- Join Date
- Ministry
- Status

**Optional Fields:**
- Birth Date
- Gender
- Address
- Photo URL
- Notes

---

### 2. **staff-import-template.csv**
For importing church staff and leadership team.

**Required Fields:**
- Full Name
- Email
- Phone
- Role/Title
- Department

**Optional Fields:**
- Start Date
- Employment Type
- Bio
- Photo URL

---

### 3. **volunteers-import-template.csv**
For importing active volunteers and their service areas.

**Required Fields:**
- First Name
- Last Name
- Email
- Phone
- Ministry/Service Area
- Status

**Optional Fields:**
- Availability
- Skills
- Start Date
- Photo URL
- Notes

---

### 4. **visitors-import-template.csv**
For importing first-time visitors and tracking follow-ups.

**Required Fields:**
- Full Name
- Visit Date
- Phone

**Optional Fields:**
- Email
- How They Heard About Us
- Follow-up Status
- Notes
- Photo URL

---

## 🚀 How to Use These Templates

### Step 1: Download Template
1. Right-click on the template file you need
2. Select "Save As" or "Download"
3. Save to your computer

### Step 2: Fill In Data
1. Open the CSV file in **Excel**, **Google Sheets**, or any spreadsheet program
2. **Keep the header row (first line) exactly as shown** - DO NOT modify column names
3. Remove the sample data rows
4. Add your own data, one person per row
5. Fill in all required fields (marked in instructions inside the file)
6. Use the correct date format: **YYYY-MM-DD** (e.g., 2024-06-15)
7. Choose values from the options provided in the instructions

### Step 3: Save as CSV
1. In Excel: File → Save As → Choose "CSV (Comma delimited) (*.csv)"
2. In Google Sheets: File → Download → Comma Separated Values (.csv)
3. Keep the original filename or use a descriptive name

### Step 4: Import to System
*(Feature coming soon - Current version requires manual entry)*

---

## 📝 Important Notes

### Date Formatting
All dates MUST be in **YYYY-MM-DD** format:
- ✅ Correct: 2024-06-15
- ❌ Wrong: 06/15/2024
- ❌ Wrong: 15-06-2024

### Email Addresses
- Must be valid email format: name@domain.com
- No spaces allowed
- One email per person

### Phone Numbers
- Use consistent format: 829-XXX-XXXX
- Can include country code if needed: +1-829-XXX-XXXX
- No special characters except hyphens

### Text Fields with Commas
If any field contains a comma (like addresses), wrap it in quotes:
- Example: "123 Main St, Apt 4, Santo Domingo"

### Photo URLs
- Leave blank for now
- Photos can be uploaded manually after import
- Or provide direct URLs to hosted images

---

## ⚠️ Common Mistakes to Avoid

1. **Don't modify column headers** - The system needs exact column names
2. **Don't skip required fields** - Records with missing required data will be rejected
3. **Use correct date format** - YYYY-MM-DD only
4. **Don't add extra columns** - Use only the columns provided
5. **Don't use line breaks within cells** - Keep all data on single lines
6. **Save as CSV, not Excel** - The system requires CSV format

---

## 🎯 Field Options Reference

### Ministry/Department Options:
- Worship Team
- Children's Ministry
- Youth Ministry
- Hospitality
- Tech Team
- Prayer Team
- Outreach
- Administration
- Facilities
- Events
- Communications
- Parking
- Ushers
- Greeters

### Status Options:
- Active
- Inactive
- On Leave

### Employment Type Options:
- Full-Time
- Part-Time
- Volunteer
- Contract

### Gender Options:
- Male
- Female
- (or leave blank)

### How They Heard About Us Options:
- Friend/Family
- Social Media
- Website
- Passing By
- Other

### Follow-up Status Options:
- Pending
- Contacted
- Scheduled
- Completed
- No Response

---

## 💡 Tips for Success

1. **Start Small**: Test with 2-3 records first before importing hundreds
2. **Backup First**: Always backup your existing data before bulk import
3. **Clean Data**: Remove duplicates and verify information before import
4. **Consistent Formatting**: Use the same format for all similar fields
5. **Test in Stages**: Import members first, then staff, then volunteers
6. **Review After Import**: Check imported data for accuracy

---

## 🆘 Need Help?

If you encounter issues:
1. Check that your CSV file follows the exact format
2. Verify all required fields are filled
3. Ensure dates are in YYYY-MM-DD format
4. Make sure you saved as CSV, not Excel
5. Contact your system administrator

---

## 🔄 Future Features (Coming Soon)

- **Drag & drop CSV upload** interface in admin panel
- **Real-time validation** during import
- **Preview before import** to catch errors
- **Duplicate detection** to prevent duplicate entries
- **Bulk photo upload** with ZIP file support
- **Import history** and rollback capability
- **Error reports** showing exactly what needs to be fixed

---

## 📞 Contact

For technical support or questions:
- **Email**: admin@tabernacle.church
- **Phone**: 829-377-1099

---

**Last Updated**: June 10, 2026  
**Version**: 1.0  
**Compatible With**: Church Management System v1.0
