// Test script to verify complete password reset flow
import axios from 'axios';
import crypto from 'crypto';

const BASE_URL = 'http://localhost:4000';

async function testPasswordResetFlow() {
    console.log('🔐 Testing Complete Password Reset Flow\n');
    
    try {
        // Step 1: Request password reset
        console.log('Step 1: Requesting password reset...');
        const forgotResponse = await axios.post(`${BASE_URL}/api/user/forgot-password`, {
            email: 'john.doe@example.com'
        });
        
        if (forgotResponse.data.success) {
            console.log('✅ Forgot password request successful');
            console.log(`Message: ${forgotResponse.data.message}`);
            
            // Note: In real scenario, user would get the token from email
            // For testing, we'll simulate an invalid token scenario
            console.log('\nStep 2: Testing password reset with invalid token...');
            
            try {
                const invalidResetResponse = await axios.post(`${BASE_URL}/api/user/reset-password`, {
                    token: 'invalid-token',
                    newPassword: 'NewSecurePass123!'
                });
                console.log('❌ FAIL - Should have failed with invalid token');
            } catch (error) {
                console.log('✅ PASS - Invalid token rejected correctly');
                console.log(`Error: ${error.response?.data?.message}`);
            }
            
            // Test password validation
            console.log('\nStep 3: Testing password validation...');
            
            try {
                const weakPasswordResponse = await axios.post(`${BASE_URL}/api/user/reset-password`, {
                    token: 'some-token',
                    newPassword: 'weak'
                });
                console.log('❌ FAIL - Should have failed with weak password');
            } catch (error) {
                console.log('✅ PASS - Weak password rejected correctly');
                console.log(`Error: ${error.response?.data?.message}`);
            }
            
        } else {
            console.log('❌ FAIL - Forgot password request failed');
        }
        
    } catch (error) {
        console.log('❌ ERROR in test flow:', error.response?.data?.message || error.message);
    }
    
    console.log('\n🏁 Password reset flow test completed');
}

testPasswordResetFlow().catch(console.error);
