# Full-Stack Authentication Dashboard - UltraEdit Style

A modern, full-stack authentication system with a sleek UltraEdit-inspired design. Features a React + Vite + Tailwind CSS frontend and an Express + MongoDB backend with JWT-based authentication.

## 🎯 Features

- **Secure Authentication**: JWT-based authentication with access and refresh tokens
- **Modern UI**: UltraEdit-inspired design with dark/light theme support
- **User Management**: Complete profile management and user dashboard
- **Responsive Design**: Mobile-first, fully responsive layout
- **Protected Routes**: Client-side route protection with authentication guards
- **Form Validation**: Comprehensive client and server-side validation
- **RESTful API**: Clean, well-structured backend API
- **Security Best Practices**: Password hashing, HTTP-only cookies, CORS configuration

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **Vite 5.1.4** - Build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **React Router DOM 6.22.0** - Client-side routing
- **Axios 1.6.7** - HTTP client
- **Lucide React 0.344.0** - Icon library

### Backend
- **Express 4.18.2** - Web framework
- **MongoDB with Mongoose 8.1.1** - Database and ODM
- **JSON Web Token 9.0.2** - Authentication
- **bcryptjs 2.4.3** - Password hashing
- **express-validator 7.0.1** - Request validation
- **CORS 2.8.5** - Cross-origin resource sharing
- **cookie-parser 1.4.6** - Cookie parsing

## 📁 Project Structure

```
Recruitment/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page-level components
│   │   ├── context/            # React Context providers
│   │   ├── utils/              # Utility functions and helpers
│   │   ├── App.jsx             # Root component
│   │   ├── main.jsx            # Application entry point
│   │   └── index.css           # Global styles with Tailwind directives
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── .eslintrc.cjs           # ESLint configuration
│   ├── package.json            # Frontend dependencies
│   ├── .env.example            # Environment variables template
│   └── .env                    # Environment variables (gitignored)
├── server/                      # Backend Express application
│   ├── models/                 # Mongoose models
│   ├── routes/                 # Express route handlers
│   ├── middleware/             # Express middleware
│   ├── config/                 # Configuration files
│   ├── utils/                  # Utility functions
│   ├── server.js               # Server entry point
│   ├── package.json            # Backend dependencies
│   ├── .env.example            # Environment variables template
│   └── .env                    # Environment variables (gitignored)
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

## 📋 Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher (or yarn/pnpm)
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Recruitment
```

### 2. Install client dependencies
```bash
cd client
npm install
```

### 3. Install server dependencies
```bash
cd ../server
npm install
```

### 4. Configure environment variables

#### Client (.env)
Copy `client/.env.example` to `client/.env` and configure:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Auth Dashboard
```

#### Server (.env)
Copy `server/.env.example` to `server/.env` and configure:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth-dashboard
JWT_ACCESS_SECRET=<generate-strong-secret-min-32-chars>
JWT_REFRESH_SECRET=<generate-strong-secret-min-32-chars>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Security Note**: Generate strong secrets using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Start MongoDB
If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas cloud database.

### 6. Run the application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## 📊 Environment Variables

### Client Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application display name | `Auth Dashboard` |

### Server Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/auth-dashboard` |
| `JWT_ACCESS_SECRET` | Secret key for access tokens (min 32 chars) | - |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens (min 32 chars) | - |
| `JWT_ACCESS_EXPIRY` | Access token expiration time | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiration time | `7d` |
| `NODE_ENV` | Environment mode | `development` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 🔌 API Endpoints

API documentation will be populated in subsequent phases. Current endpoints:

- `GET /api/health` - Server health check

## 💻 Development Notes

### Frontend Development
- Run `npm run dev` to start Vite dev server with hot reload
- Run `npm run build` to create production build
- Run `npm run preview` to preview production build
- Run `npm run lint` to check code quality

### Backend Development
- Run `npm run dev` to start server with nodemon (auto-restart)
- Run `npm start` to start server in production mode

### Code Quality
- ESLint configured for React best practices
- Tailwind CSS with custom UltraEdit-inspired theme
- TypeScript-ready configuration (can be added later)

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Happy Coding! 🚀**
