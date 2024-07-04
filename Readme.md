
User Session Management API
===========================

This Node.js application manages user sessions, allowing creation, login, and retrieval of user details with session management. It includes features for handling multiple concurrent logins and provides administrative insights into user sessions.

Setup Instructions
------------------

### Prerequisites

-   Node.js (v14.x or higher)
-   MongoDB installed and running locally or accessible via a URL

### Installation

1.  Clone the repository:

    `https://github.com/Tanmay17/session-management-app.git`
    `cd session-management-api`

2.  Install dependencies:
    `npm install`

3.  Set environment variables:

    Create a `.env` file in the root directory with the following variables:
	

    PORT=5000
    MONGO_URI=mongodb://localhost:27017/session-management
    JWT_SECRET=your_jwt_secret_key

Replace `your_jwt_secret_key` with a secure secret key for JWT token generation.

### Database Setup

Ensure MongoDB is running either locally or at the specified `MONGO_URI`.

### Starting the Server

Start the server with:

`npm start`

The server will start running at `http://localhost:5000`.

API Endpoints
-------------

### 1\. Create User

-   **Method:** POST
-   **URL:** `/api/users/createUser`
-   **Body:**

   

>     {
>         "mobile": "9012345678",
>         "username": "SavingsBank",
>         "password": "password123"
>     }

-   **Description:** Creates a new user with provided mobile number, username, and password. Generates a session key and logs the user in.

### 2\. Login User

-   **Method:** POST
-   **URL:** `/api/users/loginUser`
-   **Body:**

    ``{
        "mobile": "9012345678",
        "password": "password123"
    }``

-   **Description:** Logs in a user with provided mobile number and password. Checks for existing active sessions and invalidates them if found. Generates a new session key.

### 3\. Get User Details

-   **Method:** GET
-   **URL:** `/api/users/doGetUser/:mobile`
-   **Description:** Fetches details of a user based on their mobile number. Includes active session details and all session history.

### 4\. Admin: Get All Users

-   **Method:** GET
-   **URL:** `/api/users/admin/getAllUsers`
-   **Authorization:** Basic Auth with username `admin` and password `password`
-   **Description:** Fetches details of all users including their session history. Requires admin credentials for access.

Testing with cURL
-----------------

You can test the APIs using cURL commands. Make sure to replace placeholders (`<repository-url>`, `your_jwt_secret_key`, etc.) with your actual values.

### Example cURL Commands

1.  **Create User:**

>     curl -X POST http://localhost:5000/api/users/createUser\
>       -H "Content-Type: application/json"\
>       -d '{
>             "mobile": "9012345678",
>             "username": "SavingsBank",
>             "password": "password123"
>           }'

2.  **Login User:**

>     curl -X POST http://localhost:5000/api/users/loginUser\
>       -H "Content-Type: application/json"\
>       -d '{
>             "mobile": "9012345678",
>             "password": "password123"
>           }'

3.  **Get User Details:**

>     curl -X GET http://localhost:5000/api/users/doGetUser/9012345678

4.  **Admin: Get All Users:**

>     curl -u admin:password -X GET http://localhost:5000/api/users/admin/getAllUsers
