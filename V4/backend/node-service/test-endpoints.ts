#!/usr/bin/env ts-node
import axios, { AxiosResponse } from 'axios';
import { performance } from 'perf_hooks';

const BASE_URL = 'http://localhost:8181';
let accessToken = '';
let refreshToken = '';
let userId = '';
let promptId = '';
let templateId = '';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  statusCode?: number;
  responseTime?: number;
  error?: string;
  data?: any;
}

const testResults: TestResult[] = [];

// Utility function to log test results
const logTest = (result: TestResult) => {
  const status = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
  console.log(`${status} ${result.method} ${result.endpoint} - ${result.status} ${result.statusCode ? `(${result.statusCode})` : ''} ${result.responseTime ? `- ${result.responseTime.toFixed(0)}ms` : ''}`);
  if (result.error) {
    console.log(`   Error: ${result.error}`);
  }
  testResults.push(result);
};

// Utility function to make API calls
const makeRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any,
  requiresAuth: boolean = false
): Promise<TestResult> => {
  const start = performance.now();
  const fullUrl = `${BASE_URL}${endpoint}`;
  
  try {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    if (requiresAuth && accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response: AxiosResponse;
    
    switch (method) {
      case 'GET':
        response = await axios.get(fullUrl, { headers });
        break;
      case 'POST':
        response = await axios.post(fullUrl, data, { headers });
        break;
      case 'PUT':
        response = await axios.put(fullUrl, data, { headers });
        break;
      case 'DELETE':
        response = await axios.delete(fullUrl, { headers });
        break;
    }

    const end = performance.now();
    
    return {
      endpoint,
      method,
      status: 'PASS',
      statusCode: response.status,
      responseTime: end - start,
      data: response.data
    };
  } catch (error: any) {
    const end = performance.now();
    
    return {
      endpoint,
      method,
      status: 'FAIL',
      statusCode: error.response?.status || 0,
      responseTime: end - start,
      error: error.response?.data?.message || error.message
    };
  }
};

// Test suites
const runHealthCheckTests = async () => {
  console.log('\n🏥 Testing Health Check Endpoints...');
  
  const result = await makeRequest('GET', '/health');
  logTest(result);
};

const runAuthTests = async () => {
  console.log('\n🔐 Testing Authentication Endpoints...');
  
  // Test user registration
  const registerData = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User'
  };
  
  const registerResult = await makeRequest('POST', '/api/auth/register', registerData);
  logTest(registerResult);
  
  if (registerResult.status === 'PASS' && registerResult.data?.data?.id) {
    userId = registerResult.data.data.id;
  }
  
  // Test user login
  const loginData = {
    username: registerData.username,
    password: registerData.password
  };
  
  const loginResult = await makeRequest('POST', '/api/auth/login', loginData);
  logTest(loginResult);
  
  if (loginResult.status === 'PASS' && loginResult.data?.data) {
    accessToken = loginResult.data.data.accessToken;
    refreshToken = loginResult.data.data.refreshToken;
  }
  
  // Test token refresh
  if (refreshToken) {
    const refreshResult = await makeRequest('POST', '/api/auth/refresh', { refreshToken });
    logTest(refreshResult);
    
    if (refreshResult.status === 'PASS' && refreshResult.data?.data?.accessToken) {
      accessToken = refreshResult.data.data.accessToken;
    }
  }
  
  // Test logout
  const logoutResult = await makeRequest('POST', '/api/auth/logout', { refreshToken }, true);
  logTest(logoutResult);
};

const runPromptTests = async () => {
  console.log('\n📝 Testing Prompt Endpoints...');
  
  // Test get all prompts
  const getAllPromptsResult = await makeRequest('GET', '/api/prompts', null, true);
  logTest(getAllPromptsResult);
  
  // Test get prompts by user
  const getUserPromptsResult = await makeRequest('GET', `/api/prompts/user/${userId}`, null, true);
  logTest(getUserPromptsResult);
  
  // Test create prompt
  const promptData = {
    title: 'Test Prompt',
    prompt: 'This is a test prompt content that meets the minimum character requirement for validation', // Changed from 'content' to 'prompt'
    description: 'A test prompt for API testing',
    category: 'Test',
    language: 'JavaScript', // Added language field
    tags: ['test', 'api'],
    isPublic: true
  };
  
  const createPromptResult = await makeRequest('POST', '/api/prompts', promptData, true);
  logTest(createPromptResult);
  
  if (createPromptResult.status === 'PASS' && createPromptResult.data?.data?.id) {
    promptId = createPromptResult.data.data.id;
    
    // Test get prompt by ID
    const getPromptResult = await makeRequest('GET', `/api/prompts/${promptId}`, null, true);
    logTest(getPromptResult);
    
    // Test update prompt
    const updateData = {
      title: 'Updated Test Prompt',
      prompt: 'This is updated test prompt content that meets the minimum character requirement', // Changed from 'content' to 'prompt'
      description: 'An updated test prompt for API testing',
      category: 'Updated Test',
      language: 'TypeScript', // Added language field
      tags: ['updated', 'test', 'api'],
      isPublic: false
    };
    
    const updatePromptResult = await makeRequest('PUT', `/api/prompts/${promptId}`, updateData, true);
    logTest(updatePromptResult);
    
    // Test delete prompt
    const deletePromptResult = await makeRequest('DELETE', `/api/prompts/${promptId}`, null, true);
    logTest(deletePromptResult);
  }
  
  // Test search prompts
  const searchResult = await makeRequest('GET', '/api/prompts/search?q=test&category=Test&limit=10&offset=0', null, true);
  logTest(searchResult);
};

