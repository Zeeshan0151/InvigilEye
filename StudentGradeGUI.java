import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.List;
import java.util.Map;

public class StudentGradeGUI extends JFrame {
    private GradeManager gradeManager;
    private JTable studentTable;
    private DefaultTableModel tableModel;
    private JTextField nameField, idField, subject1Field, subject2Field, subject3Field;
    private JLabel statsLabel;
    
    public StudentGradeGUI() {
        gradeManager = new GradeManager();
        initializeGUI();
        updateTable();
        updateStats();
    }
    
    private void initializeGUI() {
        setTitle("Student Grade Management System");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        
        // Create main panels
        JPanel inputPanel = createInputPanel();
        JPanel tablePanel = createTablePanel();
        JPanel buttonPanel = createButtonPanel();
        JPanel statsPanel = createStatsPanel();
        
        // Add panels to frame
        add(inputPanel, BorderLayout.NORTH);
        add(tablePanel, BorderLayout.CENTER);
        add(buttonPanel, BorderLayout.SOUTH);
        add(statsPanel, BorderLayout.EAST);
        
        // Set frame properties
        setSize(1000, 600);
        setLocationRelativeTo(null);
        setResizable(true);
    }
    
    private JPanel createInputPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Student Information"));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        
        // Name field
        gbc.gridx = 0; gbc.gridy = 0;
        panel.add(new JLabel("Name:"), gbc);
        gbc.gridx = 1;
        nameField = new JTextField(15);
        panel.add(nameField, gbc);
        
        // ID field
        gbc.gridx = 2; gbc.gridy = 0;
        panel.add(new JLabel("Student ID:"), gbc);
        gbc.gridx = 3;
        idField = new JTextField(10);
        panel.add(idField, gbc);
        
        // Subject fields
        gbc.gridx = 0; gbc.gridy = 1;
        panel.add(new JLabel("Subject 1:"), gbc);
        gbc.gridx = 1;
        subject1Field = new JTextField(8);
        panel.add(subject1Field, gbc);
        
        gbc.gridx = 2;
        panel.add(new JLabel("Subject 2:"), gbc);
        gbc.gridx = 3;
        subject2Field = new JTextField(8);
        panel.add(subject2Field, gbc);
        
        gbc.gridx = 4;
        panel.add(new JLabel("Subject 3:"), gbc);
        gbc.gridx = 5;
        subject3Field = new JTextField(8);
        panel.add(subject3Field, gbc);
        
