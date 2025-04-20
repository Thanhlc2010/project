# Issue Tracking API

A robust REST API for issue tracking and project management, built with TypeScript, Express.js, and Prisma. Similar to Jira, it provides comprehensive features for managing projects, issues, and team collaboration.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Role-based access control

- 📊 **Project Management**
  - Create and manage projects
  - Add/remove project members
  - Project-specific configurations

- 🎯 **Issue Tracking**
  - Create, update, and delete issues
  - Support for sub-issues
  - Priority levels (Lowest to Highest)
  - Status tracking (Todo, In Progress, In Review, Done)
  - Due date management
  - Issue assignment

- 🏷️ **Labels & Comments**
  - Custom project labels with colors
  - Comment system for issues
  - Rich text description support

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Security**:
  - Helmet for HTTP headers
  - Rate limiting
  - CORS enabled
  - Request timeout handling
  - Password hashing (bcrypt)

## Prerequisites

- Node.js (v14 or higher)
- MySQL database (compatible with Prisma ^5.10.2)
- npm (v6 or higher) or yarn

## Version Information

- **Node.js**: v14.x or higher
- **Express.js**: ^4.18.3
- **TypeScript**: ^5.3.3
- **Prisma**: ^5.10.2
- **MySQL**: 8
- **Other Key Dependencies**:
  - bcrypt: ^5.1.1 (password hashing)
  - jsonwebtoken: ^9.0.2 (JWT authentication)
  - helmet: ^8.1.0 (security headers)
  - cors: ^2.8.5 (CORS support)
  - swagger-ui-express: ^5.0.1 (API documentation)

## Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd [project-directory]
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="mysql://user:password@localhost:3306/database_name"

   # JWT
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="24h"

   # Server
   PORT=3000
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

5. **Build and Run**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## Docker Deployment

You can run this application using Docker:

1. **Build the Docker image**
  ```bash
  docker build -t issue-tracking-api .
  ```

2. **Run the container**
  ```bash
  docker run -d \
    --name issue-tracker \
    -p 3000:3000 \
    -e DATABASE_URL="mysql://user:password@host.docker.internal:3306/database_name" \
    -e JWT_SECRET="your-jwt-secret" \
    -e JWT_EXPIRES_IN="24h" \
    issue-tracking-api
  ```

  Note:
  - Replace the `DATABASE_URL` with your actual database connection string
  - Use `host.docker.internal` instead of `localhost` to connect to a database running on your host machine
  - The API will be available at `http://localhost:3000`

3. **View container logs**
  ```bash
  docker logs issue-tracker
  ```

4. **Stop the container**
  ```bash
  docker stop issue-tracker
  ```

5. **Remove the container**
  ```bash
  docker rm issue-tracker
  ```

## Database Schema

### Core Entities

- **Users**: Authentication and user management
- **Projects**: Project organization
- **Issues**: Task and issue tracking
- **Comments**: Communication on issues
- **Labels**: Issue categorization

### Key Relationships

- Projects have multiple members and issues
- Issues can have sub-issues
- Issues belong to projects and can be assigned to users
- Labels are project-specific and can be applied to issues
- Comments are linked to both issues and users

## Available Scripts

- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build the project
- `npm start`: Start production server
- `npm run prisma:generate`: Generate Prisma Client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Launch Prisma Studio for database management

## API Documentation

The API documentation is available at `/api-docs` when the server is running, powered by Swagger UI.

## Security Features

- Request rate limiting
- HTTP security headers (via Helmet)
- CORS protection
- Password hashing
- JWT-based authentication
- Request timeout handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
