# Postman Testing Guide for Copilot Prompter Node.js API

## Overview
This guide provides instructions for testing the Copilot Prompter Node.js API using the provided Postman collection.

## Files Included
- `Copilot_Prompter_NodeJS_API.postman_collection.json` - Main API collection
- `Copilot_Prompter_NodeJS_Development.postman_environment.json` - Development environment variables

## Setup Instructions

### 1. Import Collection and Environment
1. Open Postman
2. Click "Import" button
3. Import both files:
   - `Copilot_Prompter_NodeJS_API.postman_collection.json`
   - `Copilot_Prompter_NodeJS_Development.postman_environment.json`

### 2. Set Environment
1. In Postman, select the "Copilot Prompter Node.js - Development" environment
2. Verify the `baseUrl` is set to `http://localhost:8181`

### 3. Start the Node.js Service
```bash
cd backend/node-service
npm run dev
```

## Testing Workflow

### Step 1: Health Check
- Run the **Health Check** request to verify the service is running
- Expected response: `{ "status": "OK", "timestamp": "..." }`

### Step 2: Authentication Flow
1. **Register a new user** (if needed)
   - Use the **Authentication → Register** request
   - This will create a test user

2. **Login**
   - Use the **Authentication → Login** request
   - This automatically saves the `accessToken` and `refreshToken` to collection variables
   - The test script in the request handles token storage

3. **Test token refresh** (optional)
   - Use the **Authentication → Refresh Token** request
   - This will get new tokens using the refresh token

### Step 3: API Testing
Once authenticated, you can test all protected endpoints:

#### Prompts API
- **Get All Prompts** - Test pagination and filtering
- **Create Prompt** - Add a new prompt
- **Get Prompt by ID** - Retrieve specific prompt
- **Update Prompt** - Modify existing prompt
- **Delete Prompt** - Remove a prompt
- **Search Prompts** - Test search functionality

#### Templates API
- **Get All Templates** - Test pagination and filtering
- **Create Template** - Add a new template
- **Get Template by ID** - Retrieve specific template
- **Update Template** - Modify existing template
- **Delete Template** - Remove a template
- **Search Templates** - Test search functionality

#### User Management
- **Get User Profile** - View current user info
- **Update User Profile** - Modify user details
- **Change Password** - Test password change

#### Admin Functions (requires admin role)
- **Get All Users** - List all users
- **Toggle User Status** - Enable/disable users
- **Get User by ID** - View specific user
- **Delete User** - Remove users
- **Get System Stats** - View system statistics

## Authentication Details

### Automatic Token Management
The collection includes automatic token management:
- Login and Refresh Token requests automatically save tokens
- All protected endpoints use the saved `accessToken`
- Bearer token authentication is configured at the collection level

### Manual Token Management
If automatic token management fails:
1. Copy the `accessToken` from a login response
2. Go to Collection → Variables
3. Set the `accessToken` variable manually

## Query Parameters

### Pagination
Most list endpoints support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Filtering
- `category` - Filter by category
- `language` - Filter by programming language
- `tags` - Filter by tags (comma-separated)
- `framework` - Filter by framework (templates only)

### Search
- `q` - Search query
- `sortBy` - Sort field (popularity, date, title)
- `sortOrder` - Sort direction (asc, desc)

## Sample Test Data

### User Registration
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User"
}
```

### Sample Prompt
```json
{
  "title": "React Component Generator",
  "prompt": "Create a React functional component with {{specifications}}",
  "description": "Generate React components with TypeScript",
  "tags": ["react", "typescript", "component"],
  "category": "development",
  "language": "javascript"
}
```

### Sample Template
```json
{
  "name": "React TypeScript Project Setup",
  "category": "web",
  "language": "typescript",
  "framework": "react",
  "description": "Complete React TypeScript project setup",
  "content": "# Project Setup Instructions...",
  "tags": ["react", "typescript", "setup"]
}
```

## Error Handling

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { /* additional error details */ }
  }
}
```

## Testing Tips

1. **Test in Order**: Start with health check, then authentication, then API endpoints
2. **Use Variables**: Leverage collection variables for IDs and tokens
3. **Check Responses**: Verify response structure matches API documentation
4. **Test Edge Cases**: Try invalid data, missing parameters, and boundary conditions
5. **Rate Limiting**: Be aware of rate limits when testing repeatedly
6. **Admin Testing**: Create an admin user to test admin endpoints

## Environment Configuration

### Development Environment
- Base URL: `http://localhost:8181`
- Database: SQLite (local file)
- Logging: Console output

### Production Environment
Create a new environment for production:
- Base URL: Your production server URL
- Update authentication credentials as needed

## Troubleshooting

### Common Issues
1. **Service not running**: Ensure the Node.js service is started
2. **Invalid tokens**: Re-authenticate if tokens expire
3. **CORS errors**: Check if frontend origin is allowed
4. **Database errors**: Verify database connection and migrations

### Debug Information
- Check console output for detailed error messages
- Use network tab in browser for additional debugging
- Review application logs for server-side issues

## Advanced Testing

### Collection Runner
Use Postman's Collection Runner to:
1. Run all tests automatically
2. Test with different data sets
3. Generate test reports

### Newman CLI
Run tests from command line:
```bash
newman run Copilot_Prompter_NodeJS_API.postman_collection.json \
  -e Copilot_Prompter_NodeJS_Development.postman_environment.json
```

## API Documentation
Access the interactive Swagger documentation at:
`http://localhost:8181/api/docs`

This provides detailed information about all endpoints, request/response schemas, and allows for interactive testing.
