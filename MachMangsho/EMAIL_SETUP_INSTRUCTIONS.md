# Instructions for Vercel Backend Environment Variables

You need to add these environment variables to your Vercel backend project:

1. Go to your Vercel dashboard
2. Select your backend project (server)
3. Go to Settings > Environment Variables
4. Add these variables:

EMAIL_FROM = machmangsho2025@gmail.com
EMAIL_APP_PASSWORD = pnceqyggatmggbeh

## IMPORTANT: Update Logo URL

In `server/utils/email.js`, update the logo URL:
```javascript
const logoUrl = "https://your-frontend-domain.vercel.app/logo2.jpg";
```
Replace `your-frontend-domain.vercel.app` with your actual frontend Vercel domain.

Example: `https://mach-mangsho.vercel.app/logo2.jpg`

**Alternative:** For immediate testing, the current placeholder logo will show "MachMangsho" text.
To use your actual logo, upload it to a CDN or use your deployed frontend URL.

Important Notes:
- The app password should be entered without spaces (remove spaces between letters)
- Make sure NODE_ENV is set to "production" in Vercel for proper cookie handling
- Redeploy your backend after adding these environment variables
- Update the logo URL with your actual frontend domain

## Email Features Added:

✅ **Beautiful Design**: Professional email template with your brand colors (#c9595a)
✅ **Logo Integration**: Your logo3.jpg from public folder  
✅ **Fixed Order ID**: Now properly displays the database order ID with user-friendly short version
✅ **Brand Colors**: Header and accents use your project color (#c9595a)
✅ **Delivery Charge Breakdown**: Clear itemization of costs including:
   - Items Subtotal
   - 🚚 Delivery Charge: BDT 40.00
   - Total Amount
✅ **COD Orders**: Email sent immediately after order placement
✅ **Stripe Orders**: Email sent after successful payment confirmation via webhook
✅ **Manual Verification**: Email sent when payment is manually verified
✅ **Enhanced HTML Template**: 
  - Gradient backgrounds with brand colors
  - Logo in header
  - Order ID prominently displayed (short + full ID)
  - Beautiful item table with alternating row colors
  - **Detailed pricing breakdown table**
  - Delivery information section
  - Customer service contact info
✅ **Improved Text Version**: Better formatted plain text with emojis, clear sections, and pricing breakdown

## Test the Email System:

1. Place a COD order on your website
2. Place a Stripe order on your website  
3. Check the server logs for email success/failure messages
4. Verify emails are received in the user's inbox

## Troubleshooting:

- Check server logs for "Email server connection verified successfully" on startup
- If emails aren't sending, verify the app password is correct and doesn't have spaces
- Gmail may block the first few emails - check spam folder
- For production, consider using a dedicated email service like SendGrid or Resend
