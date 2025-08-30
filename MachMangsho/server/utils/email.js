import nodemailer from "nodemailer";

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Test email connection and log configuration
export const testEmailConnection = async () => {
  try {
    console.log("Testing email configuration...");
    console.log("EMAIL_FROM:", process.env.EMAIL_FROM ? "SET" : "MISSING");
    console.log("EMAIL_APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD ? "SET" : "MISSING");
    
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_APP_PASSWORD) {
      console.error("❌ Email configuration incomplete - missing EMAIL_FROM or EMAIL_APP_PASSWORD");
      return false;
    }
    
    await transporter.verify();
    console.log("✅ Email server connection verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:", error.message);
    return false;
  }
};

export async function sendOrderReceiptEmail({ to, order, user }) {
  if (!to) {
    console.log("No email address provided for order receipt");
    return;
  }

  try {
    const orderId = order?.orderId || order?._id?.toString() || order?.id?.toString() || new Date().getTime().toString();
    const currency = order?.currency || "BDT";
    const total = order?.totalAmount ?? order?.total ?? order?.amount ?? 0;
    const items = order?.items || order?.orderItems || [];
    const userName = user?.name || user?.firstName || "Valued Customer";
    
    // Delivery charge (should match your order controllers)
    const deliveryCharge = 40; // BDT 40
    
    // Create a more readable order ID for display (but keep the actual ID for tracking)
    const displayOrderId = orderId.length > 12 ? orderId.slice(-8).toUpperCase() : orderId;
    
    // Logo URL - use JPG/PNG for better email client support
    // SVG is not well supported in email clients (Gmail, Outlook, etc.)
    const logoUrl = "https://mach-mangsho.vercel.app/logo3.png"; // JPG works better in emails
    // Fallback if domain not ready: branded placeholder
    const logoFallback = "https://via.placeholder.com/200x60/c9595a/ffffff?text=MachMangsho";
    
    console.log("Sending email for order:", orderId);

    // Calculate subtotal (no tax)
    const itemsSubtotal = total - deliveryCharge;
    
    // Generate order items HTML
    const itemsHtml = items.map((item, index) => {
      // Handle different data structures
      let name, qty, price;
      
      if (item?.product) {
        // When populated from database
        name = item.product.name || "Item";
        price = item.product.offerPrice || item.product.price || 0;
        qty = item.quantity || item.qty || 1;
      } else {
        // Direct item data
        name = item?.name || item?.productName || "Item";
        price = item?.price || item?.offerPrice || item?.unitPrice || 0;
        qty = item?.qty || item?.quantity || 1;
      }
      
      const subtotal = qty * price;
      
      // Alternate row colors for better readability
      const bgColor = index % 2 === 0 ? '#ffffff' : '#fafafa';
      
      return `
        <tr style="background-color: ${bgColor};">
          <td style="padding: 15px 15px; border-bottom: 1px solid #e9ecef; font-size: 15px; color: #333;">
            <strong>${name}</strong>
          </td>
          <td style="padding: 15px 15px; border-bottom: 1px solid #e9ecef; text-align: center; font-size: 15px; color: #333;">
            <span style="background-color: #c9595a; color: white; padding: 4px 8px; border-radius: 12px; font-weight: 500;">${qty}</span>
          </td>
          <td style="padding: 15px 15px; border-bottom: 1px solid #e9ecef; text-align: right; font-size: 15px; color: #333; font-weight: 500;">
            ${currency} ${price.toFixed(2)}
          </td>
          <td style="padding: 15px 15px; border-bottom: 1px solid #e9ecef; text-align: right; font-size: 15px; color: #c9595a; font-weight: 600;">
            ${currency} ${subtotal.toFixed(2)}
          </td>
        </tr>
      `;
    }).join("");

    const subject = `Order Confirmation - ${orderId} | MachMangsho`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Receipt - MachMangsho</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
      <!-- Email Container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            
            <!-- Main Content Card -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header with Logo and Brand -->
              <tr>
                <td style="background: linear-gradient(135deg, #c9595a 0%, #b14a4b 100%); padding: 40px 30px; text-align: center;">
                  <!-- Logo - JPG/PNG works better in emails than SVG -->
                  <img src="${logoUrl}" alt="MachMangsho Logo" style="height: 150px; width: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" onerror="this.src='${logoFallback}'" />
                  
                  <!-- Brand Name -->
                  <h1 style="margin: 0; color: white; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    MachMangsho
                  </h1>
                  <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 300;">
                    Fresh Groceries Delivered
                  </p>
                </td>
              </tr>
              
              <!-- Thank You Message -->
              <tr>
                <td style="background-color: #fff5f5; padding: 30px; text-align: center; border-bottom: 3px solid #c9595a;">
                  <h2 style="margin: 0; color: #c9595a; font-size: 28px; font-weight: bold;">
                    🎉 Thank You for Your Order!
                  </h2>
                  <p style="margin: 15px 0 0 0; color: #666; font-size: 16px;">
                    Hi ${userName}, we're excited to prepare your fresh groceries!
                  </p>
                </td>
              </tr>
              
              <!-- Order Details Section -->
              <tr>
                <td style="padding: 40px 30px;">
                  
                  <!-- Order Info Cards -->
                  <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 30px;">
                    <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%); border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center;">
                      <h3 style="margin: 0 0 8px 0; color: #c9595a; font-size: 16px; font-weight: 600;">Order ID</h3>
                      <p style="margin: 0; color: #333; font-size: 18px; font-weight: bold; font-family: 'Courier New', monospace;">#${displayOrderId}</p>
                      <p style="margin: 5px 0 0 0; color: #666; font-size: 11px;">Full ID: ${orderId}</p>
                    </div>
                    <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%); border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center;">
                      <h3 style="margin: 0 0 8px 0; color: #c9595a; font-size: 16px; font-weight: 600;">Order Date</h3>
                      <p style="margin: 0; color: #333; font-size: 16px; font-weight: 500;">${new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                  
                  <!-- Items Section -->
                  <h3 style="color: #c9595a; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #c9595a; padding-bottom: 10px;">
                    📦 Your Order Items
                  </h3>
                  
                  <!-- Items Table -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse; margin: 0 0 30px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Table Header -->
                    <thead>
                      <tr style="background: linear-gradient(135deg, #c9595a 0%, #b14a4b 100%);">
                        <th style="text-align: left; padding: 18px 15px; font-size: 14px; font-weight: 600; color: white; border: none;">Item</th>
                        <th style="text-align: center; padding: 18px 15px; font-size: 14px; font-weight: 600; color: white; border: none;">Qty</th>
                        <th style="text-align: right; padding: 18px 15px; font-size: 14px; font-weight: 600; color: white; border: none;">Price</th>
                        <th style="text-align: right; padding: 18px 15px; font-size: 14px; font-weight: 600; color: white; border: none;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                    <!-- Summary Rows -->
                    <tfoot>
                      <!-- Items Subtotal -->
                      <tr style="background-color: #f8f9fa;">
                        <td colspan="3" style="text-align: right; padding: 12px 15px; font-size: 15px; color: #666; border: none;">
                          Items Subtotal:
                        </td>
                        <td style="text-align: right; padding: 12px 15px; font-size: 15px; color: #666; border: none;">
                          ${currency} ${itemsSubtotal.toFixed(2)}
                        </td>
                      </tr>
                      
                      <!-- Delivery Charge Row -->
                      <tr style="background-color: #f8f9fa;">
                        <td colspan="3" style="text-align: right; padding: 12px 15px; font-size: 15px; color: #666; border: none;">
                          🚚 Delivery Charge:
                        </td>
                        <td style="text-align: right; padding: 12px 15px; font-size: 15px; color: #666; border: none;">
                          ${currency} ${deliveryCharge.toFixed(2)}
                        </td>
                      </tr>
                      
                      <!-- Total Row -->
                      <tr style="background-color: #fff5f5; border-top: 2px solid #c9595a;">
                        <td colspan="3" style="text-align: right; padding: 20px 15px; font-size: 18px; font-weight: bold; color: #c9595a; border: none;">
                          🧾 Total Amount:
                        </td>
                        <td style="text-align: right; padding: 20px 15px; font-size: 20px; font-weight: bold; color: #c9595a; border: none;">
                          ${currency} ${total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  
                  <!-- Delivery Info -->
                  <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border-left: 5px solid #28a745; border-radius: 8px; padding: 25px; margin: 30px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #155724; font-size: 18px; font-weight: bold;">
                      🚚 What's Next?
                    </h3>
                    <ul style="margin: 0; padding-left: 20px; color: #155724; font-size: 15px; line-height: 1.8;">
                      <li><strong>Order Confirmation:</strong> We've received your order and are preparing it with care</li>
                      <li><strong>Processing Time:</strong> Your fresh groceries will be packed within 2-4 hours</li>
                      <li><strong>Delivery:</strong> Expect delivery within 2-5 business days</li>
                      <li><strong>Tracking:</strong> We'll send you tracking updates via email</li>
                    </ul>
                  </div>
                  
                  <!-- Customer Service -->
                  <div style="text-align: center; margin: 30px 0; padding: 25px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                    <h3 style="margin: 0 0 15px 0; color: #c9595a; font-size: 18px;">Need Help?</h3>
                    <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                      Have questions about your order? We're here to help!
                    </p>
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      📧 Email: <a href="mailto:machmangsho2025@gmail.com" style="color: #c9595a; text-decoration: none;">support@machmangsho.com</a><br>
                      📞 Phone: +880-123-456-7890
                    </p>
                  </div>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #343a40 0%, #495057 100%); padding: 30px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: white; font-size: 14px; font-weight: 500;">
                    Thank you for choosing MachMangsho for your grocery needs! 🛒
                  </p>
                  <p style="margin: 0 0 15px 0; color: rgba(255,255,255,0.8); font-size: 12px;">
                    This is an automated receipt. Please keep it for your records.
                  </p>
                  <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
                    <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 11px;">
                      © 2025 MachMangsho. All rights reserved.<br>
                      Fresh Groceries | Fast Delivery | Best Prices
                    </p>
                  </div>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const textVersion = `
═══════════════════════════════════════════════════════
                    MACHMANGSHO
               Fresh Groceries Delivered
═══════════════════════════════════════════════════════

🎉 THANK YOU FOR YOUR ORDER! 🎉

Hi ${userName},

We're excited to confirm that we've received your order and are preparing your fresh groceries with care!

ORDER DETAILS:
──────────────────────────────────────────────────────
📋 Order ID: #${displayOrderId}
   Full ID: ${orderId}
📅 Order Date: ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}
📧 Email: ${to}

ITEMS ORDERED:
──────────────────────────────────────────────────────
${items.map((item, index) => {
  let name, qty, price;
  
  if (item?.product) {
    name = item.product.name || "Item";
    price = item.product.offerPrice || item.product.price || 0;
    qty = item.quantity || item.qty || 1;
  } else {
    name = item?.name || item?.productName || "Item";
    price = item?.price || item?.offerPrice || item?.unitPrice || 0;
    qty = item?.qty || item?.quantity || 1;
  }
  
  const subtotal = qty * price;
  return `${index + 1}. ${name}
   Quantity: ${qty} × ${currency} ${price.toFixed(2)} = ${currency} ${subtotal.toFixed(2)}`;
}).join('\n\n')}

PRICING BREAKDOWN:
──────────────────────────────────────────────────────
Items Subtotal: ${currency} ${itemsSubtotal.toFixed(2)}
🚚 Delivery Charge: ${currency} ${deliveryCharge.toFixed(2)}

──────────────────────────────────────────────────────
🧾 TOTAL AMOUNT: ${currency} ${total.toFixed(2)}
──────────────────────────────────────────────────────

WHAT'S NEXT:
🔄 Order Confirmation: We've received your order and are preparing it
⏱️  Processing Time: Your groceries will be packed within 2-4 hours  
🚚 Delivery: Expect delivery within 2-5 business days
📱 Tracking: We'll send you tracking updates via email

NEED HELP?
──────────────────────────────────────────────────────
📧 Email: support@machmangsho.com
📞 Phone: +880-123-456-7890

Thank you for choosing MachMangsho for your grocery needs! 🛒

© 2025 MachMangsho. All rights reserved.
Fresh Groceries | Fast Delivery | Best Prices

This is an automated receipt. Please keep it for your records.
    `;

    const mailOptions = {
      from: `"MachMangsho" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: subject,
      text: textVersion,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Order receipt sent successfully to ${to}:`, info.messageId);
    
  } catch (error) {
    console.error("Failed to send order receipt email:", error.message);
    // Don't throw error to avoid breaking order flow
  }
}

