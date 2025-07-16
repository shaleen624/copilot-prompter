# Copilot Prompter Backend

A comprehensive Spring Boot backend API for the Copilot Prompter application - a platform for managing AI prompts and copilot templates.

## Features

- **Prompt Management**: CRUD operations for AI prompts with search and filtering
- **Template Management**: CRUD operations for copilot instruction templates
- **User Authentication**: JWT-based authentication and authorization
- **Admin Panel**: Administrative functions for user and content management
- **Security**: Spring Security with role-based access control
- **Database Abstraction**: Easy switching between SQLite, MySQL, and MongoDB
- **API Documentation**: OpenAPI/Swagger documentation
- **CORS Support**: Configurable CORS for frontend integration

## Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Security**: Spring Security with JWT
- **Database**: SQLite (default), MySQL, MongoDB support
- **ORM**: Spring Data JPA
- **Documentation**: SpringDoc OpenAPI 3
- **Build Tool**: Maven
- **Java Version**: 17+

## Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.6+

### Running the Application

1. **Clone and navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Build the application**:
   ```bash
   mvn clean compile
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Access the application**:
   - API Base URL: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/api/swagger-ui/index.html
   - Health Check: http://localhost:8080/api/actuator/health

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Prompts (Public Read Access)
- `GET /prompts` - Get all prompts with filtering and pagination
- `GET /prompts/{id}` - Get prompt by ID
- `GET /prompts/categories` - Get all categories
- `GET /prompts/languages` - Get all languages
- `GET /prompts/popular` - Get popular prompts
- `GET /prompts/latest` - Get latest prompts
- `POST /prompts/{id}/copy` - Increment copy count

### Prompts (Admin Only)
- `POST /prompts` - Create new prompt
- `PUT /prompts/{id}` - Update prompt
- `DELETE /prompts/{id}` - Delete prompt

### Templates (Public Read Access)
- `GET /templates` - Get all templates with filtering and pagination
- `GET /templates/{id}` - Get template by ID
- `GET /templates/categories` - Get all categories
- `GET /templates/languages` - Get all languages
- `GET /templates/frameworks` - Get all frameworks
- `GET /templates/popular` - Get popular templates
- `GET /templates/latest` - Get latest templates
- `POST /templates/{id}/download` - Increment download count

### Templates (Admin Only)
- `POST /templates` - Create new template
- `PUT /templates/{id}` - Update template
- `DELETE /templates/{id}` - Delete template

### Admin
- `GET /admin/users` - Get all users
- `POST /admin/users` - Create new user
- `PUT /admin/users/{id}` - Update user
- `DELETE /admin/users/{id}` - Delete user
- `PUT /admin/users/{id}/enable` - Enable/disable user

## Configuration

### Database Configuration

#### SQLite (Default)
```properties
spring.datasource.url=jdbc:sqlite:./data/copilot_prompter.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
```

#### MySQL
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/copilot_prompter
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

#### MongoDB
```properties
spring.data.mongodb.uri=${MONGODB_URI}
spring.data.mongodb.database=copilot_prompter
```

### Environment Profiles

- **Development**: Use `application-dev.properties`
- **Production**: Use `application-prod.properties`

### Security Configuration

```properties
# JWT Configuration
jwt.secret=YourVerySecretKeyThatShouldBeAtLeast32CharactersLongForSecurity
jwt.expiration=86400000
jwt.refresh-expiration=604800000

# CORS Configuration
cors.allowed-origins=http://localhost:4200,http://localhost:8080
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
```

## Database Migration

To switch from SQLite to MySQL or MongoDB:

1. **Update dependencies** in `pom.xml`
2. **Modify configuration** in `application.properties`
3. **Update repositories** if switching to MongoDB (use `@Document` instead of `@Entity`)

### Example MySQL Migration

1. Uncomment MySQL dependency in `pom.xml`
2. Update `application-prod.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/copilot_prompter_prod
   spring.datasource.username=${DB_USERNAME}
   spring.datasource.password=${DB_PASSWORD}
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   ```
3. Run with production profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=prod
   ```

## Development

### Building for Production

```bash
mvn clean package -Pprod
```

### Running Tests

```bash
mvn test
```

### Code Quality

The project follows Spring Boot best practices:
- Layered architecture (Controller → Service → Repository)
- DTO pattern for data transfer
- Global exception handling
- Input validation
- Security best practices
- Comprehensive logging

### API Documentation

Access the interactive API documentation at:
http://localhost:8080/api/swagger-ui/index.html

## Security Features

- JWT-based authentication
- Role-based authorization (USER, ADMIN)
- CORS configuration
- Input validation
- Exception handling
- Secure password encoding (BCrypt)

## Monitoring

The application includes Spring Boot Actuator for monitoring:
- Health checks: `/actuator/health`
- Application info: `/actuator/info`
- Metrics: `/actuator/metrics`

## Frontend Integration

The backend is designed to work seamlessly with the Angular frontend:
- CORS configured for `http://localhost:4200`
- REST API endpoints match Angular service expectations
- JWT token format compatible with Angular interceptors

## Support

For questions and support, please check the API documentation or create an issue in the repository.
