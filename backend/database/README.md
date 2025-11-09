# Database Documentation

## Database: SQLite (better-sqlite3)

The InvigilEye application uses **SQLite** as its database - a lightweight, file-based database perfect for Electron desktop applications.

### Database Location
- **File**: `db/invigleye.db`
- **Type**: SQLite 3
- **Library**: better-sqlite3

---

## Database Schema

### 1. **users** Table
Stores admin and invigilator accounts.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto-increment ID |
| username | TEXT UNIQUE NOT NULL | Login username |
| password | TEXT NOT NULL | Password (plain text for demo) |
| role | TEXT NOT NULL | 'admin' or 'invigilator' |
| full_name | TEXT | Full name of user |
| email | TEXT | Email address |
| created_at | DATETIME | Account creation timestamp |

**Default Users:**
- Admin: `admin` / `admin123`
- Invigilator: `invigilator` / `invig123`

---

### 2. **exams** Table
Stores exam information and scheduling.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto-increment ID |
| title | TEXT NOT NULL | Course title (e.g., "Data Structures - BSSE2311") |
| department | TEXT | Department (IT, Business, Medical, Law) |
| venue | TEXT NOT NULL | Room number (e.g., "Room 1") |
| exam_date | TEXT NOT NULL | Exam date (YYYY-MM-DD) |
| exam_time | TEXT NOT NULL | Start time (HH:MM) |
| end_time | TEXT | End time (HH:MM) |
| section | TEXT | Section (A, B, C, D, E) |
| invigilator_name | TEXT | Name of assigned invigilator |
| invigilator_id | INTEGER | Foreign key to users table |
| status | TEXT | 'scheduled', 'in_progress', 'completed' |
| created_at | DATETIME | Record creation timestamp |

**Foreign Keys:**
- `invigilator_id` → `users(id)`

---

### 3. **students** Table
Stores student information per exam (imported via CSV).

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto-increment ID |
| exam_id | INTEGER | Foreign key to exams table |
| roll_number | TEXT NOT NULL | Student roll/ID number |
| name | TEXT NOT NULL | Student full name |
| email | TEXT | Student email address |

**Foreign Keys:**
- `exam_id` → `exams(id)` (CASCADE DELETE)

**CSV Import Format:**
```csv
roll_number,name,email
2021001,John Doe,john@example.com
2021002,Jane Smith,jane@example.com
```

---

### 4. **attendance** Table
Tracks student attendance per exam.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto-increment ID |
| exam_id | INTEGER | Foreign key to exams table |
| student_id | INTEGER | Foreign key to students table |
| status | TEXT | 'present', 'absent', 'late' |
| marked_at | DATETIME | Timestamp when marked |

**Foreign Keys:**
- `exam_id` → `exams(id)` (CASCADE DELETE)
- `student_id` → `students(id)` (CASCADE DELETE)

---

### 5. **requests** Table
Stores invigilator requests (UMC, IT, Material).

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto-increment ID |
| exam_id | INTEGER | Foreign key to exams table |
| type | TEXT NOT NULL | 'umc', 'it', 'material', etc. |
| description | TEXT | Request details |
| invigilator_name | TEXT | Name of requesting invigilator |
| room | TEXT | Room where request originated |
| status | TEXT | 'pending', 'approved', 'resolved' |
| created_at | DATETIME | Request creation timestamp |
| resolved_at | DATETIME | Resolution timestamp |

**Foreign Keys:**
- `exam_id` → `exams(id)` (CASCADE DELETE)

---

### 6. **alerts** Table
Stores UMC (Unfair Means Cases) alerts with evidence.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto-increment ID |
| exam_id | INTEGER | Foreign key to exams table |
| student_id | TEXT | Student roll number |
| exam_title | TEXT | Title of the exam |
| type | TEXT NOT NULL | 'cheating', 'suspicious_behavior', etc. |
| description | TEXT | Alert details |
| severity | TEXT | 'low', 'medium', 'high' |
| snapshot_url | TEXT | Path to evidence image |
| created_at | DATETIME | Alert creation timestamp |
| acknowledged | BOOLEAN | Whether admin has seen it |

