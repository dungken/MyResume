# Coolmate API Backend

## 1. Project Overview

The coolmate-api is a comprehensive backend RESTful API that serves as the foundation for an e-commerce platform, specifically for clothing/apparel products. The project implements a full suite of functionalities including:

- User authentication and authorization with multi-factor authentication
- Product catalog management with categories, sizes, colors, and images
- Order processing and payment handling
- Customer feedback and review system
- Admin dashboard with analytics
- Role-based permission system

## 2. APIs Implemented

The API is organized by modules with the following endpoints:

### Authentication & User Management
- **Account**: Registration, login, social login (Google, Facebook), password management, two-factor authentication
- **User**: User profile management, user listing for admin
- **Role**: Role creation, assignment, and management
- **Permission**: Permission assignment and verification

### Product Management
- **Products**: CRUD operations for products
- **Categories**: Category hierarchy and management
- **Colors**: Product color options
- **Sizes**: Product size options
- **Images**: Product image uploads and management
- **Discounts**: Product discount management

### Order & Payment
- **Order**: Order creation, modification, and status updates
- **Payment**: Payment processing and verification

### Feedback & Reviews
- **Feedback**: Customer product reviews and ratings

### Analytics
- **Dashboard**: Sales analytics and reporting

## 3. Technologies Used

### Programming Language & Framework
- **Language**: C# (.NET 8.0)
- **Framework**: ASP.NET Core Web API
- **Architecture**: RESTful API

### Data Access & ORM
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core 8.0
- **Identity**: ASP.NET Core Identity for user management

### Authentication & Security
- **JWT**: Token-based authentication with JwtBearer
- **OAuth**: Integration with Google and Facebook for social login
- **2FA**: Two-factor authentication via email verification
- **Password Management**: Secure password reset and recovery flows

### Third-Party Integrations
- **Cloudinary**: Cloud-based image management
- **Twilio**: SMS verification services
- **Firebase**: For additional authentication services
- **Email Service**: SMTP integration for email notifications

### Development Tools
- **Swagger/OpenAPI**: API documentation and testing
- **Docker**: Containerization for deployment
- **Docker Compose**: Container orchestration
- **AutoMapper**: Object-to-object mapping
- **Entity Framework Migrations**: Database versioning and schema changes

## 4. Project Structure

The project follows a clean, modular architecture with:

- **Controllers**: API endpoints organized by domain
- **Models**: Data entities and domain models
- **DTOs**: Data transfer objects for API communication
- **Services**: Business logic implementation with interface-based design
- **Interfaces**: Service contracts for dependency injection
- **Data**: Database context and configuration
- **Migrations**: Database schema version control
- **Auth**: Custom authentication handlers and requirements
- **Middleware**: Global error handling and request processing
- **Extensions**: Utility extension methods
- **Utils**: Helper classes and utilities
- **Profiles**: AutoMapper mapping configurations

## 5. Database Design

The project uses SQL Server with Entity Framework Core as the ORM, featuring:

- **Identity Framework**: Extended for custom user and role management
- **Code-First Approach**: Models define the database schema
- **Migrations**: Utilized for database versioning and deployment
- **Relationships**: Properly defined one-to-many and many-to-many relationships
- **Soft Delete**: Implementation for data archiving instead of permanent deletion
- **Audit Trails**: CreatedAt and UpdatedAt tracking for entities
- **Concurrency Control**: Row versioning for data consistency

## 6. Authentication & Authorization

The project implements a robust security system with:

- **JWT Authentication**: Token-based authentication for API access
- **Claims-Based Authorization**: User permissions stored as claims
- **Role-Based Access Control**: Hierarchical roles with specific permissions
- **Permission Handler**: Custom authorization handlers for fine-grained access control
- **Token Management**: Proper token generation, validation, and refresh mechanisms
- **Multi-Factor Authentication**: Optional 2FA for enhanced security
- **Social Login**: Integration with Google and Facebook OAuth

## 7. Third-Party Integrations

The project integrates several external services:

- **Docker**: Containerization for consistent deployment
- **Cloudinary**: Cloud storage for product images
- **Twilio**: SMS services for notifications and verification
- **Firebase**: Additional authentication services
- **SMTP**: Email notifications for various user actions
- **QR Code**: Generation for various purposes using QRCoder

## 8. Architectural Highlights

- **Service-Oriented Architecture**: Clean separation of concerns
- **Repository Pattern**: Abstraction of data access layer
- **Dependency Injection**: Loose coupling between components
- **Interface-Based Design**: Services implement interfaces for testability
- **Exception Handling**: Global error handling middleware
- **Logging**: Structured logging throughout the application
- **CORS Configuration**: Secure cross-origin resource sharing
- **Response Standardization**: Consistent API response format
- **Environment-Based Configuration**: Different settings for development and production

This backend API provides a solid foundation for an e-commerce platform with all the necessary functionality for product management, user authentication, order processing, and administrative capabilities.