// Send password reset email
export async function sendPasswordResetEmail({ to, resetToken, userName }) {
  console.log("=== EMAIL FUNCTION START ===");
  console.log("Email to:", to);
  console.log("Reset token:", resetToken ? "PROVIDED" : "MISSING");
  console.log("User name:", userName);
  console.log("Environment check:");
  console.log("- NODE_ENV:", process.env.NODE_ENV);
  console.log("- VERCEL:", process.env.VERCEL ? "true" : "false");
  console.log("- EMAIL_FROM:", process.env.EMAIL_FROM ? "SET" : "MISSING");
  console.log("- EMAIL_APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD ? "SET" : "MISSING");
  console.log("- FRONTEND_URL:", process.env.FRONTEND_URL || "NOT SET");
  
  if (!to) {
    console.log("No email address provided for password reset");
    return;
  }

  if (!process.env.EMAIL_FROM || !process.env.EMAIL_APP_PASSWORD) {
    console.error("❌ Email credentials missing - cannot send email");
    throw new Error("Email configuration missing: EMAIL_FROM and EMAIL_APP_PASSWORD must be set");
  }

  try {
    // Determine the frontend URL based on environment
    let frontendUrl;
    if (process.env.FRONTEND_URL) {
      // Explicitly set frontend URL (production)
      frontendUrl = process.env.FRONTEND_URL;
      console.log("Using FRONTEND_URL:", frontendUrl);
    } else if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      // In production but no FRONTEND_URL set - use a sensible default
      frontendUrl = 'https://mach-mangsho.vercel.app';
      console.log("⚠️  FRONTEND_URL not set in production, using default:", frontendUrl);
      console.log("⚠️  For best results, set FRONTEND_URL environment variable in Vercel");
    } else {
      // Development environment
      frontendUrl = 'http://localhost:3000'; // Updated to match current dev server
      console.log("Using development URL:", frontendUrl);
    }
    
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    
    console.log("Environment:", process.env.NODE_ENV);
    console.log("VERCEL environment:", process.env.VERCEL);
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
    console.log("Generated reset URL:", resetUrl);
    console.log("Sending password reset email to:", to);

    const mailOptions = {
      from: {
        name: 'MachMangsho',
        address: process.env.EMAIL_FROM
      },
      to: to,
      subject: 'Reset Your Password - MachMangsho',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 3px solid #c9595a; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { max-width: 150px; height: auto; }
            .content { padding: 20px 0; }
            .reset-button { display: inline-block; background-color: #c9595a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .reset-button:hover { background-color: #b14c4d; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .warning-icon { color: #856404; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://mach-mangsho.vercel.app/logo3.png" alt="MachMangsho" class="logo" onerror="this.style.display='none';">
              <h1 style="color: #c9595a; margin: 10px 0;">Password Reset Request</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${userName || 'Valued Customer'},</h2>
              
              <p>We received a request to reset your password for your MachMangsho account. If you didn't make this request, you can safely ignore this email.</p>
              
              <p>To reset your password, click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>
              
              <div class="warning">
                <p><span class="warning-icon">⚠️</span> <strong>Important:</strong></p>
                <ul>
                  <li>This reset link will expire in <strong>1 hour</strong> for security purposes</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If you're having trouble clicking the reset button, you can also visit our website and use the "Forgot Password" option again.</p>
              
              <p>Thank you for choosing MachMangsho!</p>
            </div>
            
            <div class="footer">
              <p>This email was sent by MachMangsho</p>
              <p>If you have any questions, please contact our support team.</p>
              <p>&copy; 2025 MachMangsho. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log("About to send email with transporter...");
    console.log("Mail options:", JSON.stringify(mailOptions, null, 2));
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent successfully to ${to}:`, info.messageId);
    return true;
    
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
    console.error("Full error:", error);
    throw error;
  }
}