const runTemplateTests = async () => {
  console.log('\n📋 Testing Template Endpoints...');
  
  // Test get all templates
  const getAllTemplatesResult = await makeRequest('GET', '/api/templates', null, true);
  logTest(getAllTemplatesResult);
  
  // Test get templates by user
  const getUserTemplatesResult = await makeRequest('GET', `/api/templates/user/${userId}`, null, true);
  logTest(getUserTemplatesResult);
  
  // Test create template
  const templateData = {
    name: 'Test Template',
    description: 'This is a test template',
    content: 'Template content with {{variable}} that meets the minimum character requirement for validation',
    category: 'Test',
    language: 'JavaScript', // Added required language field
    framework: 'React', // Added optional framework field
    tags: ['test', 'template'], // Added tags field
    isPublic: true
  };
  
  const createTemplateResult = await makeRequest('POST', '/api/templates', templateData, true);
  logTest(createTemplateResult);
  
  if (createTemplateResult.status === 'PASS' && createTemplateResult.data?.data?.id) {
    templateId = createTemplateResult.data.data.id;
    
    // Test get template by ID
    const getTemplateResult = await makeRequest('GET', `/api/templates/${templateId}`, null, true);
    logTest(getTemplateResult);
    
    // Test update template
    const updateData = {
      name: 'Updated Test Template',
      description: 'This is an updated test template',
      content: 'Updated template content with {{variable}} and {{newVariable}} that meets requirements',
      category: 'Updated Test',
      language: 'TypeScript', // Added required language field
      framework: 'Angular', // Added optional framework field
      tags: ['updated', 'test', 'template'], // Added tags field
      isPublic: false
    };
    
    const updateTemplateResult = await makeRequest('PUT', `/api/templates/${templateId}`, updateData, true);
    logTest(updateTemplateResult);
    
    // Test delete template
    const deleteTemplateResult = await makeRequest('DELETE', `/api/templates/${templateId}`, null, true);
    logTest(deleteTemplateResult);
  }
  
  // Test search templates
  const searchResult = await makeRequest('GET', '/api/templates/search?q=test&category=Test&limit=10&offset=0', null, true);
  logTest(searchResult);
};

const runUserTests = async () => {
  console.log('\n👤 Testing User Endpoints...');
  
  // Test get user profile
  const getUserProfileResult = await makeRequest('GET', `/api/users/${userId}`, null, true);
  logTest(getUserProfileResult);
  
  // Test update user profile
  const updateData = {
    firstName: 'Updated Test',
    lastName: 'Updated User',
    email: `updated_test_${Date.now()}@example.com`
  };
  
  const updateUserResult = await makeRequest('PUT', `/api/users/${userId}`, updateData, true);
  logTest(updateUserResult);
  
  // Test change password
  const changePasswordData = {
    currentPassword: 'Password123!',
    newPassword: 'NewPassword123!'
  };
  
  const changePasswordResult = await makeRequest('POST', `/api/users/${userId}/change-password`, changePasswordData, true);
  logTest(changePasswordResult);
};

const runAdminTests = async () => {
  console.log('\n👑 Testing Admin Endpoints...');
  
  // Test get all users (admin only)
  const getAllUsersResult = await makeRequest('GET', '/api/admin/users', null, true);
  logTest(getAllUsersResult);
  
  // Test update user role (admin only)
  const updateRoleData = {
    role: 'moderator'
  };
  
  const updateUserRoleResult = await makeRequest('PUT', `/api/admin/users/${userId}/role`, updateRoleData, true);
  logTest(updateUserRoleResult);
  
  // Test get system stats
  const getSystemStatsResult = await makeRequest('GET', '/api/admin/system/stats', null, true);
  logTest(getSystemStatsResult);
  
  // Test delete user (admin only)
  const deleteUserResult = await makeRequest('DELETE', `/api/admin/users/${userId}`, null, true);
  logTest(deleteUserResult);
};

const runDocumentationTests = async () => {
  console.log('\n📚 Testing Documentation Endpoints...');
  
  // Test API documentation
  const apiDocsResult = await makeRequest('GET', '/api/docs');
  logTest(apiDocsResult);
};

// Main test runner
const runAllTests = async () => {
  console.log('🚀 Starting Node.js Service API Tests...\n');
  console.log(`Testing against: ${BASE_URL}`);
  
  try {
    await runHealthCheckTests();
    await runAuthTests();
    
    if (accessToken) {
      await runPromptTests();
      await runTemplateTests();
      await runUserTests();
      await runAdminTests();
    } else {
      console.log('\n⚠️  Skipping authenticated tests - no access token available');
    }
    
    await runDocumentationTests();
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('================');
    
    const passed = testResults.filter(r => r.status === 'PASS').length;
    const failed = testResults.filter(r => r.status === 'FAIL').length;
    const skipped = testResults.filter(r => r.status === 'SKIP').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`📈 Total: ${testResults.length}`);
    
    const avgResponseTime = testResults
      .filter(r => r.responseTime)
      .reduce((sum, r) => sum + (r.responseTime || 0), 0) / testResults.filter(r => r.responseTime).length;
    
    console.log(`⏱️  Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      testResults
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          console.log(`   ${r.method} ${r.endpoint} - ${r.error} (${r.statusCode})`);
        });
    }
    
    console.log(`\n🎯 Success Rate: ${((passed / testResults.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  }
};

// Run the tests
runAllTests().catch(console.error);
