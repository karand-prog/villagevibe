// Simple test script to check authentication endpoints
const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  console.log('Testing VillageVibe Authentication...\n');

  // Test 1: Check if server is running
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running. Please start the backend with: cd backend && npm run dev');
    return;
  }

  // Test 2: Test registration
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    isHost: false
  };

  try {
    console.log('Testing registration...');
    const regResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const regData = await regResponse.json();
    
    if (regResponse.ok) {
      console.log('✅ Registration successful');
      console.log('User:', regData.user);
      console.log('Token received:', !!regData.token);
    } else {
      console.log('❌ Registration failed:', regData.message);
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }

  // Test 3: Test login
  try {
    console.log('\nTesting login...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful');
      console.log('User:', loginData.user);
      console.log('Token received:', !!loginData.token);
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }

  console.log('\nTest completed!');
}

// Run the test
testAuth(); 