# 📚 Swagger API Documentation Guide for java microservice

## 🚀 Quick Start

Your Copilot Prompter API is now fully documented with Swagger/OpenAPI 3.0! Access the interactive documentation at:

### 🔗 Swagger UI URLs
- **Main Interface**: http://localhost:8080/api/swagger-ui.html
- **API Docs JSON**: http://localhost:8080/api/v3/api-docs
- **API Docs YAML**: http://localhost:8080/api/v3/api-docs.yaml

## 📋 What's Included

### 🎯 Complete API Documentation
- **Authentication**: JWT-based login, refresh, and logout endpoints
- **Prompts**: Full CRUD operations with search, filtering, and pagination
- **Templates**: Copilot template management with framework-specific features
- **Admin**: User management and administrative functions
- **Health**: Application health monitoring endpoints

### 🔒 Security Integration
- JWT Bearer token authentication
- Role-based access control (USER, ADMIN)
- Interactive "Authorize" button in Swagger UI
- Token management with automatic header injection

### 🎨 Enhanced UI Features
- **Grouping**: APIs organized by functionality (Public, Admin)
- **Sorting**: Operations sorted by method, tags sorted alphabetically
- **Interactive**: Try-it-out functionality enabled
- **Filtering**: Search and filter operations
- **Documentation**: Comprehensive descriptions and examples

## 🛠️ How to Use Swagger UI

### 1. **Access the Documentation**
```bash
# Start your backend
cd backend
mvn spring-boot:run

# Open Swagger UI in browser
open http://localhost:8080/api/swagger-ui.html
```

### 2. **Authenticate Your Requests**
1. Click the **"Authorize"** button (🔒 icon) in the top right
2. Login first using the `/auth/login` endpoint:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
3. Copy the `accessToken` from the response
4. Paste it in the Authorization dialog (without "Bearer " prefix)
5. Click **"Authorize"** - all subsequent requests will include the token

### 3. **Explore API Endpoints**
- **Expand sections** by clicking on the controller names
- **Try endpoints** using the "Try it out" button
- **View schemas** by scrolling down to see request/response models
- **Copy curl commands** from the generated examples

### 4. **Test Complete Workflows**
```bash
# 1. Authentication
POST /auth/login
{
  "username": "admin",
  "password": "admin123"
}

# 2. Get all prompts (with token)
GET /prompts?page=0&size=10

# 3. Create a new prompt (admin only)
POST /prompts
{
  "title": "New AI Prompt",
  "prompt": "Your prompt content here",
  "category": "General",
  "tags": ["ai", "test"]
}

# 4. Search prompts
GET /prompts/search?q=angular&category=Frontend
```

## 📖 API Groups and Features

### 🌐 Public APIs (`/auth`, `/prompts`, `/templates`)
- **No authentication required**: Basic read operations
- **Public endpoints**: Login, health check, some prompt/template views
- **Search & Browse**: Category listing, popular content

### 🔐 Admin APIs (`/admin`)
- **Full authentication required**: ADMIN role needed
- **User Management**: Create, read, update users
- **Content Management**: Full CRUD for prompts and templates
- **System Administration**: Advanced configuration

## 🎛️ Configuration Details

### Application Properties
```properties
# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true
springdoc.swagger-ui.filter=true
springdoc.swagger-ui.use-root-path=true
springdoc.show-actuator=true

# API Groups
springdoc.group-configs[0].group=public
springdoc.group-configs[0].paths-to-match=/auth/**,/prompts/**,/templates/**,/actuator/**
springdoc.group-configs[1].group=admin
springdoc.group-configs[1].paths-to-match=/admin/**
```

### Security Configuration
- Swagger UI paths are permitted without authentication
- Interactive testing works with live authentication
- JWT tokens are properly handled in the UI

## 🔧 Development Tips

### 1. **API Design Best Practices**
- All endpoints use proper HTTP status codes
- Request/response models are documented with examples
- Pagination follows standard patterns
- Error responses include helpful messages

### 2. **Testing Workflows**
```bash
# Quick health check
curl http://localhost:8080/api/actuator/health

# Full authentication test
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use token for authenticated requests
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/prompts
```

### 3. **Integration with Frontend**
```typescript
// Angular service example
const API_BASE = 'http://localhost:8080/api';
const token = localStorage.getItem('accessToken');

// Use the same endpoints documented in Swagger
this.http.get(`${API_BASE}/prompts`, {
  headers: { Authorization: `Bearer ${token}` }
})
```

## 📊 Advanced Features

### 📈 API Monitoring
- Health endpoints included in documentation
- Actuator endpoints for monitoring
- Performance metrics available

### 🔍 Search and Discovery
- Full-text search across prompts and templates
- Category-based filtering
- Tag-based organization
- Popularity tracking

### 🚦 Error Handling
- Standardized error responses
- Validation error details
- Security error handling
- Proper HTTP status codes

## 🎯 Next Steps

1. **Bookmark the Swagger UI**: http://localhost:8080/api/swagger-ui.html
2. **Test your Angular frontend** against the documented endpoints
3. **Use the API schemas** to generate TypeScript interfaces
4. **Export Postman collections** from the OpenAPI spec
5. **Share documentation** with your team using the URLs above

## 🤝 Integration Examples

### Postman Collection Import
```bash
# Import from OpenAPI spec
File → Import → Link
URL: http://localhost:8080/api/v3/api-docs
```

### TypeScript Interface Generation
```bash
# Generate TypeScript from OpenAPI
npx openapi-generator-cli generate \
  -i http://localhost:8080/api/v3/api-docs \
  -g typescript-angular \
  -o ./src/app/api/
```

---

🎉 **Your API documentation is now live and interactive!** Use Swagger UI to explore, test, and integrate with your Copilot Prompter API.
