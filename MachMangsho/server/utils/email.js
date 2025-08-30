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
    const logoUrl = "https://mach-mangsho.vercel.app/logo3.jpg"; // JPG works better in emails
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
                  <img src="${logoUrl}" alt="MachMangsho Logo" style="height: 60px; width: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" onerror="this.src='${logoFallback}'" />
                  
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
                      📧 Email: <a href="mailto:support@machmangsho.com" style="color: #c9595a; text-decoration: none;">support@machmangsho.com</a><br>
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

// Test email function (optional)
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log("Email server connection verified successfully");
    return true;
  } catch (error) {
    console.error("Email server connection failed:", error.message);
    return false;
  }
}
