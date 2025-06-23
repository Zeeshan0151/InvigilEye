public class Student {
    private String name;
    private String studentId;
    private double subject1;
    private double subject2;
    private double subject3;
    private double average;
    private char grade;
    
    // Constructor
    public Student(String name, String studentId, double subject1, double subject2, double subject3) {
        this.name = name;
        this.studentId = studentId;
        this.subject1 = subject1;
        this.subject2 = subject2;
        this.subject3 = subject3;
        calculateAverageAndGrade();
    }
    
    // Calculate average and assign grade
    private void calculateAverageAndGrade() {
        this.average = (subject1 + subject2 + subject3) / 3.0;
        assignGrade();
    }
    
    // Assign grade based on average
    private void assignGrade() {
        if (average >= 90) {
            grade = 'A';
        } else if (average >= 80) {
            grade = 'B';
        } else if (average >= 70) {
            grade = 'C';
        } else if (average >= 60) {
            grade = 'D';
        } else {
            grade = 'F';
        }
    }
    
    // Getters
    public String getName() {
        return name;
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    public double getSubject1() {
        return subject1;
    }
    
    public double getSubject2() {
        return subject2;
    }
    
    public double getSubject3() {
        return subject3;
    }
    
    public double getAverage() {
        return average;
    }
    
    public char getGrade() {
        return grade;
    }
    
    // Setters with recalculation
    public void setName(String name) {
        this.name = name;
    }
    
    public void setSubject1(double subject1) {
        this.subject1 = subject1;
        calculateAverageAndGrade();
    }
    
    public void setSubject2(double subject2) {
        this.subject2 = subject2;
        calculateAverageAndGrade();
    }
    
    public void setSubject3(double subject3) {
        this.subject3 = subject3;
        calculateAverageAndGrade();
    }
    
    public void updateMarks(double subject1, double subject2, double subject3) {
        this.subject1 = subject1;
        this.subject2 = subject2;
        this.subject3 = subject3;
        calculateAverageAndGrade();
    }
    
    @Override
    public String toString() {
        return String.format("ID: %s | Name: %s | Subject1: %.2f | Subject2: %.2f | Subject3: %.2f | Average: %.2f | Grade: %c",
                studentId, name, subject1, subject2, subject3, average, grade);
    }
} 