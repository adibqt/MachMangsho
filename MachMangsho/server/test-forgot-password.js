// Test script to verify forgot password functionality
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const testCases = [
    {
        name: 'Forgot password - existing email',
        endpoint: '/api/user/forgot-password',
        data: {
            email: 'john.doe@example.com' // This user should exist from previous tests
        },
        expectSuccess: true
    },
    {
        name: 'Forgot password - non-existing email',
        endpoint: '/api/user/forgot-password',
        data: {
            email: 'nonexistent@example.com'
        },
        expectSuccess: false
    },
    {
        name: 'Forgot password - missing email',
        endpoint: '/api/user/forgot-password',
        data: {},
        expectSuccess: false
    }
];

async function runTests() {
    console.log('🔐 Testing Forgot Password Functionality\n');
    
    for (const testCase of testCases) {
        try {
            console.log(`Testing: ${testCase.name}`);
            console.log(`Data: ${JSON.stringify(testCase.data)}`);
            
            const response = await axios.post(`${BASE_URL}${testCase.endpoint}`, testCase.data);
            
            if (testCase.expectSuccess) {
                console.log('✅ PASS - Request successful as expected');
                console.log(`Response: ${response.data.message}`);
            } else {
                console.log('❌ FAIL - Request should have failed but succeeded');
                console.log(`Response: ${response.data.message}`);
            }
            
        } catch (error) {
            if (!testCase.expectSuccess) {
                console.log('✅ PASS - Request failed as expected');
                console.log(`Error: ${error.response?.data?.message || error.message}`);
            } else {
                console.log('❌ FAIL - Request should have succeeded but failed');
                console.log(`Error: ${error.response?.data?.message || error.message}`);
            }
        }
        
        console.log('---\n');
    }
}

runTests().catch(console.error);
