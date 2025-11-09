# Upload Directory

Temporary storage for uploaded CSV files.
Files are automatically deleted after processing.

## CSV Format

### Required Columns:
- `roll_number` - Student's roll/registration number
- `name` - Student's full name
- `image_path` - Path to student's image (optional)

### Example CSV:
```csv
roll_number,name,image_path
l1s22bsse0149,Zeeshan Ali,media/students/l1s22bsse0149.jpeg
l1s22bsse0150,Bano Besite,media/students/l1s22bsse0150.jpeg
l1f21bsse0238,Uzair Ali,media/students/l1f21bsse0238.jpeg
```

### Notes:
- Email field has been removed (no longer needed)
- Image path is optional but recommended for attendance tracking
- Whitespace in values is automatically trimmed
- Empty lines are skipped
- Column names are case-insensitive and support variations:
  - roll_number / rollNumber / Roll Number
  - name / Name
  - image_path / image_url / imageUrl / Image Path
