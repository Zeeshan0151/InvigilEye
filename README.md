# InvigilEye - Exam Invigilation System

<div align="center">
  
  ![InvigilEye Logo](https://img.shields.io/badge/InvigilEye-v1.0.0-blue)
  ![License](https://img.shields.io/badge/license-MIT-green)
  ![Electron](https://img.shields.io/badge/Electron-28.0.0-47848f)
  ![React](https://img.shields.io/badge/React-18.2.0-61dafb)
  
  A comprehensive desktop application for physical exam invigilation and monitoring.
  
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Database](#database)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**InvigilEye** is a desktop application designed to streamline the examination invigilation process. It provides separate dashboards for administrators and invigilators, enabling efficient exam management, real-time attendance tracking, and incident reporting.

The application is built using Electron for cross-platform desktop support, React for the frontend, Express.js for the backend API, and SQLite for local database management.

---

## ✨ Features

### Admin Dashboard
- **Exam Management**: Create, view, edit, and delete exam sessions
- **Student Management**: Upload student lists via CSV files with photo support
- **Invigilator Assignment**: Assign invigilators to exam rooms and sections
- **Request Monitoring**: Review UMC (Unfair Means Cases) and material requests
- **Reports**: Download attendance and activity logs for exams
- **Real-time Overview**: View ongoing exams and their status

### Invigilator Dashboard
- **Exam Selection**: View and select ongoing exams
- **Attendance Marking**: Mark student attendance in real-time (Present/Absent)
- **Live Monitoring**: Monitor student feed with alert highlights
- **Snapshot Gallery**: View and download captured evidence
- **UMC Reporting**: Report unfair means cases with descriptions
- **Material Requests**: Request extra sheets or question papers instantly

### General Features
- **Dual Authentication**: Separate login for Admin and Invigilator roles
- **Session Management**: Persistent exam session across dashboard navigation
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Updates**: Live exam status and time-based filtering
- **Toast Notifications**: User-friendly feedback for all actions
- **Local Database**: SQLite for fast, offline-capable data storage

---

## 🛠 Tech Stack

### Frontend
- **Electron** - Cross-platform desktop application framework
- **React 18** - UI library for building user interfaces
- **React Router Dom** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Express.js** - Web application framework
- **Better-SQLite3** - Synchronous SQLite database
- **Multer** - File upload handling
- **CSV Parser** - CSV file processing
- **Papa Parse** - CSV parsing library
- **CORS** - Cross-origin resource sharing

### AI/Python
- **Flask** - Python web server
- **YOLOv8 (Ultralytics)** - Pose detection model
- **OpenCV** - Computer vision library
- **NumPy** - Numerical computing
- **PyTorch** - Deep learning framework

### Development Tools
- **Concurrently** - Run multiple commands simultaneously
- **Wait-on** - Wait for resources before starting
- **Electron Builder** - Package and build Electron apps

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v7 or higher)
- **Python 3.11**
- **Git**

### System Requirements
- **OS**: Windows 10+, macOS 10.13+, or Linux
- **RAM**: 8GB minimum (16GB recommended for AI features)
- **Storage**: 2GB free space
- **Camera**: Webcam required for monitoring features

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Zeeshan0151/InvigilEye.git
cd InvigilEye
```

### 2. Install Node.js Dependencies

```bash
npm install
```

This will install all required dependencies for the frontend, backend, and Electron.

### 3. Setup Python Environment

The application uses Python for AI-powered pose detection. Set up the Python environment:

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

**Note**: If `pip install -r requirements.txt` fails with Python version error, install packages individually:
```bash
pip install face_recognition dlib opencv-python numpy pandas psycopg2-binary ultralytics
```

### 4. Database Setup

The database will be automatically created and migrated when you run `npm start`. No manual setup needed!

---

## ⚙️ Configuration

### Default Ports

The application runs with the following default ports:

- **Frontend (React/Vite)**: `http://localhost:3000`
- **Backend (Express)**: `http://localhost:5001`
- **Python AI Server**: `http://localhost:5002`
- **Electron**: Launches automatically

### Database Location

The SQLite database is automatically created at:
- **Development**: `~/Library/Application Support/InvigilEye/invigleye.db` (macOS)
- **Development**: `%APPDATA%\InvigilEye\invigleye.db` (Windows)

The database schema includes:
- **users** - Admin and invigilator accounts
- **exams** - Exam sessions with details
- **attendance** - Student attendance records
- **requests** - UMC and material requests
- **alerts** - AI pose detection alerts

---

## 🏃‍♂️ Running the Application

### Start Everything with One Command

```bash
npm start
```

This single command will:
1. ✅ Rebuild better-sqlite3 (ensures DB compatibility)
2. ✅ Run database migrations (updates schema if needed)
3. ✅ Start React frontend (Vite dev server on port 3000)
4. ✅ Start Express backend (API server on port 5001)
5. ✅ Start Python AI server (Pose detection on port 5002)
6. ✅ Launch Electron desktop app

**That's it!** The application will open automatically once all servers are ready.

### Troubleshooting Startup

If you encounter database errors on startup, the `npm start` command automatically handles:
- Rebuilding native modules (better-sqlite3)
- Running database migrations
- Ensuring schema compatibility

### Stopping the Application

To stop all services:
- Close the Electron window, or
- Press `Ctrl+C` in the terminal

---

## 📁 Project Structure

```
invigleye/
├── backend/                 # Backend API server
│   ├── database/           # Database configuration
│   │   ├── db.js          # SQLite connection
│   │   ├── migrate.js     # Database migrations
│   │   └── seed.sql       # Sample data
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication endpoints
│   │   ├── exams.js       # Exam management
│   │   ├── attendance.js  # Attendance tracking
│   │   ├── requests.js    # Request handling
│   │   ├── reports.js     # Report generation
│   │   └── alerts.js      # Alert management
│   ├── uploads/           # File upload storage
│   ├── utils/             # Utility functions
│   └── server.js          # Express server entry
│
├── renderer/              # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── common/   # Shared UI components
│   │   │   ├── layout/   # Layout components
│   │   │   └── ui/       # Base UI components
│   │   ├── contexts/     # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── lib/          # Utilities and API client
│   │   ├── pages/        # Page components
│   │   │   ├── admin/   # Admin dashboard pages
│   │   │   └── invigilator/ # Invigilator pages
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # React entry point
│   │   └── index.css     # Global styles
│   └── index.html        # HTML template
│
├── main/                  # Electron main process
│   ├── main.js           # Electron entry point
│   └── preload.js        # Preload script
│
├── db/                    # SQLite database files
│   └── invigleye.db      # Main database
│
├── media/                 # Media assets
│   └── students/         # Student photos
│
├── package.json          # Project dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS config
└── README.md             # This file
```

---

## 👥 User Roles

### Admin User

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

**Capabilities:**
- Create and manage exams
- Upload student lists
- Assign invigilators
- View all requests
- Download reports
- Manage system settings

### Invigilator User

**Default Credentials:**
- Username: `invigilator`
- Password: `inv123`

**Capabilities:**
- Select ongoing exams
- Mark attendance
- Monitor student feed
- Submit UMC reports
- Request materials
- View snapshots

---

## 💾 Database

### Schema Overview

#### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'invigilator')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Exams Table
```sql
CREATE TABLE exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  exam_time TEXT NOT NULL,
  end_time TEXT,
  venue TEXT NOT NULL,
  department TEXT,
  section TEXT,
  invigilator_email TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Attendance Table
```sql
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL,
  roll_number TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'absent',
  marked_at DATETIME,
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);
```

### Database Management

**Backup Database:**
```bash
cp db/invigleye.db db/invigleye_backup.db
```

**Run Migrations:**
```bash
npm run migrate:db
```

**Reset Database:**
Delete `db/invigleye.db` and restart the application.

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

If you see "Port 3000/5001 already in use":

```bash
# Kill processes on ports
lsof -ti:3000,5001 | xargs kill -9

# Or restart your terminal
```

#### Database Locked Error

```bash
# Close all app instances and delete lock file
rm db/invigleye.db-wal db/invigleye.db-shm
```

#### Electron Window Not Opening

```bash
# Clear Electron cache
rm -rf ~/Library/Application\ Support/invigleye  # macOS
rm -rf ~/.config/invigleye                        # Linux
```

#### CSV Upload Fails

- Ensure CSV has headers: `roll_number`, `name`
- Check file encoding is UTF-8
- Maximum file size: 10MB

#### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style

- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues, questions, or suggestions:

- **Issues**: [GitHub Issues](https://github.com/yourusername/invigleye/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/invigleye/discussions)
- **Email**: support@invigleye.com

---

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

<div align="center">
  
  **Made with ❤️ for better exam management**
  
  ⭐ Star this repo if you find it helpful!
  
</div>

