# User Registration

A simple user registration system built using MongoDB, Express, and Node.js

## Features

- Client-side form validation
- Server-side data validation
- Unique ID enforcement
- Real-time error feedback
- Responsive design using Bootstrap

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4.x or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd test1
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start MongoDB:
   ```
   mongod --dbpath <your-db-path>
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
test1/
├── models/           # MongoDB schemas
│   └── User.js       # User model with validation
├── public/           # Static assets
│   ├── index.html    # Main HTML file
│   └── js/           # Client-side JavaScript
│       └── script.js # Form handling and validation
├── routes/           # API routes
│   └── api.js        # User API endpoints
├── server.js         # Express server setup
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

## API Endpoints

- `POST /api/users` - Create a new user
- `GET /api/users` - Retrieve all users (for debugging)
- `DELETE /api/reset-db` - Reset the database (for testing)

## Form Validation

### Client-side Validation

- **Name & Surname**: Cannot be empty or contain special characters
- **ID Number**: Must be exactly 13 digits
- **Date of Birth**: Must be in dd/mm/yyyy format and a valid date

### Server-side Validation

- Validates all fields again for security
- Checks for duplicate IDs in the database
- Ensures data consistency

## Database Schema

```javascript
{
  name: String,         // Required, trimmed
  surname: String,      // Required, trimmed
  id: String,           // Required, unique, 13 digits
  dateOfBirth: String,  // Required, validated format
  createdAt: Date,      // Automatically added
  updatedAt: Date       // Automatically updated
}
```

## Troubleshooting

If you encounter any issues with duplicate IDs or validation not working properly:

1. Check the server logs for detailed error messages
2. Use the `/api/users` endpoint to view current database entries
3. Use the `/api/reset-db` endpoint to clear the database and start fresh
4. Ensure MongoDB is running and accessible
5. Verify that all form fields are correctly formatted

## Development Notes

- The system uses RESTful API principles
- MongoDB's unique index is used to prevent duplicate IDs
- The server provides detailed error messages for debugging
- Bootstrap is used for responsive design

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
