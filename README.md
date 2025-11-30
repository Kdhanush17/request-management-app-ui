# RequestFlow: A React-based Request Management UI

RequestFlow is a modern Single Page Application (SPA) built with React.js that provides a user interface for managing requests and approval workflows. It features a sleek, responsive design and includes authentication (login/register) for both employees and managers, enabling role-based access control to various functionalities. The application also supports a "Test Mode" for development and demonstration purposes, allowing users to interact with mock data without needing a live backend connection.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Functionality Overview](#functionality-overview)
- [Authentication and Roles](#authentication-and-roles)
- [Test Mode](#test-mode)
- [How to Run the Application](#how-to-run-the-application)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Starting the Application](#starting-the-application)
- [Testing](#testing)
- [Backend API](#backend-api)

## Features

*   **User Authentication:** Secure login and registration for employees and managers.
*   **Role-Based Access Control:** Differentiated functionalities for employees and managers.
    *   **Employees:** Create new requests, view their own and assigned requests, mark approved requests as actioned, and close actioned requests.
    *   **Managers:** View all requests, approve or reject pending requests.
*   **Request Management:**
    *   Create requests with title, description, and assignment to other team members.
    *   View requests with status badges (Pending Approval, Approved, Rejected, Actioned, Closed).
    *   Filter requests by status.
*   **Dashboard:** Overview of request statistics (Total, Pending, Completed, Efficiency).
*   **Responsive UI:** Modern and intuitive user interface using React Router for navigation.
*   **Test Mode:** In-built mode to test functionalities with mock data without a backend.

## Project Structure

The project follows a standard React application structure:

```
request-management-app-ui/
├── public/                     # Public assets (index.html, logos, manifest)
├── src/                        # Source code
│   ├── App.js                  # Main application component and routing
│   ├── App.css                 # Global application styles
│   ├── Auth.js                 # Authentication logic (login/register forms)
│   ├── Auth.css                # Styles for authentication components
│   ├── Requests.js             # Request management component (create, view, update requests)
│   ├── Requests.css            # Styles for request components
│   ├── index.js                # Entry point of the React application
│   ├── pages/                  # Page-level components
│   │   ├── HomePage.js         # Landing page with marketing content and test mode toggle
│   │   ├── AuthPage.js         # Wrapper for Auth component
│   │   ├── DashboardPage.js    # User dashboard displaying requests and stats
│   │   ├── HomePage.css        # Styles for HomePage
│   │   ├── AuthPage.css        # Styles for AuthPage
│   │   └── DashboardPage.css   # Styles for DashboardPage
│   └── ...                     # Other utility files (reportWebVitals, setupTests, etc.)
├── package.json                # Project dependencies and scripts
├── README.md                   # This file
└── .gitignore                  # Git ignore file
```

## Functionality Overview

The application is centered around `src/App.js`, which handles routing and global state management, including authentication tokens, user roles, and the `isTestMode` state.

1.  **Home Page (`src/pages/HomePage.js`):**
    *   Serves as the landing page for the application.
    *   Includes navigation links to Sign In and Register.
    *   Features a "Test Mode" toggle button. When activated, the application operates using predefined mock data for authentication and requests, bypassing the need for a live backend. This is crucial for development and showcasing the UI independently.

2.  **Authentication (`src/Auth.js` and `src/pages/AuthPage.js`):**
    *   Users can register as an "employee" or "manager".
    *   Users can log in with their credentials.
    *   Upon successful login, a JWT token, user role, and user ID are stored in `localStorage` and managed in `App.js`'s state.
    *   In Test Mode, mock user credentials are provided for `testemployee` and `testmanager` (password: `password` for both).

3.  **Dashboard (`src/pages/DashboardPage.js`):**
    *   Accessible only to authenticated users (or in Test Mode).
    *   Displays general statistics like Total Requests, Pending, Completed, and Efficiency.
    *   Integrates the `Requests` component for managing requests.
    *   Managers can view a list of registered employees.

4.  **Request Management (`src/Requests.js`):**
    *   **Employees:** Can create new requests, providing a title, description, and assigning it to another team member (employee or manager). They can also mark `approved` requests as `actioned`, and `actioned` requests as `closed`.
    *   **Managers:** Can see all requests, and for `pending_approval` requests, they can `approve` or `reject` them.
    *   Requests are displayed in a grid, with visual status badges.
    *   A filter section allows users to view requests based on their status (All, Pending Approval, Approved, Actioned, Closed, Rejected).
    *   In Test Mode, a predefined set of mock requests is used. Actions like creating, approving, or closing requests in Test Mode will update this mock data in the UI.

## Authentication and Roles

*   **Employee:** Can create requests and manage requests assigned to them (mark as actioned, close).
*   **Manager:** Can view all requests and approve/reject pending requests.

## Test Mode

RequestFlow includes a robust "Test Mode" to facilitate development, testing, and demonstrations without requiring a running backend API.

*   **Activation:** Activated via a toggle button on the `HomePage`.
*   **Functionality:**
    *   **Authentication:** Uses predefined mock user credentials (`testemployee`, `testmanager` with password `password`) for login.
    *   **Employee Data:** Provides mock employee data for managers.
    *   **Requests:** Uses a set of mock requests for display and manipulation. Creating or modifying requests in Test Mode will update the in-memory mock data, reflecting changes in the UI.
*   **API Calls:** All API calls to `http://localhost:5000/api/auth` and `http://localhost:5000/api/requests` are bypassed when `isTestMode` is `true`.

## How to Run the Application

### Prerequisites

*   **Node.js:** Make sure you have Node.js (which includes npm) installed. You can download it from [nodejs.org](https://nodejs.org/).
*   **Backend API:** This UI expects a backend API running on `http://localhost:5000`. You will need to set up and run the corresponding backend application for full functionality (outside of Test Mode). The API endpoints used are `http://localhost:5000/api/auth` for user authentication and `http://localhost:5000/api/requests` for request management.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Kdhanush17/request-management-app-ui.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd request-management-app-ui
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Starting the Application

1.  **Start the React development server:**
    ```bash
    npm start
    ```
    This will open the application in your browser at `http://localhost:3000`.

2.  **Ensure Backend is Running:** For full functionality (outside of Test Mode), ensure your backend API is running and accessible at `http://localhost:5000`.

## Testing

The project includes basic testing setup with `@testing-library/react` and `jest-dom`.

To run the tests:

```bash
npm test
```

Currently, tests are configured for components rendered by `react-scripts`. You can extend these to cover more specific functionalities of the application.

## Backend API

This frontend application is designed to interact with a separate backend API. The expected base URL for the API is `http://localhost:5000`.
The authentication endpoints are expected at `http://localhost:5000/api/auth/register` and `http://localhost:5000/api/auth/login`.
The request management endpoints are expected at `http://localhost:5000/api/requests`.

The backend should handle:
*   User registration and login (issuing JWTs).
*   User roles (employee/manager).
*   CRUD operations for requests.
*   Approval/rejection logic for requests.
*   Authorization checks using JWTs.
