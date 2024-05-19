## Overview

This document outlines the architecture of a web application with distinct client-side and server-side components, focusing on their responsibilities, key components, and data flow. It also addresses error handling, logging, and opportunities for future improvements.

## 1. Client-Side

### Technology Stack
- **ReactJS**

### Responsibilities
- Provides the user interface for creating, viewing, and updating leads.
- Manages UI components.
- Makes API requests to the server.

### Key Components
- **App**: Manages the lifecycle and state of lead data, including creating, updating, and viewing leads.

## 2. Server-Side

### Technology Stack
- **Node.js**
- **Express**
- **MySQL**

### Responsibilities
- Provides RESTful API endpoints for lead operations (create, read, update).
- Handles business logic and data validation.
- Interacts with the database to persist and retrieve lead data.

### Key Components
- **API Endpoints**:
  - `GET /leads`: Retrieves all leads.
  - `POST /lead`: Creates a new lead.
  - `PUT /lead/:id`: Updates an existing lead.
- **Controller**: Manages request handling, business logic, and responses.

## 3. Database

### Technology Stack
- **MySQL**

### Responsibilities
- Stores lead data in a relational database.
- Ensures data integrity through ACID transactions.

### Key Components
- **Lead Schema**: Defines the structure of the Lead table including fields like `id`, `category`, `status`, `price`, `createdAt`.

## Data Flow

1. **Lead Creation**:
   - The user fills out the category and price on the frontend.
   - An API request is sent to the backend to create a new lead.
   - The backend processes the request, validates the inputs, and saves the lead to the database.
   - The backend responds with the created lead, which the frontend then displays in the table.

2. **View Leads**:
   - The frontend sends a request to retrieve all leads.
   - The backend fetches and returns all the leads.
   - The frontend updates the table to display the leads.

3. **Update Leads**:
   - A user selects a lead to accept or decline.
   - An API request is sent to update the lead's status.
   - The backend validates and processes the request, then updates the database.
   - The backend responds with the updated lead, and the frontend updates the lead's display.

## Error Handling and Logging

- **Error Handling**: 
  - Client-side: Displays errors on the UI for failed requests.
  - Server-side: Returns appropriate HTTP status codes and error messages upon failures.

- **Logging**: 
  - Server-side: Logs errors and important system events.

## Opportunities for Improvements

1. **Enhanced User Experience**:
   - **Accessibility**: Implement features such as ARIA roles, keyboard navigation, and screen reader support.
   - **Filtering**: Allow users to filter leads by category, price, and status for easier data management.
   - **Categories**: Category could be a drop down list populated by a `category` table. 

2. **Performance Optimization**:
   - **Caching**: Use client-side caching to minimize repetitive data fetching.
   - **Pagination**: Implement pagination to reduce the memory and processing load by fetching subsets of data.
   - **Database**: Status can be set as ENUM for database level validation. Category could be its own table with a relationship to leads. 

3. **Security Enhancements**:
   - **Authorization**: Implement role-based access control (RBAC) to restrict operations based on user roles.
   - **Data Validation**: Strengthen client-side validation to enhance

3. **Auditing and Logging**:
   - **Auditing**: Add audit trail for updating and creating of leads. Include an `updatedAt` column for the leads table. 
   - **Logging**: Proper logging of errors for observability. 

4. **General Code**:
   - **Improved Test**: Improved typing on the test cases to replicate requests, response and queries more accurately. Centralise repeated logic of request and response.  
