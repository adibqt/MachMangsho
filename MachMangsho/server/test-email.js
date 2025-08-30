import dotenv from 'dotenv/config';
import { sendOrderReceiptEmail } from './utils/email.js';

// Test email function
async function testEmail() {
  console.log('Environment check:', {
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD ? 'SET' : 'NOT SET'
  });

  const testOrder = {
    _id: "66d123456789abcdef012345", // Simulate a real MongoDB ObjectId
    orderId: "66d123456789abcdef012345",
    items: [
      {
        product: {
          name: "Fresh Apples",
          price: 150,
          offerPrice: 120
        },
        quantity: 2
      },
      {
        product: {
          name: "Organic Bananas",
          price: 80,
          offerPrice: 70
        },
        quantity: 3
      }
    ],
    amount: 490, // 120*2 + 70*3 = 450 + delivery (40) = 490 (no tax)
    totalAmount: 490,
    currency: "BDT",
    paymentType: "COD"
  };

  const testUser = {
    name: "Test Customer",
    email: "machmangsho2025@gmail.com" // Send to your own email for testing
  };

  try {
    await sendOrderReceiptEmail({
      to: testUser.email,
      order: testOrder,
      user: testUser
    });
    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Test email failed:", error.message);
  }
}

// Run test
testEmail();
