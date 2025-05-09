# Scientific Research API - Project Analysis

## Project Overview
The Scientific Research API is a comprehensive backend service for a discrete mathematics educational platform that applies an Ontology model (COKB). The system functions as a knowledge base and learning platform for scientific research, specifically focusing on discrete mathematics concepts, with features for theory management, discussion threads, and content organization.

## Implemented APIs
The API is organized into several modules:

1. **Account & User Management**
   - Authentication APIs (login, password reset, account activation)
   - User profile management

2. **Theory Management**
   - Theory categories and details
   - Theory keywords and examples
   - Keyword-example relationships

3. **Discussion Platform**
   - Thread management
   - Thread categories
   - Comments and discussions

4. **Content Management**
   - Posts and content organization
   - Page management
   - Content categorization

5. **Role & Permission Management**
   - Role-based access control
   - User-role assignments
   - Permission management

## Technologies Used

### Programming Language
- Java 17

### Framework
- Spring Boot 3.2.4
- Spring Data JPA
- Spring Security
- Spring Data REST
- Spring Mail

### Database
- MySQL database

### Security
- JWT (JSON Web Token) for authentication
- BCrypt password encryption
- Role-based authorization

### Development Tools
- Maven for dependency management and build automation
- Lombok for reducing boilerplate code

### Other Libraries
- JJWT (Java JWT) for token handling

## Project Structure
The project follows a well-organized, layered architecture:

- **Controller Layer**: REST endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access
- **Entity Layer**: Data models
- **DTO Layer**: Data transfer objects
- **Filter**: JWT authentication filter
- **Security Configuration**: Authentication and authorization settings

## Database Implementation
- MySQL with JPA/Hibernate ORM
- Automatic schema generation (ddl-auto: update)
- Entity relationship modeling with proper annotations
- Timestamp tracking with @PrePersist and @PreUpdate annotations

## Authentication & Authorization
- JWT-based stateless authentication
- Token generation with custom claims (roles, user info)
- Role-based access control (ADMIN, STAFF, USER roles)
- Protected endpoints with fine-grained permissions
- Password encryption with BCrypt

## Integrated Services
- Email service for account verification and password recovery
- CORS configuration for cross-origin requests

## Architecture Highlights
- Clear separation of concerns following MVC pattern
- DTO pattern for data transfer
- Repository pattern for data access
- Interface-based service design with implementation classes
- Layered architecture with proper dependency injection
- RESTful API design with appropriate HTTP methods
- Secure endpoint configuration with role-based access
