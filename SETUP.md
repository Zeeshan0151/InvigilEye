# InvigilEye - Setup Instructions

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Project Structure

The application consists of three main parts:

- **Electron Main Process** (`/main`) - Desktop application wrapper
- **React Frontend** (`/renderer`) - User interface
- **Express Backend** (`/backend`) - API server with SQLite database

### 3. Running the Application

#### Development Mode (Recommended for first run)

Start all services together:

```bash
npm run dev
```

This will:
- Start the backend server on `http://localhost:5000`
- Start the React dev server on `http://localhost:3000`
- Launch the Electron application

#### Alternative: Start services separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - React Frontend:**
```bash
npm run react:dev
```

**Terminal 3 - Electron:**
```bash
npm run electron:dev
```

#### Production Mode

```bash
npm start
```

This starts the backend and Electron in production mode.

### 4. Build for Distribution

```bash
npm run build
```

This will create distributable files in the `dist` folder.

## Database Setup

The SQLite database is automatically created and initialized when you first run the backend server. The database file will be located at:

```
/db/invigleye.db
```

## Default Login Credentials

### Admin Account
- **Username:** admin
- **Password:** admin123
- **Access:** Full system access, exam management, reports

### Invigilator Account
- **Username:** invigilator
- **Password:** invig123
- **Access:** Exam monitoring, attendance, alerts

### Additional Invigilator
- **Username:** invigilator2
- **Password:** invig123

## Sample Data

A sample CSV file (`sample-students.csv`) is provided in the root directory. You can use this to test the student import feature when creating exams.

### CSV Format

```csv
roll_number,name,email
2021001,John Doe,john.doe@example.com
2021002,Jane Smith,jane.smith@example.com
```

## Features Overview

### Admin Dashboard

1. **Dashboard** - Overview of all exams, requests, and alerts
2. **Create Exam** - Create new exams and upload student lists
3. **Manage Exams** - View, edit, and delete exams
4. **Requests** - Manage UMC, IT, and Material requests
5. **Reports** - View exam reports and export data

### Invigilator Dashboard

1. **Dashboard** - View assigned exams, start/end exams
2. **Monitoring** - Live camera feeds and alert management
3. **Attendance** - Mark student attendance and export data
4. **Snapshots** - Capture and manage exam snapshots
5. **Alerts** - View and acknowledge system alerts

## Troubleshooting

### Port Already in Use

If you get an error about ports being in use:

- Backend uses port **5000**
- Frontend uses port **3000**

Kill any processes using these ports or modify them in:
- `backend/server.js` (line 5 for backend)
- `vite.config.js` (line 13 for frontend)

### Database Not Initialized

If the database isn't created:

```bash
rm -rf db/invigleye.db
npm run backend
```

### Electron Not Opening

Make sure React dev server is running first, then start Electron.

### Module Not Found Errors

```bash
rm -rf node_modules package-lock.json
npm install
```

## Tech Stack

- **Electron** v28.0.0 - Desktop application framework
- **React** v18.2.0 - Frontend UI library
- **Vite** v5.0.8 - Build tool and dev server
- **Express** v4.18.2 - Backend API server
- **SQLite3** v5.1.6 - Local database
- **TailwindCSS** v3.4.0 - Styling
- **Lucide React** - Icons

## Project Structure

```
/
├── main/                   # Electron main process
│   ├── main.js            # Main entry point
│   └── preload.js         # Preload scripts
├── renderer/              # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities and API
│   │   └── main.jsx       # React entry point
│   └── index.html
├── backend/               # Express backend
│   ├── database/          # Database setup
│   ├── routes/            # API routes
│   └── server.js          # Server entry point
├── db/                    # SQLite database location
└── package.json           # Dependencies and scripts
```

## Notes

- This is a **UI-focused** implementation with **mock camera feeds**
- No actual AI/ML models are integrated (as per requirements)
- All monitoring features use placeholder data
- Perfect for demonstration and further development

## Support

For issues or questions, please refer to the README.md or check the code comments.

---

**Built with ❤️ for exam invigilation**

