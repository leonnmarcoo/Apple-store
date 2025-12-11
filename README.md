# Apple Store Website

A modern Apple Store website clone with full authentication system using Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- **User Authentication**: Complete login/signup system with secure password hashing
- **MongoDB Integration**: User data stored securely in MongoDB
- **Session Management**: Persistent login sessions with Express Session
- **Error Handling**: Comprehensive client and server-side error handling
- **Responsive Design**: Clean, Apple-inspired UI that works on all devices
- **Security**: Password hashing with bcryptjs, input validation, and session protection

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd apple-store-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy the `.env` file and update the MongoDB URI
   - For local MongoDB: `mongodb://localhost:27017/apple-store`
   - For MongoDB Atlas: Use your connection string from Atlas

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the application**
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

6. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - You'll be redirected to the login page if not authenticated

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/auth-check` - Check authentication status

### Pages
- `GET /` - Home page (redirects to login if not authenticated)
- `GET /login` - Login page
- `GET /signup` - Sign up page

## File Structure

```
├── server.js              # Express server and API routes
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── login.html            # Login page
├── sign-up.html          # Sign up page
├── index.html            # Main store page
├── script.js             # Frontend JavaScript
├── style.css             # Main styles
└── assets/               # Images and other assets
```

## Database Schema

### User Model
```javascript
{
  username: String (required, unique, 3-20 chars),
  password: String (required, hashed, min 6 chars),
  createdAt: Date (default: now)
}
```

## Security Features

- **Password Hashing**: Uses bcryptjs with 12 salt rounds
- **Session Security**: Secure session configuration with httpOnly cookies
- **Input Validation**: Both client and server-side validation
- **Error Handling**: Proper error messages without exposing sensitive data
- **Authentication Middleware**: Protected routes require valid sessions

## Usage

1. **Sign Up**: Create a new account with username and password
2. **Login**: Use your credentials to access the store
3. **Browse**: Explore the Apple store products (authenticated users only)
4. **Logout**: Securely end your session

## Development

### Adding New Protected Routes
```javascript
app.get('/new-protected-route', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'your-file.html'));
});
```

### Frontend Authentication Check
```javascript
// Check if user is authenticated
const authStatus = await window.appleStoreAuth.checkAuthStatus();
if (!authStatus.authenticated) {
  // Redirect to login
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify network access for MongoDB Atlas

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill the process using the port: `netstat -ano | findstr :3000`

3. **Session Issues**
   - Clear browser cookies
   - Restart the server
   - Check SESSION_SECRET in `.env`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the GitHub repository.