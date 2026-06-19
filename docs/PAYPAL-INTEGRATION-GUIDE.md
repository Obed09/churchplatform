# PayPal Integration Guide
## Tabernacle Amour Pour Le Calvaire

---

## Your PayPal Configuration

**PayPal Account Email:** amorporelcalvario@gmail.com  
**Account Type:** Personal Account  
**Currency:** DOP (Dominican Peso)  
**Environment:** Live (Production)  
**Integration Method:** Manual Entry + Optional Website Buttons

---

## How It Works

### Current Setup: Manual Entry
You receive PayPal donations directly to your email (amorporelcalvario@gmail.com), then manually record them in the admin panel.

**When someone sends you money via PayPal:**
1. You'll receive an email notification from PayPal
2. Log into your admin panel
3. Go to Administration > Donations tab
4. Click "Add Donation"
5. Fill in the details:
   - Amount (in DOP)
   - Category (Tithes, Building, Missions, etc.)
   - Payment Method: Select "PayPal"
   - Donor information
   - **Important:** Enter the PayPal Transaction ID from the email notification

### Benefits of Manual Entry
✅ No technical setup required  
✅ Full control over what gets recorded  
✅ Works with Personal PayPal accounts  
✅ Can verify donations before adding  
✅ Add notes and categorize properly  

---

## Optional: Add PayPal Buttons to Your Website

If you want visitors to donate directly through your website, you can add PayPal donation buttons.

### Option 1: Simple PayPal "Donate" Button

Add this code to your website where you want the donation button to appear:

```html
<!-- PayPal Donate Button -->
<form action="https://www.paypal.com/donate" method="post" target="_top">
    <input type="hidden" name="business" value="amorporelcalvario@gmail.com" />
    <input type="hidden" name="currency_code" value="DOP" />
    <input type="hidden" name="item_name" value="Donation to Tabernacle Amour Pour Le Calvaire" />
    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
</form>
```

### Option 2: Custom Amount Donation Buttons

For specific donation categories, see the `paypal-donation-buttons.html` file in the `docs` folder.

---

## How to Receive PayPal Donations

### Step 1: Share Your PayPal Information
Tell people they can donate via PayPal to: **amorporelcalvario@gmail.com**

They can:
- Send money directly using the PayPal app
- Use PayPal.me link (create at paypal.com)
- Click donation buttons on your website (if you add them)

### Step 2: Receive Notification
When someone donates:
1. PayPal sends you an email notification
2. Email shows:
   - Donor name
   - Amount in DOP
   - Transaction ID (format: XXX-XXXXXX)
   - Date and time
   - Any message from donor

### Step 3: Record in Admin System
1. Log into your church admin panel
2. Go to **Administration > Donations tab**
3. Click **"Add Donation"** button
4. Fill in the form:
   - **Date:** Date from PayPal notification
   - **Amount:** Exact amount received (in DOP)
   - **Category:** Ask donor or use General Fund/Tithes
   - **Payment Method:** Select "PayPal"
   - **Type:** One-time (or Recurring if they set up subscription)
   - **Donor Name:** From PayPal notification
   - **Donor Email:** From PayPal notification
   - **Transaction ID:** Copy from PayPal email (VERY IMPORTANT for tracking)
   - **Status:** Completed
   - **Notes:** Any message donor included

5. Click **"Save Donation"**

### Step 4: Optional - Send Thank You
- Email the donor a thank you message
- Generate tax receipt if needed (use the receipt button in admin)

---

## PayPal Transaction IDs

**What They Look Like:**
- Format: `XXX-XXXXXXXXXXXXXX` (example: `8LK123456789ABCDE`)
- Found in PayPal notification emails
- Also visible in your PayPal account transaction history

**Why They're Important:**
- Unique identifier for each donation
- Helps with reconciliation and disputes
- Required for refunds or inquiries
- Proves the donation occurred

**Always record the Transaction ID** when adding donations to your admin system!

---

## Checking Your PayPal Balance

