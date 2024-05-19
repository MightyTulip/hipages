## Prerequisite 
Before starting, ensure you have the following installed:
* **MySQL 8**: Ensure MySQL is installed with a user who has permission to create databases.
* **Node.js (Version 20)**: Ensure Node.js is installed. This can be verified by running `node -v` in terminal.
* **Postman**: (Optional), for simulating the backend endpoints if you choose to not use the frontend.

## Setup and Running the Application
### Backend Setup
1. **Database Initialisation**:
  * Open terminal. 
  * Navigate to the `api` directory where the `init.sql` script is located.
  * Run the following command
  ```bash
  mysql -u root -p < init.sql
  ```
  * Enter your MySQL root password when prompted. This script will create a new database and table required for this application.

2. **Running the Backend**:
  * In the same `api` directory, install the dependencies:
  ```bash
  npm i
  ``` 
  * Start the server by running
  ```bash
  npx ts-node src/index.ts
  ```
  * The server should now be running on `http://localhost:3001`. You can use Postman to interact with the backend API.

### Frontend Setup
1. **Starting the frontend**:
  * Open a new terminal window.
  * From the root directory of the project, install the dependencies:
  ```bash
  npm i
  ```
  * Start the frontend by running: 
  ```bash
  npm frun frontend
  ```
  * This command should open a new page on the browser at `http://localhost:3000`, where you can interact with the frontend of the application.

### Running Tests
## Backend Test
1. **Execute Backend Tests**:
  * Navigate to the `api` directory.
  * Run the backend test using:
  ```bash
  npm test
  ```
  * This will execute the tests for the controller, including a coverage report to review test coverage.

## Frontend Test
1. **Execute Front Tests**:
  * In the root directory run:
  ```bash
  npm test
  ```
  * This will run the test for the frontend. 
