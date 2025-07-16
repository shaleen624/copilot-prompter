#!/bin/bash

# 🚀 Copilot Prompter API - Swagger Documentation Demo
# This script demonstrates the enhanced Swagger/OpenAPI documentation

echo "🎯 Copilot Prompter API Documentation Demo"
echo "=========================================="
echo

# Base URL
BASE_URL="http://localhost:8080/api"

echo "📍 API Base URL: $BASE_URL"
echo

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s "$BASE_URL/actuator/health" > /dev/null; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend is not running. Please start it with:"
    echo "   cd backend && mvn spring-boot:run"
    exit 1
fi
echo

# Display Swagger UI URLs
echo "🌐 Swagger Documentation URLs:"
echo "   📚 Interactive UI:    $BASE_URL/swagger-ui.html"
echo "   📋 OpenAPI JSON:      $BASE_URL/v3/api-docs"
echo "   📄 OpenAPI YAML:      $BASE_URL/v3/api-docs.yaml"
echo

# Test OpenAPI spec
echo "🔍 Testing OpenAPI specification..."
echo "📊 API Information:"
curl -s "$BASE_URL/v3/api-docs" | jq -r '
"   🏷️  Title: " + .info.title +
"\n   📝 Version: " + .info.version +
"\n   📖 Description: " + (.info.description | split("\n")[0])
'
echo

# Show available endpoints
echo "🛠️ Available API Endpoints:"
curl -s "$BASE_URL/v3/api-docs" | jq -r '
.paths | keys[] | "   📌 " + .
' | head -10
echo "   ... and more!"
echo

# Show security scheme
echo "🔒 Security Configuration:"
curl -s "$BASE_URL/v3/api-docs" | jq -r '
.components.securitySchemes | keys[] as $k | 
"   🔑 " + $k + ": " + .[$k].scheme + " (" + .[$k].type + ")"
'
echo

# Demo authentication
echo "🔐 Demo Authentication:"
echo "   👤 Default admin credentials:"
echo "      Username: admin"
echo "      Password: admin123"
echo

echo "💡 Quick Test Commands:"
echo "   # 1. Login and get token"
echo "   curl -X POST $BASE_URL/auth/login \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"username\":\"admin\",\"password\":\"admin123\"}'"
echo
echo "   # 2. Use token for authenticated requests"
echo "   curl -H \"Authorization: Bearer YOUR_TOKEN\" $BASE_URL/prompts"
echo

echo "🎨 Swagger UI Features:"
echo "   ✨ Interactive API testing"
echo "   🔐 Built-in authentication"
echo "   📚 Comprehensive documentation"
echo "   🎯 Request/response examples"
echo "   🔍 API endpoint filtering"
echo "   📊 Schema visualization"
echo

echo "🚀 Get Started:"
echo "   1. Open: $BASE_URL/swagger-ui.html"
echo "   2. Click 'Authorize' button"
echo "   3. Login with admin/admin123"
echo "   4. Copy the accessToken"
echo "   5. Paste in Authorization dialog"
echo "   6. Start testing APIs!"
echo

# Open Swagger UI if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Opening Swagger UI in your browser..."
    open "$BASE_URL/swagger-ui.html"
fi

echo
echo "✅ Swagger API Documentation is ready!"
echo "📖 For detailed guide, see: SWAGGER_API_DOCUMENTATION.md"
