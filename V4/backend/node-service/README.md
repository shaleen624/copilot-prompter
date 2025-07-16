# Copilot Prompter Node.js Microservice

A comprehensive Node.js/Express backend microservice for the Copilot Prompter application - a platform for managing AI prompts and copilot templates.

## Features

- **Prompt Management**: CRUD operations for AI prompts with search and filtering
- **Template Management**: CRUD operations for copilot instruction templates
- **User Authentication**: JWT-based authentication and authorization
- **Admin Panel**: Administrative functions for user and content management
- **Security**: Comprehensive security middleware with rate limiting
- **Database Abstraction**: Easy switching between SQLite, MySQL, and PostgreSQL
- **API Documentation**: Swagger/OpenAPI documentation
- **Performance**: Optimized with compression and caching strategies
- **Logging**: Structured logging with Winston
- **Error Handling**: Centralized error handling with detailed logging

## Technology Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (default), MySQL, PostgreSQL support
- **ORM**: Sequelize
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Validation**: Joi
- **Logging**: Winston
- **Testing**: Jest
- **Build Tool**: TypeScript Compiler

## Quick Start

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. **Navigate to the node-service directory**:
   ```bash
   cd backend/node-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the application**:
   ```bash
   npm run build
   ```

4. **Run in development mode**:
   ```bash
   npm run dev
   ```

5. **Run in production mode**:
   ```bash
   npm start
   ```

### Environment Configuration

Copy `.env` to `.env.local` and modify as needed:

```bash
cp .env .env.local
```

### Database Configuration

The service supports multiple database types through environment variables:

#### SQLite (Default)
```env
DB_TYPE=sqlite
DB_PATH=../data/copilot_prompter.db
```

#### MySQL
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=copilot_prompter
DB_USER=root
DB_PASSWORD=password
```

#### PostgreSQL
```env
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=copilot_prompter
DB_USER=postgres
DB_PASSWORD=password
```

## API Documentation

When running in development mode, API documentation is available at:
- Swagger UI: `http://localhost:3000/api/docs`
- Health Check: `http://localhost:3000/health`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Project Structure

```
src/
├── app.ts              # Application setup and configuration
├── server.ts           # Server entry point
├── config/             # Configuration files
│   ├── config.ts       # Environment configuration
│   └── swagger.ts      # API documentation setup
├── controllers/        # Request handlers
├── database/           # Database configuration and management
│   └── DatabaseManager.ts
├── middleware/         # Express middleware
│   ├── auth.ts         # Authentication middleware
│   ├── errorHandler.ts # Error handling middleware
│   └── rateLimiter.ts  # Rate limiting middleware
├── models/             # Database models
│   ├── user.model.ts
│   ├── prompt.model.ts
│   └── template.model.ts
├── routes/             # API routes
│   ├── auth.routes.ts
│   ├── prompt.routes.ts
│   ├── template.routes.ts
│   ├── user.routes.ts
│   └── admin.routes.ts
├── services/           # Business logic
│   └── user.service.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    └── logger.ts
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Prompts
- `GET /api/prompts` - Get all prompts
- `GET /api/prompts/:id` - Get prompt by ID
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template by ID
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/toggle` - Toggle user status (admin only)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse with configurable rate limits
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Comprehensive input validation
- **Password Hashing**: bcrypt for secure password storage

## Error Handling

The application includes comprehensive error handling:
- Centralized error handling middleware
- Structured error responses
- Detailed logging for debugging
- Custom error classes for different scenarios

## Database Design

The service uses the same database schema as the Java microservice:
- Users table with role-based access control
- Prompts table with tagging and categorization
- Templates table for copilot instructions
- Proper indexing for performance

## Performance Optimization

- **Compression**: Gzip compression for responses
- **Caching**: Response caching strategies
- **Database Optimization**: Query optimization and indexing
- **Connection Pooling**: Database connection pooling
- **Rate Limiting**: Protect against abuse

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Production Deployment

1. Set environment to production:
   ```bash
   NODE_ENV=production
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Run linting before committing

## License

MIT License - see LICENSE file for details.
