# Copilot Prompter API Testing Guide

## 🚀 API Overview

**Base URL:** `http://localhost:8080/api`
**Authentication:** JWT Bearer Token
**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 📋 Quick Test Commands

### 1. Health Check
```bash
curl -X GET http://localhost:8080/api/actuator/health
```

### 2. Login (Get JWT Token)
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```
**Response:** Copy the `accessToken` for authenticated requests.

---

## 🔐 Authentication Endpoints

### Login
```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Refresh Token
```bash
curl -X POST "http://localhost:8080/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Logout
```bash
curl -X POST "http://localhost:8080/api/auth/logout" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📝 Prompts Endpoints

### Get All Prompts (Public)
```bash
curl -X GET "http://localhost:8080/api/prompts" \
  -H "Content-Type: application/json"
```

### Get Prompt by ID
```bash
curl -X GET "http://localhost:8080/api/prompts/1" \
  -H "Content-Type: application/json"
```

### Get Prompt Categories
```bash
curl -X GET "http://localhost:8080/api/prompts/categories" \
  -H "Content-Type: application/json"
```

### Get Programming Languages
```bash
curl -X GET "http://localhost:8080/api/prompts/languages" \
  -H "Content-Type: application/json"
```

### Get Popular Prompts
```bash
curl -X GET "http://localhost:8080/api/prompts/popular" \
  -H "Content-Type: application/json"
```

### Get Latest Prompts
```bash
curl -X GET "http://localhost:8080/api/prompts/latest" \
  -H "Content-Type: application/json"
```

### Search Prompts
```bash
curl -X GET "http://localhost:8080/api/prompts/search?q=spring&category=Backend" \
  -H "Content-Type: application/json"
```

### Create Prompt (Authenticated)
```bash
curl -X POST "http://localhost:8080/api/prompts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Test Prompt",
    "prompt": "This is a test prompt content",
    "description": "A test prompt for API testing",
    "tags": ["test", "api"],
    "category": "General",
    "language": "JavaScript"
  }'
```

### Update Prompt (Authenticated)
```bash
curl -X PUT "http://localhost:8080/api/prompts/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Updated Test Prompt",
    "prompt": "Updated content",
    "description": "Updated description",
    "tags": ["updated", "test"],
    "category": "General",
    "language": "JavaScript"
  }'
```

### Copy Prompt (Authenticated)
```bash
curl -X POST "http://localhost:8080/api/prompts/1/copy" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Delete Prompt (Authenticated)
```bash
curl -X DELETE "http://localhost:8080/api/prompts/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎯 Templates Endpoints

### Get All Templates (Public)
```bash
curl -X GET "http://localhost:8080/api/templates" \
  -H "Content-Type: application/json"
```

### Get Template by ID
```bash
curl -X GET "http://localhost:8080/api/templates/1" \
  -H "Content-Type: application/json"
```

### Get Template Categories
```bash
curl -X GET "http://localhost:8080/api/templates/categories" \
  -H "Content-Type: application/json"
```

### Get Frameworks
```bash
curl -X GET "http://localhost:8080/api/templates/frameworks" \
  -H "Content-Type: application/json"
```

### Get Popular Templates
```bash
curl -X GET "http://localhost:8080/api/templates/popular" \
  -H "Content-Type: application/json"
```

### Search Templates
```bash
curl -X GET "http://localhost:8080/api/templates/search?q=angular&framework=Angular" \
  -H "Content-Type: application/json"
```

### Create Template (Authenticated)
```bash
curl -X POST "http://localhost:8080/api/templates" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Test Template",
    "category": "Frontend Framework",
    "language": "TypeScript",
    "framework": "React",
    "description": "A test template",
    "content": "# Test Template Content\nThis is test content.",
    "tags": ["test", "react"]
  }'
```

### Download Template (Authenticated)
```bash
curl -X POST "http://localhost:8080/api/templates/1/download" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 👑 Admin Endpoints (Requires ADMIN Role)

### Get All Users
```bash
curl -X GET "http://localhost:8080/api/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get User by ID
```bash
curl -X GET "http://localhost:8080/api/admin/users/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create User
```bash
curl -X POST "http://localhost:8080/api/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "USER"
  }'
```

### Enable/Disable User
```bash
curl -X PUT "http://localhost:8080/api/admin/users/1/enable" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "enabled": true
  }'
```

---

## 🧪 Testing with Different Tools

### Method 1: curl (Command Line)
- Use the commands above
- Copy JWT token from login response
- Replace `YOUR_ACCESS_TOKEN` with actual token

### Method 2: Postman
1. Create new collection: "Copilot Prompter API"
2. Add environment variable: `baseUrl = http://localhost:8080/api`
3. Create login request to get token
4. Set up Bearer token authentication in collection

### Method 3: VS Code REST Client
Install "REST Client" extension and create `.http` files:

```http
### Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

### Get Prompts
GET http://localhost:8080/api/prompts
Content-Type: application/json

### Get Templates
GET http://localhost:8080/api/templates
Content-Type: application/json
```

### Method 4: Browser Testing
- Open browser to `http://localhost:8080/api/prompts`
- Use browser developer tools for network inspection
- Test public endpoints directly

---

## 🔍 Response Examples

### Login Response
```json
{
  "accessToken": "eyJhbGciOiJIUzM4NCJ9...",
  "refreshToken": "eyJhbGciOiJIUzM4NCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@copilotprompter.com",
    "firstName": "System",
    "lastName": "Administrator",
    "role": "ADMIN",
    "enabled": true
  }
}
```

### Prompts Response
```json
{
  "content": [
    {
      "id": 1,
      "title": "Angular Component Development",
      "prompt": "Create an Angular component...",
      "description": "A comprehensive prompt...",
      "tags": ["angular", "typescript"],
      "category": "Frontend",
      "language": "TypeScript",
      "author": "System",
      "active": true,
      "viewCount": 0,
      "copyCount": 0
    }
  ],
  "pageable": {...},
  "totalElements": 2,
  "totalPages": 1
}
```

---

## ⚠️ Testing Notes

1. **JWT Token Expiry**: Access tokens expire in 24 hours, refresh tokens in 7 days
2. **CORS**: API supports CORS for frontend integration
3. **Pagination**: Most list endpoints support pagination with `page`, `size`, `sort` parameters
4. **Security**: Admin endpoints require ADMIN role
5. **Database**: Uses SQLite with sample data pre-loaded

---

## 🚨 Troubleshooting

### Common Issues:
1. **401 Unauthorized**: Check JWT token is valid and not expired
2. **403 Forbidden**: User lacks required permissions (e.g., ADMIN role)
3. **404 Not Found**: Check endpoint URL and method
4. **500 Internal Server Error**: Check server logs for details

### Debug Commands:
```bash
# Check if server is running
curl -I http://localhost:8080/api/actuator/health

# Check application logs
tail -f backend/logs/application.log

# Check database
sqlite3 data/copilot_prompter.db ".tables"
```

---

## 🎯 Next Steps

1. **Frontend Integration**: Connect Angular app to these endpoints
2. **API Documentation**: Access Swagger UI at `http://localhost:8080/api/swagger-ui.html`
3. **Performance Testing**: Use tools like JMeter or Artillery
4. **Security Testing**: Test with invalid tokens, SQL injection, etc.
5. **Load Testing**: Test with multiple concurrent users

Happy Testing! 🚀
