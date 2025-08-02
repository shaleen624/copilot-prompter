const axios = require('axios');

// Configuration
const baseURL = 'http://localhost:8080/api';
const timeout = 10000;

// Create axios instance
const api = axios.create({
  baseURL,
  timeout,
  validateStatus: function (status) {
    return status < 500; // Resolve only if the status code is less than 500
  }
});

// Test data
let authToken = '';
let userId = '';
let testPromptId = '';
let testTemplateId = '';

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  total: 0,
  details: []
};

// Utility functions
function logTest(name, status, responseTime, statusCode, error = null) {
  const result = {
    name,
    status,
    responseTime,
    statusCode,
    error
  };
  
  results.details.push(result);
  results.total++;
  
  if (status === 'PASS') {
    results.passed++;
    console.log(`✅ ${name} - PASS (${statusCode}) - ${responseTime}ms`);
  } else if (status === 'FAIL') {
    results.failed++;
    console.log(`❌ ${name} - FAIL (${statusCode}) - ${responseTime}ms`);
    if (error) {
      console.log(`   Error: ${error}`);
    }
  } else {
    results.skipped++;
    console.log(`⏭️  ${name} - SKIP`);
  }
}

async function runTest(name, requestFn) {
  const startTime = Date.now();
  try {
    const response = await requestFn();
    const responseTime = Date.now() - startTime;
    
    if (response.status >= 200 && response.status < 300) {
      logTest(name, 'PASS', responseTime, response.status);
      return response.data;
    } else {
      logTest(name, 'FAIL', responseTime, response.status, `HTTP ${response.status}`);
      return null;
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const statusCode = error.response?.status || 'N/A';
    const errorMessage = error.response?.data?.message || error.message;
    logTest(name, 'FAIL', responseTime, statusCode, errorMessage);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Java Service API Tests...\n');
  console.log(`Testing against: ${baseURL}\n`);

  try {
    // Health Check Tests
    console.log('🏥 Testing Health Check Endpoints...');
    await runTest('GET /actuator/health', () => api.get('/actuator/health'));

    // Authentication Tests
    console.log('\n🔐 Testing Authentication Endpoints...');
    
    // Register
    const registerData = await runTest('POST /auth/register', () => api.post('/auth/register', {
      username: 'javatest' + Date.now(),
      password: 'testpass123',
      email: 'javatest@example.com',
      firstName: 'Java',
      lastName: 'Test'
    }));

    if (registerData && registerData.data) {
      userId = registerData.data.id;
    }

    // Login
    const loginData = await runTest('POST /auth/login', () => api.post('/auth/login', {
      username: registerData?.data?.username || 'javatest',
      password: 'testpass123'
    }));

    if (loginData && loginData.data) {
      authToken = loginData.data.token || loginData.data.accessToken;
      
      // Set auth header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }

    // Refresh Token (if endpoint exists)
    if (authToken) {
      await runTest('POST /auth/refresh', () => api.post('/auth/refresh', {
        refreshToken: loginData?.data?.refreshToken
      }));

      // Logout
      await runTest('POST /auth/logout', () => api.post('/auth/logout'));
    }

    // Prompt Tests
    console.log('\n📝 Testing Prompt Endpoints...');
    
    // Get all prompts
    await runTest('GET /prompts', () => api.get('/prompts'));

    if (userId) {
      // Get user prompts
      await runTest(`GET /prompts/user/${userId}`, () => api.get(`/prompts/user/${userId}`));
    }

    // Create prompt
    const promptData = await runTest('POST /prompts', () => api.post('/prompts', {
      title: 'Java Test Prompt',
      content: 'This is a test prompt created by Java service test with sufficient content length',
      category: 'Test',
      tags: ['java', 'test'],
      isPublic: true
    }));

    if (promptData && promptData.data) {
      testPromptId = promptData.data.id;

      // Get specific prompt
      await runTest(`GET /prompts/${testPromptId}`, () => api.get(`/prompts/${testPromptId}`));

      // Update prompt
      await runTest(`PUT /prompts/${testPromptId}`, () => api.put(`/prompts/${testPromptId}`, {
        title: 'Updated Java Test Prompt',
        content: 'Updated test prompt content with sufficient length for validation requirements'
      }));

      // Delete prompt
      await runTest(`DELETE /prompts/${testPromptId}`, () => api.delete(`/prompts/${testPromptId}`));
    }

    // Search prompts
    await runTest('GET /prompts/search?q=test&category=Test&limit=10&offset=0', () => 
      api.get('/prompts/search', {
        params: {
          q: 'test',
          category: 'Test',
          limit: 10,
          offset: 0
        }
      })
    );

    // Template Tests
    console.log('\n📋 Testing Template Endpoints...');
    
    // Get all templates
    await runTest('GET /templates', () => api.get('/templates'));

    if (userId) {
      // Get user templates
      await runTest(`GET /templates/user/${userId}`, () => api.get(`/templates/user/${userId}`));
    }

    // Create template
    const templateData = await runTest('POST /templates', () => api.post('/templates', {
      name: 'Java Test Template',
      category: 'Test',
      language: 'Java',
      framework: 'Spring Boot',
      description: 'This is a test template created by Java service',
      content: 'Template content with {{variable}} that meets minimum character requirements',
      tags: ['java', 'test']
    }));

    if (templateData && templateData.data) {
      testTemplateId = templateData.data.id;

      // Get specific template
      await runTest(`GET /templates/${testTemplateId}`, () => api.get(`/templates/${testTemplateId}`));

      // Update template
      await runTest(`PUT /templates/${testTemplateId}`, () => api.put(`/templates/${testTemplateId}`, {
        name: 'Updated Java Test Template',
        description: 'Updated test template description'
      }));

      // Delete template
      await runTest(`DELETE /templates/${testTemplateId}`, () => api.delete(`/templates/${testTemplateId}`));
    }

    // Search templates
    await runTest('GET /templates/search?q=test&category=Test&limit=10&offset=0', () => 
      api.get('/templates/search', {
        params: {
          q: 'test',
          category: 'Test',
          limit: 10,
          offset: 0
        }
      })
    );

    // User Management Tests
    console.log('\n👤 Testing User Endpoints...');
    
    if (userId) {
      // Get user profile
      await runTest(`GET /users/${userId}`, () => api.get(`/users/${userId}`));

      // Update user profile
      await runTest(`PUT /users/${userId}`, () => api.put(`/users/${userId}`, {
        firstName: 'Updated Java',
        lastName: 'User'
      }));

      // Change password
      await runTest(`POST /users/${userId}/change-password`, () => api.post(`/users/${userId}/change-password`, {
        currentPassword: 'testpass123',
        newPassword: 'newpass123'
      }));
    }

    // Admin Tests (if endpoints exist)
    console.log('\n👑 Testing Admin Endpoints...');
    
    // Get all users (admin only)
    await runTest('GET /admin/users', () => api.get('/admin/users'));

    if (userId) {
      // Update user role (admin only)
      await runTest(`PUT /admin/users/${userId}/role`, () => api.put(`/admin/users/${userId}/role`, {
        role: 'USER'
      }));
    }

    // Get system stats
    await runTest('GET /admin/system/stats', () => api.get('/admin/system/stats'));

    if (userId) {
      // Delete user (admin only)
      await runTest(`DELETE /admin/users/${userId}`, () => api.delete(`/admin/users/${userId}`));
    }

    // Documentation Tests
    console.log('\n📚 Testing Documentation Endpoints...');
    await runTest('GET /v3/api-docs', () => api.get('/v3/api-docs'));

  } catch (error) {
    console.error('Test execution error:', error.message);
  }

  // Print summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`📈 Total: ${results.total}`);
  
  if (results.total > 0) {
    const successRate = ((results.passed / results.total) * 100).toFixed(1);
    console.log(`⏱️  Average Response Time: ${Math.round(results.details.reduce((sum, r) => sum + r.responseTime, 0) / results.total)}ms`);
    
    if (results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      results.details
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          console.log(`   ${r.name} - ${r.error} (${r.statusCode})`);
        });
    }
    
    console.log(`\n🎯 Success Rate: ${successRate}%`);
  }
}

main().catch(console.error);
