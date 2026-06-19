# CSV Import Feature - Usage Guide

## Overview
The CSV Import feature allows you to bulk import member data into the Church Platform. This is particularly useful for importing your existing 300-member list.

## How to Use

### Step 1: Prepare Your CSV File
1. Navigate to the `templates` folder in your church platform directory
2. Open **members-import-template.csv** in Excel, Google Sheets, or any spreadsheet program
3. Fill in your member data following the template format
4. Keep the header row unchanged (First Name, Last Name, Email, Phone, etc.)

### Step 2: Import the Data
1. Open the Church Platform and log into the Admin area
2. Go to **Administration > Members** tab
3. Click the **Import CSV** button (next to the Export button)
4. In the import modal, click **Choose CSV File**
5. Select your filled CSV file
6. Review the preview showing your data (first 10 records are displayed)
7. Check for any validation errors (if any appear in red)
8. Click **Import X Members** to complete the import

### Step 3: Verify Import
- The system will show a success message with the number of imported members
- Your members table will automatically refresh
- All imported members will appear with their data
- The total member count will update in the dashboard

## Required Fields
The following fields MUST be filled for each member:
- **First Name**
- **Last Name**
- **Email** (must be valid email format)
- **Phone**
- **Join Date** (format: YYYY-MM-DD, example: 2024-01-15)
- **Ministry** (Youth Ministry, Worship Team, etc.)
- **Status** (Active, Inactive, or New)

## Optional Fields
These fields can be left empty if information is not available:
- Birth Date
- Gender
- Address
- Notes
- Photo URL

## Important Notes

### Date Format
Dates MUST be in **YYYY-MM-DD** format:
- ✅ Correct: 2024-01-15
- ❌ Wrong: 01/15/2024, 15-01-2024, Jan 15 2024

### Status Values
Status must be exactly one of these (case-sensitive):
- Active
- Inactive
- New

### Email Validation
- Each email must contain an @ symbol
- Duplicate emails are allowed (for family members)

### Error Handling
- If validation errors are found, invalid records will be skipped
- Valid records will still be imported
- You'll see a list of all errors with line numbers
- Fix errors in your CSV and re-import the corrected records

### Duplicate Detection
- The system does NOT automatically detect duplicates
- Make sure your CSV doesn't contain duplicate entries
- If you import the same file twice, members will be added twice

## Tips for Success

### Excel/Google Sheets
- When saving from Excel, choose **CSV UTF-8 (Comma delimited) (*.csv)**
- Don't use "CSV (Comma delimited)" as it may cause encoding issues

### Large Imports
- You can import all 300 members at once
- The preview shows only the first 10 records, but all valid records will be imported
- Large imports may take a few seconds to process

### Testing First
1. Create a test CSV with 5-10 members first
2. Import the test file to verify everything works
3. Once confirmed, import your full member list

### After Import
- Members will have Status = "Active" by default
- You can edit any member individually after import
- You can add photos to members one at a time using the Edit button
- Photos cannot be bulk imported via CSV (upload them individually)

## Example Data

### Minimal Record (Required Fields Only)
```
First Name,Last Name,Email,Phone,Birth Date,Gender,Address,Join Date,Ministry,Status,Photo URL,Notes
John,Smith,john.smith@email.com,809-123-4567,,,,,2024-01-15,Worship Team,Active,,
```

### Complete Record (All Fields)
```
First Name,Last Name,Email,Phone,Birth Date,Gender,Address,Join Date,Ministry,Status,Photo URL,Notes
Marie,Laurent,marie.laurent@email.com,829-234-5678,1985-06-20,Female,"123 Main St, Santo Domingo",2023-03-20,Children's Ministry,Active,,"Active volunteer and Sunday School teacher"
```

## Troubleshooting

### "CSV file is empty or invalid"
- Make sure the file is actually a .csv file
- Check that it has at least one data row (besides the header)
- Open in Notepad to verify it's comma-separated

### "Missing required columns"
- The header row must exactly match the template
- Don't rename or remove header columns
- Column order doesn't matter, but names must match exactly

### "Invalid Join Date format"
- Check all dates are in YYYY-MM-DD format
- Don't use slashes (/) or other separators
- Month and day must be two digits (01-12 for month, 01-31 for day)

### "Status must be Active, Inactive, or New"
- Check for typos in the Status column
- Status is case-sensitive (must be "Active" not "active")
- No extra spaces before or after the status value

### Import Button Not Working
- Make sure you've selected a file first
- Check browser console for errors (F12)
- Try refreshing the page and uploading again

## Sample Files Provided

In the `templates` folder you'll find:
- **members-import-template.csv** - Empty template to fill in
- **SAMPLE-members-filled.csv** - Example with 10 complete member records
- **README.md** - Detailed documentation on field requirements
- **QUICK-REFERENCE.md** - One-page printable reference

## Need Help?

If you encounter issues:
1. Check the validation errors shown in the import modal
2. Verify your CSV matches the template format
3. Try importing a small test file first
4. Ensure all required fields are filled
5. Check that dates are in YYYY-MM-DD format

## Future Enhancements

Coming soon:
- Duplicate detection by email
- Photo bulk import support
- Update existing members (vs always adding new)
- Export to CSV with all current members
- Import history and rollback

---

**Last Updated:** January 2025  
**Feature Status:** Active and Ready to Use  
**Supported Formats:** CSV (Comma-separated values) only
