const axios = require('axios');

async function testAPI() {
  const BASE_URL = 'http://localhost:5000/api';
  
  console.log('🧪 Testing Diary API...\n');
  
  try {
    // 1. Test health
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅', health.data.message);
    
    // 2. Register user
    console.log('\n2. Testing user registration...');
    const register = await axios.post(`${BASE_URL}/auth/register`, {
      name: "Test User",
      email: "test@example.com",
      password: "test123"
    });
    console.log('✅ User registered');
    
    // 3. Login
    console.log('\n3. Testing login...');
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: "test@example.com",
      password: "test123"
    });
    const token = login.data.token;
    console.log('✅ Login successful');
    
    // 4. Create diary
    console.log('\n4. Testing diary creation...');
    const diary = await axios.post(`${BASE_URL}/diaries`, {
      title: "Test Diary",
      content: "This is a test diary",
      mood: "happy"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Diary created:', diary.data.title);
    
    // 5. Get diaries
    console.log('\n5. Testing get diaries...');
    const diaries = await axios.get(`${BASE_URL}/diaries`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Found', diaries.data.length, 'diaries');
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();