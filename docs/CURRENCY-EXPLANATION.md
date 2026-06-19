# 💱 Currency Explanation - USD vs DOP

## ⚠️ Important: Why USD on Website, DOP in Admin Panel?

### The PayPal Limitation

**PayPal Personal accounts in Dominican Republic do NOT accept DOP donations.**

When we tried to use DOP, PayPal showed this error:
> **"Esta organización no acepta donativos en DOP"**  
> (This organization does not accept donations in DOP)

### The Solution

✅ **Public Website (index.html)**: Uses **USD** for PayPal  
✅ **Admin Panel**: Uses **DOP** for internal tracking

---

## 🌐 How It Works Now

### For Website Visitors:

1. **Visit donation page** → Sees amounts in USD ($10, $20, $50, $100)
2. **Clicks "DONATE NOW"** → Goes to PayPal
3. **PayPal processes in USD** → Payment accepted ✅
4. **If visitor has DOP**, PayPal converts automatically
5. **Donor receives confirmation** in their currency

### For You (Admin):

1. **Receive PayPal notification** → Amount in USD
2. **Convert USD to DOP** using exchange rate
3. **Record in admin panel** → Enter amount in DOP
4. **Track everything in DOP** → Your preferred currency

---

## 💵 Currency Conversion

### Current Exchange Rate (approximate):
**1 USD ≈ 55-58 DOP** (check current rate)

### Quick Reference:
| USD  | DOP (approx) |
|------|--------------|
| $10  | RD$550-580   |
| $20  | RD$1,100-1,160 |
| $50  | RD$2,750-2,900 |
| $100 | RD$5,500-5,800 |

### Get Current Rate:
- Google: "USD to DOP"
- xe.com
- PayPal notification shows exact conversion
- Your bank's exchange rate

---

## 📥 Recording Donations (Step-by-Step)

### When You Receive PayPal Notification:

**Example: Someone donates $50 USD**

1. **Check PayPal Email**
   - Amount: $50.00 USD
   - Transaction ID: 8LK123456789ABCDE
   - Donor: John Doe

2. **Convert to DOP**
   - Today's rate: 1 USD = 57 DOP (example)
   - Calculation: $50 × 57 = RD$2,850

3. **Record in Admin Panel**
   - Open: Administration > Donations
   - Click: "Add Donation"
   - **Amount**: Enter `2850` (in DOP)
   - **Payment Method**: PayPal
   - **Transaction ID**: Copy from email
   - **Notes**: Add "Received $50 USD (rate: 57)"
   - Click: Save

4. **Done!** ✅

---

## 🎯 Best Practices

### Option 1: Record in DOP (Recommended)
- Convert each donation to DOP when recording
- Add note: "Received $XX USD"
- All reports in DOP (your local currency)
- Easy for accounting

### Option 2: Record in USD (Alternative)
- Change admin panel currency to USD
- All tracking in USD
- Simpler (no conversion needed)
- Convert to DOP at month-end for accounting

**We recommend Option 1** (record in DOP) since your church operates in Dominican Republic.

---

## 💡 Why Different Currencies?

### PayPal Limitation:
- **Personal Accounts** in Dominican Republic: USD only
- **Business Accounts**: Can accept multiple currencies including DOP

### Your Options:

#### Option A: Keep Current Setup ✅ (Easiest)
- Website: USD for PayPal processing
- Admin: DOP for internal tracking
- **Pros**: Works immediately, no PayPal changes needed
- **Cons**: Manual conversion required

#### Option B: Upgrade to PayPal Business Account
- Costs: Monthly fees or transaction fees
- **Benefit**: Can accept DOP directly
- **Benefit**: API access for automation
- **Benefit**: Recurring subscriptions
- **Steps**:
  1. Log into PayPal
  2. Settings > Upgrade to Business Account
  3. Complete business verification
  4. Enable DOP currency
  5. Update website to use DOP

---

## 📊 Monthly Reconciliation with USD/DOP

### At End of Month:

1. **Export from PayPal**
   - Log into PayPal.com
   - Activity > Statements > Custom
   - Download CSV (shows USD amounts)

2. **Export from Admin Panel**
   - Donations > Reports > Export
   - Shows DOP amounts

3. **Compare Totals**
   - PayPal Total: $XXX USD
   - Admin Total: RD$X,XXX DOP
   - Convert USD to DOP using average rate
   - Should match (within exchange rate variation)

### Example:
```
PayPal Report:  $1,000 USD total
Admin Report:   RD$57,000 DOP total
Exchange Rate:  57 DOP per USD
Check: $1,000 × 57 = RD$57,000 ✅ Match!
```

---

## 🔧 Quick Reference: Recording USD Donations

### Template for Notes Field:
```
Received via PayPal (USD)
Original amount: $50.00 USD
Exchange rate: 57.00
Converted: RD$2,850
```

### Calculator Bookmark:
Create this formula in Excel/Google Sheets:
```
=A1*57
```
(Where A1 = USD amount, 57 = exchange rate)

---

## ❓ Common Questions

### Q: Why can't I just change PayPal to DOP?
**A:** PayPal Personal accounts in DR are restricted to USD only. This is PayPal's policy, not something we can change in the code.

### Q: Will visitors with DOP be able to donate?
**A:** Yes! PayPal automatically converts any currency to USD. Visitors can pay with DOP credit cards/bank accounts - PayPal handles the conversion.

### Q: What if I want everything in DOP?
**A:** Upgrade to PayPal Business account. This allows DOP acceptance. Then update the website currency code from USD to DOP.

### Q: Are exchange rates updated automatically?
**A:** No. You manually convert each donation when recording it. Use the rate from PayPal's notification email (it shows the conversion).

### Q: Can I change the admin panel to USD instead?
**A:** Yes! If you prefer to track in USD:
1. Keep admin records in USD (no conversion)
2. Convert to DOP only for final accounting/reports
3. Simpler but may need DOP for tax purposes

---

## 🎯 Summary

**Current Setup:**
- ✅ Website accepts USD via PayPal (working!)
- ✅ Admin tracks in DOP (your local currency)
- ✅ You convert manually when recording
- ✅ Simple note explains to visitors

**This works perfectly for a Personal PayPal account in Dominican Republic.**

**Future Upgrade:**
If your church grows and you need:
- Automatic DOP acceptance
- Recurring subscriptions
- API integration
- Multiple currencies

→ Consider upgrading to PayPal Business account

---

## 📞 Need Help?

**Converting USD to DOP:**
- Use Google: "50 USD to DOP"
- Use xe.com currency converter
- Check PayPal notification (shows conversion)

**Changing to PayPal Business:**
- paypal.com/do/business
- Contact PayPal support: 1-809-200-2550 (DR)

---

**Last Updated:** June 16, 2026  
**Website Currency:** USD (for PayPal compatibility)  
**Admin Currency:** DOP (for internal tracking)  
**Status:** ✅ Working Solution
