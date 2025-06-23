# Student Grade Management System

A comprehensive Java GUI application for managing student grades using Object-Oriented Programming principles.

## 🌟 Features

### Core Functionality
- **Add Student Records**: Input student name, ID, and marks for three subjects
- **Update Student Marks**: Modify existing student marks with automatic grade recalculation
- **Delete Student Records**: Remove students with confirmation dialog
- **View All Students**: Display all students in an organized table format
- **Real-time Statistics**: Class average and grade distribution

### Advanced Features
- **Input Validation**: Ensures valid names, unique IDs, and marks within 0-100 range
- **Automatic Grade Calculation**: Assigns grades (A-F) based on average marks
- **Grade Distribution**: Visual breakdown of grade counts
- **Error Handling**: User-friendly error messages and validation
- **Professional GUI**: Modern Swing interface with organized layout

## 🏗️ Architecture

### Object-Oriented Design
The application follows OOP principles with three main classes:

#### 1. `Student.java`
- **Encapsulation**: Private fields with public getters/setters
- **Data Validation**: Automatic average and grade calculation
- **Grade Scale**: A (90+), B (80-89), C (70-79), D (60-69), F (<60)

#### 2. `GradeManager.java`
- **Data Management**: ArrayList-based student storage
- **CRUD Operations**: Create, Read, Update, Delete students
- **Validation Methods**: Input validation and duplicate prevention
- **Statistics**: Class average and grade distribution calculations

#### 3. `StudentGradeGUI.java`
- **User Interface**: Complete Swing GUI implementation
- **Event Handling**: Button clicks and table selection
- **Real-time Updates**: Dynamic table and statistics refresh
- **User Experience**: Clear navigation and feedback

## 🚀 Getting Started

### Prerequisites
- Java Development Kit (JDK) 8 or higher
- Java Swing (included in JDK)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/UzairJarral/student-grade-management.git
   cd student-grade-management
   ```

2. Compile the Java files:
   ```bash
   javac *.java
   ```

3. Run the application:
   ```bash
   java StudentGradeGUI
   ```

## 📊 Usage

### Adding Students
1. Enter student name and unique ID
2. Input marks for three subjects (0-100)
3. Click "Add Student" button
4. Grade is automatically calculated and assigned

### Updating Students
1. Select a student from the table
2. Modify the marks in input fields
3. Click "Update Student" button
4. Average and grade are recalculated

### Deleting Students
1. Select a student from the table
2. Click "Delete Student" button
3. Confirm deletion in the dialog

### Viewing Statistics
- **Total Students**: Count of all students
- **Class Average**: Overall class performance
- **Grade Distribution**: Breakdown by grade (A, B, C, D, F)

## 🎯 Grade Scale

| Grade | Percentage Range |
|-------|------------------|
| A     | 90 - 100         |
| B     | 80 - 89          |
| C     | 70 - 79          |
| D     | 60 - 69          |
| F     | 0 - 59           |

## 🔧 Technical Details

### Design Patterns
- **MVC Pattern**: Separation of model (Student), view (GUI), and controller (GradeManager)
- **Observer Pattern**: Real-time updates between components
- **Singleton Pattern**: Centralized grade management

### Validation Rules
- **Names**: Non-empty, trimmed strings
- **Student IDs**: Unique, non-empty identifiers
- **Marks**: Numeric values between 0 and 100
- **Duplicate Prevention**: No duplicate student IDs allowed

## 📱 Screenshots

### Main Interface
- Clean, organized layout with input fields
- Comprehensive data table
- Real-time statistics panel
- Intuitive button controls

### Features Showcase
- Input validation with error messages
- Confirmation dialogs for deletions
- Automatic grade calculations
- Professional appearance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Java Swing documentation and tutorials
- Object-Oriented Programming best practices
- GUI design principles

## 📚 Learning Outcomes

This project demonstrates:
- **Java OOP Concepts**: Encapsulation, inheritance, polymorphism
- **GUI Development**: Swing components and event handling
- **Data Structures**: ArrayList usage and management
- **Input Validation**: User input sanitization and error handling
- **Software Design**: Clean architecture and separation of concerns

---

*Built with ❤️ using Java and Swing* 