1. Go to [www.paypal.com](https://www.paypal.com)
2. Log in with: amorporelcalvario@gmail.com
3. Dashboard shows your balance in DOP
4. Click "Activity" to see all transactions
5. Click any transaction to see full details including Transaction ID

---

## Transferring Money to Your Bank

### From PayPal to Bank Account:
1. Log into PayPal
2. Click "Transfer Money"
3. Click "Transfer to Bank"
4. Enter amount
5. Select your linked bank account
6. Confirm transfer

**Transfer Times:**
- Standard Transfer: 1-3 business days (FREE)
- Instant Transfer: Within 30 minutes (may have fee)

**Note:** Make sure you have a bank account linked to your PayPal. If not:
- Go to Settings > Banks and Cards
- Click "Link a Bank"
- Follow the verification process

---

## Currency Information

**Your Currency: DOP (Dominican Peso)**
- Symbol: RD$
- Decimal places: 2 (example: RD$1,500.00)

### If Someone Donates in Different Currency
PayPal automatically converts to DOP:
- They pay in their currency (USD, EUR, etc.)
- PayPal converts to DOP
- You receive DOP in your account
- Small conversion fee may apply (PayPal's standard rate)

---

## PayPal Fees

PayPal charges fees for receiving money:

**Standard Rates (Dominican Republic):**
- Domestic transactions: ~2.9% + fixed fee
- International: ~4.4% + fixed fee
- Personal account receiving donations: May vary

**Example:**
- Someone donates RD$1,000
- Fee: ~RD$30-45
- You receive: ~RD$955-970

**Minimizing Fees:**
- Upgrade to Business account (if processing many donations)
- Use "Friends & Family" option for in-person donations (but loses protection)
- Consider fees when setting suggested donation amounts

---

## Security & Best Practices

### Protect Your Account
✅ Use strong, unique password  
✅ Enable 2-factor authentication (2FA)  
✅ Never share your password  
✅ Check activity regularly for unauthorized transactions  
✅ Only access PayPal on secure networks (not public WiFi)  

### Recording Donations
✅ Record within 24 hours of receiving  
✅ Always enter Transaction ID  
✅ Keep PayPal notification emails  
✅ Export reports monthly for backup  
✅ Reconcile with bank statements  

### Donor Privacy
✅ Mark anonymous if donor requests  
✅ Don't share donor information  
✅ Secure admin panel with strong password  
✅ Only authorized staff access donation records  

---

## Troubleshooting

### Problem: Didn't Receive Donation Notification
**Solutions:**
- Check spam/junk folder
- Log into PayPal directly to check Activity
- Add noreply@paypal.com to contacts
- Check notification settings in PayPal

### Problem: Transaction ID Not in Email
**Solutions:**
- Log into PayPal.com
- Click "Activity"
- Click the transaction
- Transaction ID shown at top of details

### Problem: Donor Says They Sent Money But You Didn't Get It
**Solutions:**
- Verify they sent to correct email: amorporelcalvario@gmail.com
- Check if payment is "Pending" (may need verification)
- Look in PayPal Activity for their name
- Contact PayPal support if not found

### Problem: Need to Refund a Donation
**Solutions:**
- Log into PayPal
- Find transaction in Activity
- Click "Refund"
- Enter amount (partial or full)
- Confirm refund
- Update donation status to "Failed" in admin system

---

## Upgrading to PayPal Business Account

### Benefits:
- Accept credit/debit cards without PayPal account
- Lower fees for nonprofits (with verification)
- Create donation buttons and subscription options
- Access to PayPal API for automation
- Accept donations under business name

### How to Upgrade:
1. Log into PayPal
2. Settings > Account Type
3. Click "Upgrade to Business Account"
4. Provide business information
5. Verify with documents (if required)

### Required for Automation:
If you later want automatic donation recording (no manual entry), you'll need:
- Business account
- API credentials (Client ID & Secret)
- Developer at developer.paypal.com

---

## Donation Button Examples

I've created ready-to-use PayPal button code in:
**`docs/paypal-donation-buttons.html`**

These include:
- General donation button
- Category-specific buttons (Tithes, Building, Missions, Youth, Events)
- Buttons in different styles and sizes
- Buttons with preset amounts

Just copy the HTML code and paste it into your website where you want the button.

---

## Monthly Reconciliation Checklist

Use this checklist at the end of each month:

- [ ] Export donation records from admin (Donations tab > Export)
- [ ] Export PayPal transactions (PayPal > Activity > Statements)
- [ ] Compare totals - should match
- [ ] Verify all PayPal donations have Transaction IDs
- [ ] Check for any missing or duplicate entries
- [ ] Transfer balance to church bank account (if needed)
- [ ] Generate monthly donation report
- [ ] Back up donation data (export CSV)
- [ ] File PayPal statement with church records

---

## Support & Resources

### PayPal Help
- **Help Center:** https://www.paypal.com/do/help
- **Contact:** Through PayPal website (Help > Contact Us)
- **Phone:** Check PayPal website for Dominican Republic support number

### System Support
- **Documentation:** See `DONATION-SYSTEM-GUIDE.md`
- **Admin Guide:** See `ADMIN-SYSTEM-README.md`

---

## Quick Reference Card

**PayPal Account:** amorporelcalvario@gmail.com  
**Currency:** DOP (Dominican Peso)  
**When Donation Received:**
1. Check PayPal email notification
2. Get Transaction ID
3. Log into admin panel
4. Administration > Donations > Add Donation
5. Fill form with PayPal details
6. Save

**Important Fields:**
- Transaction ID (from PayPal)
- Exact amount in DOP
- Donor name and email
- Date of donation

---

**Last Updated:** June 16, 2026  
**Configuration Status:** ✅ Active and Ready  
**Next Steps:** Start receiving and recording donations!
