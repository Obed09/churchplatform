# 🙏 Grace Community Church Website

A complete, modern, and fully responsive church website built with vanilla HTML, CSS, and JavaScript. No frameworks required!

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Customization Guide](#customization-guide)
- [File Structure](#file-structure)
- [Adding Content](#adding-content)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Support](#support)

---

## 🌟 Overview

This website template is designed specifically for churches and comes with:
- ✅ Beautiful, professional design
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Easy-to-edit content arrays
- ✅ Countdown timer for special events
- ✅ Reusable component systems
- ✅ Functional contact form
- ✅ Beautiful Christian stock photos from Unsplash
- ✅ Clear comments marking where to update content
- ✅ No frameworks needed - pure HTML/CSS/JavaScript

---

## ✨ Features

### 1. **Hero Section**
- Full-screen hero with background image
- Church name, tagline, and service times
- Call-to-action buttons

### 2. **Countdown Timer**
- Beautiful countdown for special events
- Easy to update in `js/countdown.js`
- Automatically updates every second

### 3. **Dynamic Sermon Cards**
- Edit sermons in `js/sermons.js` array
- Automatically generates cards
- Links for audio and video

### 4. **Dynamic Event Cards**
- Edit events in `js/events.js` array
- Beautiful date badges
- Registration links

### 5. **Ministry Leader Cards**
- Edit ministries in `js/ministries.js` array
- Leader photos and descriptions
- Professional presentation

### 6. **Contact Form**
- Full validation
- Success/error messages
- Ready for backend integration

### 7. **Donation Section**
- Toggle between one-time and monthly giving
- Preset amount buttons ($100-$400)
- Custom amount input
- Ready for payment processor integration

### 8. **Responsive Design**
- Perfect on all devices
- Mobile hamburger menu
- Touch-friendly buttons

---

## 🚀 Quick Start

### Option 1: Open Directly in Browser
1. Navigate to the project folder
2. Double-click `index.html`
3. Website opens in your default browser

### Option 2: Use Live Server (Recommended)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Website opens with live reload

### Option 3: Deploy to Web Hosting
See [Deployment](#deployment) section below

---

## 🎨 Customization Guide

### Step 1: Update Church Information

#### **Church Name & Branding**
📁 **File:** `index.html`

Search for these comments and replace the text:
```html
<!-- REPLACE WITH REAL CHURCH NAME -->
<!-- UPDATE CHURCH NAME AND TAGLINE HERE -->
<!-- UPDATE COPYRIGHT WITH CHURCH NAME -->
```

#### **Church Colors**
📁 **File:** `css/styles.css` (Lines 8-30)

```css
:root {
    --primary-color: #2c5282;      /* Change to your church color */
    --accent-color: #d4af37;       /* Change accent color */
}
```

---

### Step 2: Update Service Times

📁 **File:** `index.html`

Look for this comment:
```html
<!-- UPDATE SERVICE TIMES HERE -->
```

Update the service schedule in the Services Section:
```html
<p class="service-time-text">9:00 AM & 11:00 AM</p>
```

---

### Step 3: Set Countdown Timer

📁 **File:** `js/countdown.js` (Line 10)

```javascript
// Change this date to your event date
const targetDate = new Date('December 25, 2024 10:00:00').getTime();
```

**Format:** `'Month Day, Year HH:MM:SS'`

**Examples:**
- `'December 25, 2024 10:00:00'` - Christmas Service
- `'April 20, 2025 06:30:00'` - Easter Sunrise Service
- `'July 4, 2025 18:00:00'` - Independence Day Event

---

### Step 4: Add Sermons

📁 **File:** `js/sermons.js`

Find the `sermonsData` array and add/edit entries:

```javascript
const sermonsData = [
    {
        title: "Your Sermon Title",
        speaker: "Pastor Name",
        date: "December 15, 2024",
        description: "Brief description of the sermon message.",
        image: "https://images.unsplash.com/photo-xxxxx",
        audioUrl: "https://yoursite.com/audio/sermon.mp3",
        videoUrl: "https://youtube.com/watch?v=xxxxx"
    },
    // Add more sermons here...
];
```

**Tips:**
- Keep descriptions under 150 characters
- Use high-quality images (400x300px minimum)
- Link to YouTube, Vimeo, or your own hosting

---

### Step 5: Add Events

📁 **File:** `js/events.js`

Update the `eventsData` array:

```javascript
const eventsData = [
    {
        title: "Event Name",
        date: "2024-12-24",              // Format: YYYY-MM-DD
        time: "7:00 PM",
        location: "Main Sanctuary",
        description: "Event description here...",
        registrationUrl: "https://your-registration-link.com"
    },
    // Add more events...
];
```

---

### Step 6: Add Ministry Leaders

📁 **File:** `js/ministries.js`

Edit the `ministriesData` array:

```javascript
const ministriesData = [
    {
        name: "Children's Ministry",
        leader: "Leader Name",
        icon: "fa-child",                // FontAwesome icon
        description: "Ministry description...",
        image: "https://images.unsplash.com/photo-xxxxx"
    },
    // Add more ministries...
];
```

**Available Icons:** See [FontAwesome Icons](https://fontawesome.com/icons) for options

---

### Step 7: Update Contact Information

📁 **File:** `index.html`

Search for this comment:
```html
<!-- UPDATE ALL CONTACT INFORMATION HERE -->
```

Replace with your church's real info:
- Address
- Phone number
- Email
- Office hours
- Social media links

---

### Step 8: Replace Images

#### **Option A: Use Unsplash URLs (Already Included)**
The template comes with beautiful Christian stock photos. Keep them or replace with your own.

#### **Option B: Use Your Own Images**
1. Create an `images/` folder in your project
2. Add your photos (hero.jpg, about.jpg, etc.)
3. Replace URLs in HTML:

```html
<!-- Change from: -->
<img src="https://images.unsplash.com/photo-xxxxx">

<!-- To: -->
<img src="images/your-photo.jpg">
```

---

### Step 9: Setup Donation Processing

📁 **File:** `js/donate.js`

The donation section currently shows a demo message. Choose a payment processor:

#### **Option A: PayPal (Easiest - FREE)**
1. Create PayPal Business account
2. Go to https://www.paypal.com/donate/buttons
3. Create a donation button
4. Get your PayPal email
5. Uncomment PayPal code in `donate.js` (line 106)
6. Replace `YOUR_PAYPAL_EMAIL` with your actual email

#### **Option B: Stripe (Professional)**
1. Sign up at [Stripe.com](https://stripe.com/)
2. Get your Publishable Key
3. Create backend for checkout sessions
4. Uncomment Stripe code in `donate.js` (line 119)
5. Follow Stripe Checkout documentation

#### **Option C: Tithe.ly (Church-Specific)**
1. Sign up at [Tithe.ly](https://tithe.ly/)
2. Get your Church ID from settings
3. Uncomment Tithe.ly code in `donate.js` (line 137)
4. Replace `YOUR_CHURCH_ID`

#### **Option D: Pushpay (Enterprise)**
Contact Pushpay for church account setup

---

### Step 10: Setup Contact Form

📁 **File:** `js/contact.js`

The form currently shows a success message but doesn't send emails. Choose an option:

#### **Option A: Use EmailJS (Recommended - FREE)**
1. Sign up at [EmailJS.com](https://www.emailjs.com/)
2. Create email template
3. Uncomment EmailJS code in `contact.js` (line 96)
4. Add your Service ID and Template ID

#### **Option B: Use Formspree (Easy)**
1. Sign up at [Formspree.io](https://formspree.io/)
2. Create a form and get your form ID
3. Uncomment Formspree code in `contact.js` (line 122)
4. Replace `YOUR_FORM_ID` with your actual ID

#### **Option C: Build Your Own Backend**
Connect to your server using the fetch API example (line 110)

---

## 📁 File Structure

```
church-platform/
│
├── index.html              # Main HTML file
│
├── css/
│   └── styles.css         # All styles (responsive included)
│
├── js/
│   ├── countdown.js       # Countdown timer
│   ├── sermons.js         # Sermon data & rendering
│   ├── events.js          # Events data & rendering
│   ├── ministries.js      # Ministries data & rendering
│   ├── contact.js         # Contact form validation
│   └── main.js            # Navigation & interactions
│
└── README.md              # This file
```

---

## 📝 Adding Content - Quick Reference

| What to Update | File | Line/Section |
|---------------|------|--------------|
| Church Name | `index.html` | Search "REPLACE WITH REAL CHURCH NAME" |
| Service Times | `index.html` | Services Section |
| Colors | `css/styles.css` | Lines 8-30 (CSS Variables) |
| Countdown Date | `js/countdown.js` | Line 10 |
| Sermons | `js/sermons.js` | `sermonsData` array |
| Events | `js/events.js` | `eventsData` array |
| Ministries | `js/ministries.js` | `ministriesData` array |
| Donation Setup | `js/donate.js` | Payment processor integration |
| Contact Info | `index.html` | Contact Section |
| Social Media | `index.html` | Search "UPDATE SOCIAL MEDIA LINKS" |

---

## 🌐 Deployment

### Deploy to Netlify (FREE & Easy)
1. Go to [Netlify.com](https://www.netlify.com/)
2. Drag and drop your project folder
3. Your site is live in seconds!
4. Get a free `.netlify.app` domain or connect your own

### Deploy to GitHub Pages (FREE)
1. Create a GitHub account
2. Create a new repository
3. Upload all files
4. Go to Settings → Pages
5. Select main branch
6. Your site is live!

### Deploy to Traditional Hosting
1. Use any web host (Bluehost, HostGator, etc.)
2. Upload all files via FTP
3. Access via your domain

---

## 🖥️ Browser Support

✅ Chrome (recommended)  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Minimum Requirements:**
- Modern browser from last 2 years
- JavaScript enabled

---

## 🎯 Tips for Church Owners

### Best Practices

1. **Keep Content Fresh**
   - Update sermons weekly
   - Add upcoming events monthly
   - Change countdown timer for special occasions

2. **Use High-Quality Images**
   - Minimum 1920x1080 for hero images
   - Compress images before uploading
   - Use [TinyPNG.com](https://tinypng.com/) to optimize

3. **Test on Mobile**
   - Most visitors will use phones
   - Test all buttons and forms
   - Ensure text is readable

4. **Backup Regularly**
   - Save a copy before making changes
   - Use version control (Git)
   - Keep local and cloud backups

5. **Keep It Simple**
   - Less is more
   - Focus on essential information
   - Make it easy to find service times

---

## 🔧 Troubleshooting

### Images Not Showing?
- Check file paths (case-sensitive!)
- Ensure images are in the correct folder
- Verify image URLs are correct

### JavaScript Not Working?
- Open browser console (F12)
- Check for error messages
- Ensure all `.js` files are linked in HTML

### Mobile Menu Not Opening?
- Check that `main.js` is loaded
- Verify hamburger element has correct ID
- Clear browser cache

### Contact Form Not Sending?
- Remember: Front-end only by default
- Follow Step 9 to integrate email service
- Test validation by leaving fields empty

---

## 📞 Need Help?

### Quick Fixes
1. Try opening in a different browser
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check browser console for errors (F12)
4. Verify all files are in correct folders

### Learning Resources
- [HTML Tutorial](https://www.w3schools.com/html/)
- [CSS Tutorial](https://www.w3schools.com/css/)
- [JavaScript Basics](https://www.w3schools.com/js/)

---

## 📜 Comments in Code

Every section that needs updating has clear comments:

```html
<!-- ============================================ -->
<!-- REPLACE WITH REAL CHURCH NAME -->
<!-- ============================================ -->
```

Just search for "UPDATE" or "REPLACE" in any file to find all customization points!

---

## 🎉 You're All Set!

Your church website is ready to go! Here's what you have:

✅ Professional design  
✅ Mobile responsive  
✅ Easy to update  
✅ Beautiful images  
✅ Working forms  
✅ Dynamic components  
✅ Clear documentation  

**Next Steps:**
1. Customize church name and colors
2. Add real service times
3. Update countdown timer
4. Add your sermons, events, and ministries
5. Test on mobile device
6. Deploy to web hosting
7. Share with your congregation!

---

## 💝 Built with Love and Faith

This template was created to help churches share the Gospel online. May it serve your ministry well!

*"Go into all the world and preach the gospel to all creation."* - Mark 16:15

---

**Version:** 1.0  
**Last Updated:** December 2024  
**License:** Free to use for churches and ministries

For questions or support, refer to the troubleshooting section above or consult with a web developer in your congregation.

**God bless your ministry! 🙏**
