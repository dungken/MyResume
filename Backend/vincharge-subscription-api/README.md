# VinCharge Subscription API - Project Analysis

## Project Overview
The VinCharge Subscription API is a comprehensive backend service that powers VinFast's electric vehicle charging subscription platform. It manages user accounts, contracts, consumption records, and payment processing through integration with VNPay (Vietnam Payment Solution). The system enables users to track and pay for their electric vehicle charging usage efficiently and securely.

## Implemented APIs
The API is organized into several modules:

1. **Authentication & User Management**
   - User registration and authentication with JWT
   - Password reset with OTP verification via email
   - User profile management

2. **Contract Management**
   - Contract creation and tracking
   - Subscription status monitoring
   - Contract limits and activation

3. **Consumption Records**
   - Energy consumption tracking
   - Image upload for meter readings
   - Historical consumption data
   - Pricing calculations

4. **Payment Processing**
   - VNPay payment gateway integration
   - Transaction tracking and history
   - Payment status notification handling (IPN)
   - Payment URL generation for client redirection

5. **Error Logging**
   - Centralized error tracking
   - Error retention and cleanup policies

## Technologies Used

### Programming Language & Framework
- Java 17
- Spring Boot 3.2.3
- Spring Security
- Spring Data JPA
- Spring Mail

### Database
- PostgreSQL
- Flyway for database migrations
- JPA/Hibernate ORM

### Security
- JWT authentication
- Password encryption with BCrypt
- OTP for password reset
- HTTPS configuration (setup ready for production)

### Integrations
- VNPay payment gateway with HMAC-SHA512 security
- Cloudinary for image storage
- Gmail SMTP for email notifications

### Development & Documentation
- OpenAPI/Swagger for API documentation
- Maven for dependency management
- Lombok for reducing boilerplate code

## Project Structure
The project follows a well-organized, layered architecture:

- **Controller Layer**: REST endpoints for external access
- **Service Layer**: Business logic implementation
- **Repository Layer**: Data access abstraction
- **Model Layer**: Entity definitions and relationships
- **DTO Layer**: Request/response objects
- **Config Layer**: Application configuration
- **Security Layer**: Authentication and authorization

## Database Implementation
- PostgreSQL with dedicated schema
- Well-defined entity relationships
- Foreign key constraints
- Indexes for performance optimization
- Audit fields for record tracking (creation dates, etc.)

## Authentication & Authorization
- JWT-based authentication
- Token validation and expiration
- Password security with proper hashing
- OTP generation and validation for password reset

## Payment Integration
- Complete VNPay payment flow implementation
- Payment URL generation
- Return URL processing
- Instant Payment Notification (IPN) handling
- Transaction signing with HMAC-SHA512
- Transaction history tracking

## Notable Features
- Scheduled tasks for cleanup operations
- Image upload and storage in Cloudinary
- Email templating for notifications
- Comprehensive error handling
- Payment security with hash validation
- Multiple status tracking for transactions

## Architecture Highlights
- Clear separation of concerns
- RESTful API design
- DTO pattern for data transfer
- Global exception handling
- Asynchronous processing with task executors
- Scheduled tasks for maintenance operations
- CORS configuration for frontend security

The project demonstrates strong competence in building secure, enterprise-grade Java applications with payment processing capabilities and external service integrations.