// Test script to verify user registration validation
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const testCases = [
    {
        name: 'Valid registration',
        data: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'SecurePass123!'
        },
        expectSuccess: true
    },
    {
        name: 'Invalid name with numbers',
        data: {
            name: 'John123',
            email: 'john123@example.com',
            password: 'SecurePass123!'
        },
        expectSuccess: false
    },
    {
        name: 'Invalid name with symbols',
        data: {
            name: ':123',
            email: 'symbol@example.com',
            password: 'SecurePass123!'
        },
        expectSuccess: false
    },
    {
        name: 'Weak password - no uppercase',
        data: {
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'securepass123!'
        },
        expectSuccess: false
    },
    {
        name: 'Weak password - no special characters',
        data: {
            name: 'Bob Smith',
            email: 'bob@example.com',
            password: 'SecurePass123'
        },
        expectSuccess: false
    },
    {
        name: 'Too short password',
        data: {
            name: 'Alice Brown',
            email: 'alice@example.com',
            password: 'Sec1!'
        },
        expectSuccess: false
    }
];

async function runTests() {
    console.log('🧪 Testing User Registration Validation\n');
    
    for (const testCase of testCases) {
        try {
            console.log(`Testing: ${testCase.name}`);
            console.log(`Data: ${JSON.stringify(testCase.data)}`);
            
            const response = await axios.post(`${BASE_URL}/api/user/register`, testCase.data);
            
            if (testCase.expectSuccess) {
                console.log('✅ PASS - Registration successful as expected');
                console.log(`Response: ${response.data.message || 'Success'}`);
            } else {
                console.log('❌ FAIL - Registration should have failed but succeeded');
            }
            
        } catch (error) {
            if (!testCase.expectSuccess) {
                console.log('✅ PASS - Registration failed as expected');
                console.log(`Error: ${error.response?.data?.message || error.message}`);
            } else {
                console.log('❌ FAIL - Registration should have succeeded but failed');
                console.log(`Error: ${error.response?.data?.message || error.message}`);
            }
        }
        
        console.log('---\n');
    }
}

runTests().catch(console.error);