**Foreign Keys:**
- `exam_id` → `exams(id)` (CASCADE DELETE)

---

### 7. **snapshots** Table
Stores captured exam snapshots/photos.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto-increment ID |
| exam_id | INTEGER | Foreign key to exams table |
| file_path | TEXT NOT NULL | Path to snapshot file |
| description | TEXT | Optional description |
| created_at | DATETIME | Capture timestamp |

**Foreign Keys:**
- `exam_id` → `exams(id)` (CASCADE DELETE)

---

## Database Operations

### Initialization
The database is automatically initialized when the server starts:

```javascript
const { db, init } = require('./database/db');
init(); // Creates tables and default users
```

### Migration
To update existing database with new schema changes:

```bash
npm run migrate:db
```

This will:
1. Backup your existing database
2. Add any missing columns
3. Preserve all existing data

### Reset Database
To start fresh (⚠️ deletes all data):

```bash
# Stop the server first
rm db/invigleye.db

# Restart server - database will be recreated
npm run backend
```

---

## CRUD API Endpoints

### Exams API (`/api/exams`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exams` | Get all exams |
| GET | `/api/exams/:id` | Get single exam by ID |
| GET | `/api/exams/invigilator/:id` | Get exams by invigilator |
| GET | `/api/exams/:id/students` | Get students for an exam |
| POST | `/api/exams` | Create new exam (with CSV upload) |
| PUT | `/api/exams/:id` | Update exam |
| DELETE | `/api/exams/:id` | Delete exam |
| POST | `/api/exams/:id/start` | Start exam (set status to in_progress) |
| POST | `/api/exams/:id/end` | End exam (set status to completed) |

**Create Exam Example:**
```javascript
const formData = new FormData();
formData.append('title', 'Data Structures - BSSE2311');
formData.append('department', 'IT');
formData.append('venue', 'Room 3');
formData.append('exam_date', '2025-11-15');
formData.append('exam_time', '09:00');
formData.append('end_time', '11:00');
formData.append('section', 'A');
formData.append('invigilator_name', 'Dr. John Smith');
formData.append('studentCsv', fileObject); // CSV file

fetch('http://localhost:5001/api/exams', {
  method: 'POST',
  body: formData
});
```

---

## Best Practices

### 1. **Always Use Transactions** for Multiple Operations
```javascript
const insertMany = db.transaction((items) => {
  for (const item of items) stmt.run(item);
});
```

### 2. **Use Prepared Statements** to Prevent SQL Injection
```javascript
const stmt = db.prepare('SELECT * FROM exams WHERE id = ?');
const exam = stmt.get(examId);
```

### 3. **Cascade Deletes** are Enabled
When you delete an exam, all related records (students, attendance, requests, alerts, snapshots) are automatically deleted.

### 4. **Backup Before Major Changes**
```bash
cp db/invigleye.db db/invigleye_backup.db
```

---

## Troubleshooting

### Database Locked Error
- SQLite only allows one write at a time
- Ensure you're not running multiple instances of the server

### Missing Columns Error
- Run the migration script: `npm run migrate:db`
- Or delete and recreate the database

### CSV Import Fails
- Check CSV format: `roll_number,name,email`
- Ensure no special characters
- Maximum file size: 5MB

---

## Performance Notes

- **Fast Reads**: SQLite is optimized for read operations
- **Single Writer**: Only one write operation at a time
- **Perfect for Desktop Apps**: No network latency, works offline
- **File Size**: Typical database size < 50MB even with thousands of records

---

## Future Enhancements

Potential upgrades for larger deployments:
- Switch to PostgreSQL for multi-user concurrent access
- Add database replication for backup
- Implement connection pooling for web deployment
- Add full-text search with FTS5 extension

---

**Last Updated:** October 2025