        return panel;
    }
    
    private JPanel createTablePanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Student Records"));
        
        // Create table model
        String[] columnNames = {"Student ID", "Name", "Subject 1", "Subject 2", "Subject 3", "Average", "Grade"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // Make table read-only
            }
        };
        
        studentTable = new JTable(tableModel);
        studentTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        studentTable.getTableHeader().setReorderingAllowed(false);
        
        // Add selection listener
        studentTable.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                populateFieldsFromSelection();
            }
        });
        
        JScrollPane scrollPane = new JScrollPane(studentTable);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }
    
    private JPanel createButtonPanel() {
        JPanel panel = new JPanel(new FlowLayout());
        
        JButton addButton = new JButton("Add Student");
        JButton updateButton = new JButton("Update Student");
        JButton deleteButton = new JButton("Delete Student");
        JButton clearButton = new JButton("Clear Fields");
        JButton exitButton = new JButton("Exit");
        
        // Add action listeners
        addButton.addActionListener(e -> addStudent());
        updateButton.addActionListener(e -> updateStudent());
        deleteButton.addActionListener(e -> deleteStudent());
        clearButton.addActionListener(e -> clearFields());
        exitButton.addActionListener(e -> {
            int option = JOptionPane.showConfirmDialog(this, 
                "Are you sure you want to exit?", "Exit Confirmation", 
                JOptionPane.YES_NO_OPTION);
            if (option == JOptionPane.YES_OPTION) {
                System.exit(0);
            }
        });
        
        panel.add(addButton);
        panel.add(updateButton);
        panel.add(deleteButton);
        panel.add(clearButton);
        panel.add(exitButton);
        
        return panel;
    }
    
    private JPanel createStatsPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Statistics"));
        panel.setPreferredSize(new Dimension(200, 0));
        
        statsLabel = new JLabel("<html><body style='padding: 10px;'></body></html>");
        statsLabel.setVerticalAlignment(JLabel.TOP);
        panel.add(statsLabel, BorderLayout.CENTER);
        
        return panel;
    }
    
    private void addStudent() {
        if (!validateInput()) return;
        
        String name = nameField.getText().trim();
        String id = idField.getText().trim();
        double subject1 = Double.parseDouble(subject1Field.getText().trim());
        double subject2 = Double.parseDouble(subject2Field.getText().trim());
        double subject3 = Double.parseDouble(subject3Field.getText().trim());
        
        if (gradeManager.addStudent(name, id, subject1, subject2, subject3)) {
            JOptionPane.showMessageDialog(this, "Student added successfully!");
            clearFields();
            updateTable();
            updateStats();
        } else {
            JOptionPane.showMessageDialog(this, "Student ID already exists!", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void updateStudent() {
        int selectedRow = studentTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a student to update.", "No Selection", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        if (!validateInput()) return;
        
        String id = idField.getText().trim();
        double subject1 = Double.parseDouble(subject1Field.getText().trim());
        double subject2 = Double.parseDouble(subject2Field.getText().trim());
        double subject3 = Double.parseDouble(subject3Field.getText().trim());
        
        if (gradeManager.updateStudentMarks(id, subject1, subject2, subject3)) {
            JOptionPane.showMessageDialog(this, "Student updated successfully!");
            updateTable();
            updateStats();
        } else {
            JOptionPane.showMessageDialog(this, "Student not found!", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    private void deleteStudent() {
        int selectedRow = studentTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a student to delete.", "No Selection", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        String id = (String) tableModel.getValueAt(selectedRow, 0);
        int option = JOptionPane.showConfirmDialog(this, 
            "Are you sure you want to delete student " + id + "?", 
            "Delete Confirmation", JOptionPane.YES_NO_OPTION);
        
        if (option == JOptionPane.YES_OPTION) {
            if (gradeManager.deleteStudent(id)) {
                JOptionPane.showMessageDialog(this, "Student deleted successfully!");
                clearFields();
                updateTable();
                updateStats();
            } else {
                JOptionPane.showMessageDialog(this, "Student not found!", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
    
    private void clearFields() {
        nameField.setText("");
        idField.setText("");
        subject1Field.setText("");
        subject2Field.setText("");
        subject3Field.setText("");
        studentTable.clearSelection();
    }
    
    private void populateFieldsFromSelection() {
        int selectedRow = studentTable.getSelectedRow();
        if (selectedRow != -1) {
            nameField.setText((String) tableModel.getValueAt(selectedRow, 1));
            idField.setText((String) tableModel.getValueAt(selectedRow, 0));
            subject1Field.setText(tableModel.getValueAt(selectedRow, 2).toString());
            subject2Field.setText(tableModel.getValueAt(selectedRow, 3).toString());
            subject3Field.setText(tableModel.getValueAt(selectedRow, 4).toString());
        }
    }
    
    private boolean validateInput() {
        String name = nameField.getText().trim();
        String id = idField.getText().trim();
        String subject1Text = subject1Field.getText().trim();
        String subject2Text = subject2Field.getText().trim();
        String subject3Text = subject3Field.getText().trim();
        
        if (!GradeManager.isValidName(name)) {
            JOptionPane.showMessageDialog(this, "Please enter a valid name.", "Invalid Input", JOptionPane.ERROR_MESSAGE);
            nameField.requestFocus();
            return false;
        }
        
        if (!GradeManager.isValidStudentId(id)) {
            JOptionPane.showMessageDialog(this, "Please enter a valid student ID.", "Invalid Input", JOptionPane.ERROR_MESSAGE);
            idField.requestFocus();
            return false;
        }
        
        try {
            double subject1 = Double.parseDouble(subject1Text);
            double subject2 = Double.parseDouble(subject2Text);
            double subject3 = Double.parseDouble(subject3Text);
            
            if (!GradeManager.isValidMark(subject1) || !GradeManager.isValidMark(subject2) || !GradeManager.isValidMark(subject3)) {
                JOptionPane.showMessageDialog(this, "Marks must be between 0 and 100.", "Invalid Input", JOptionPane.ERROR_MESSAGE);
                return false;
            }
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Please enter valid numeric values for marks.", "Invalid Input", JOptionPane.ERROR_MESSAGE);
            return false;
        }
        
        return true;
    }
    
    private void updateTable() {
        tableModel.setRowCount(0);
        List<Student> students = gradeManager.getAllStudents();
        
        for (Student student : students) {
            Object[] row = {
                student.getStudentId(),
                student.getName(),
                String.format("%.2f", student.getSubject1()),
                String.format("%.2f", student.getSubject2()),
                String.format("%.2f", student.getSubject3()),
                String.format("%.2f", student.getAverage()),
                student.getGrade()
            };
            tableModel.addRow(row);
        }
    }
    
    private void updateStats() {
        int totalStudents = gradeManager.getTotalStudents();
        double classAverage = gradeManager.getClassAverage();
        Map<Character, Integer> gradeDistribution = gradeManager.getGradeDistribution();
        
        StringBuilder stats = new StringBuilder("<html><body style='padding: 10px;'>");
        stats.append("<b>Class Statistics:</b><br><br>");
        stats.append("Total Students: ").append(totalStudents).append("<br>");
        stats.append("Class Average: ").append(String.format("%.2f", classAverage)).append("<br><br>");
        stats.append("<b>Grade Distribution:</b><br>");
        stats.append("A: ").append(gradeDistribution.get('A')).append("<br>");
        stats.append("B: ").append(gradeDistribution.get('B')).append("<br>");
        stats.append("C: ").append(gradeDistribution.get('C')).append("<br>");
        stats.append("D: ").append(gradeDistribution.get('D')).append("<br>");
        stats.append("F: ").append(gradeDistribution.get('F')).append("<br>");
        stats.append("</body></html>");
        
        statsLabel.setText(stats.toString());
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new StudentGradeGUI().setVisible(true);
        });
    }
} 