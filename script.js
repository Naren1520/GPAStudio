// CGPA Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Add Download Marksheet button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download Marksheet';
    downloadBtn.id = 'download-marksheet';
    downloadBtn.style.background = '#28a745';
    downloadBtn.style.color = 'white';
    downloadBtn.style.border = 'none';
    downloadBtn.style.padding = '15px 25px';
    downloadBtn.style.borderRadius = '10px';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.style.fontSize = '16px';
    downloadBtn.style.fontWeight = '600';
    downloadBtn.style.margin = '10px 5px';
    const resultSection = document.querySelector('.result-section');
    resultSection.appendChild(downloadBtn);

    // Download as PDF using jsPDF
    downloadBtn.addEventListener('click', function() {
        // Get student details
        const studentName = document.getElementById('student-name').value.trim();
        const studentUSN = document.getElementById('student-usn').value.trim();
        if (!studentName || !studentUSN) {
            alert('Please enter your Name and USN before downloading the certificate.');
            return;
        }
        // Collect marksheet data
        const subjects = [];
        document.querySelectorAll('.subject-row').forEach(row => {
            const name = row.querySelector('.subject-name').value.trim();
            const grade = row.querySelector('.grade-select').value;
            const gradeLetterVal = gradeLetter[grade] || '';
            const credits = row.querySelector('.credits').value;
            if (name && grade && credits) {
                subjects.push({ name, grade: gradeLetterVal, credits, points: (gradePoints[grade] * credits).toFixed(2) });
            }
        });
        const totalCredits = document.getElementById('total-credits').textContent;
        const totalPoints = document.getElementById('total-points').textContent;
        const cgpa = document.getElementById('cgpa-value').textContent;
        const percentage = document.getElementById('percentage-value').textContent;

        // Generate PDF report card style
        if (window.jsPDF) {
            const doc = new window.jsPDF('p', 'mm', 'a4');
            // Header bar
            doc.setFillColor(210, 230, 245);
            doc.rect(0, 0, 210, 30, 'F');
            doc.setFontSize(24);
            doc.setTextColor(33, 87, 138);
            doc.setFont('helvetica', 'bold');
            doc.text('REPORT CARD', 15, 18);
            doc.setFontSize(14);
            doc.setTextColor(80, 80, 80);
            doc.setFont('helvetica', 'normal');
            doc.text('SGPA Calculator', 15, 26);

            // Student details
            doc.setFontSize(12);
            doc.setTextColor(33, 87, 138);
            doc.setFont('helvetica', 'bold');
            doc.text('Student', 15, 40);
            doc.text('USN', 15, 48);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            doc.text(': ' + studentName, 40, 40);
            doc.text(': ' + studentUSN, 40, 48);

            // Table header
            let startY = 60;
            doc.setFont('helvetica', 'bold');
            doc.setFillColor(33, 87, 138);
            doc.setTextColor(255, 255, 255);
            doc.rect(15, startY, 180, 10, 'F');
            doc.text('Subject', 20, startY + 7);
            doc.text('Grade', 80, startY + 7);
            doc.text('Credits', 120, startY + 7);
            doc.text('Grade Points', 160, startY + 7);

            // Table rows
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(44, 62, 80);
            let rowY = startY + 15;
            subjects.forEach((sub, idx) => {
                doc.rect(15, rowY - 7, 180, 10);
                doc.text(sub.name, 20, rowY);
                doc.text(sub.grade, 80, rowY);
                doc.text(String(sub.credits), 120, rowY);
                doc.text(String(sub.points), 160, rowY);
                rowY += 12;
            });

            // Summary
            rowY += 5;
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(33, 87, 138);
            doc.text('Total Credits: ' + totalCredits, 20, rowY);
            doc.text('Total Grade Points: ' + totalPoints, 80, rowY);
            doc.text('SGPA: ' + cgpa, 120, rowY);
            doc.text('Percentage: ' + percentage, 160, rowY);

            // Grading scale
            rowY += 15;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text('GRADING SCALE :  A = 90% -100%  B = 80% - 89%  C = 60% - 79%  D = 0% - 59%', 15, rowY);

            // Comment box
            rowY += 10;
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(33, 87, 138);
            doc.text('Comment :', 15, rowY);
            doc.setDrawColor(210, 230, 245);
            doc.rect(15, rowY + 2, 180, 20);

            // Footer
            doc.setFontSize(10);
            doc.setFont('times', 'italic');
            doc.setTextColor(100, 100, 100);
            doc.text('Generated by SGPA Calculator', 105, 290, { align: 'center' });
            doc.save(studentName + '_SGPA_ReportCard.pdf');
        } else {
            // Fallback: download as text file
            let marksheet = 'SGPA Report Card\n\n';
            marksheet += 'Name: ' + studentName + '\n';
            marksheet += 'USN: ' + studentUSN + '\n\n';
            marksheet += 'Subject\tGrade\tCredits\tGrade Points\n';
            subjects.forEach(sub => {
                marksheet += `${sub.name}\t${sub.grade}\t${sub.credits}\t${sub.points}\n`;
            });
            marksheet += '\nTotal Credits: ' + totalCredits;
            marksheet += '\nTotal Grade Points: ' + totalPoints;
            marksheet += '\nSGPA: ' + cgpa;
            marksheet += '\nPercentage: ' + percentage;
            marksheet += '\nGRADING SCALE :  A = 90% -100%  B = 80% - 89%  C = 60% - 79%  D = 0% - 59%';
            marksheet += '\nComment :';
            const blob = new Blob([marksheet], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = studentName + '_SGPA_ReportCard.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
    const subjectsContainer = document.getElementById('subjects-container');
    const addSubjectBtn = document.getElementById('add-subject');
    const calculateBtn = document.getElementById('calculate-cgpa');
    const clearAllBtn = document.getElementById('clear-all');
    
    let subjectCount = 1;

    // Grade point mapping
    const gradePoints = {
        '10': 10,  // A+
        '9': 9,    // A
        '8': 8,    // B+
        '7': 7,    // B
        '6': 6,    // C+
        '5': 5,    // C
        '4': 4,    // D
        '0': 0     // F
    };

    // Grade letter mapping for display
    const gradeLetter = {
        '10': 'A+',
        '9': 'A',
        '8': 'B+',
        '7': 'B',
        '6': 'C+',
        '5': 'C',
        '4': 'D',
        '0': 'F'
    };

    // Add new subject row
    function addSubjectRow() {
        subjectCount++;
        const subjectRow = document.createElement('div');
        subjectRow.className = 'subject-row';
        subjectRow.innerHTML = `
            <input type="text" class="subject-name" placeholder="Subject Name">
            <select class="grade-select">
                <option value="">Select Grade</option>
                <option value="10">A+ (10)</option>
                <option value="9">A (9)</option>
                <option value="8">B+ (8)</option>
                <option value="7">B (7)</option>
                <option value="6">C+ (6)</option>
                <option value="5">C (5)</option>
                <option value="4">D (4)</option>
                <option value="0">F (0)</option>
            </select>
            <input type="number" class="credits" placeholder="Credits" min="1" max="10">
            <button type="button" class="remove-subject">Remove</button>
        `;
        subjectsContainer.appendChild(subjectRow);
        // Add event listener for remove button
        const removeBtn = subjectRow.querySelector('.remove-subject');
        removeBtn.addEventListener('click', function() {
            subjectRow.remove();
            subjectCount--;
        });
    }

    // Remove subject row
    function setupRemoveButtons() {
        const removeButtons = document.querySelectorAll('.remove-subject');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const subjectRow = button.parentElement;
                subjectRow.remove();
                subjectCount--;
            });
        });
    }

    // Calculate CGPA
    function calculateCGPA() {
        const subjectRows = document.querySelectorAll('.subject-row');
        let totalCredits = 0;
        let totalGradePoints = 0;
        let validSubjects = [];
        let hasError = false;

        // Clear previous messages
        clearMessages();

        subjectRows.forEach((row, index) => {
            const subjectName = row.querySelector('.subject-name').value.trim();
            const grade = row.querySelector('.grade-select').value;
            const credits = parseInt(row.querySelector('.credits').value);

            // Validation
            if (!subjectName) {
                showMessage(`Please enter name for Subject ${index + 1}`, 'error');
                hasError = true;
                return;
            }

            if (!grade) {
                showMessage(`Please select grade for ${subjectName}`, 'error');
                hasError = true;
                return;
            }

            if (!credits || credits <= 0) {
                showMessage(`Please enter valid credits for ${subjectName}`, 'error');
                hasError = true;
                return;
            }

            // Calculate grade points for this subject
            const gradePoint = gradePoints[grade];
            const subjectGradePoints = gradePoint * credits;

            totalCredits += credits;
            totalGradePoints += subjectGradePoints;

            validSubjects.push({
                name: subjectName,
                grade: grade,
                gradeLetter: gradeLetter[grade],
                credits: credits,
                gradePoints: subjectGradePoints
            });
        });

        if (hasError) {
            return;
        }

        if (validSubjects.length === 0) {
            showMessage('Please add at least one valid subject!', 'error');
            return;
        }

        // Calculate CGPA
        const cgpa = totalGradePoints / totalCredits;
        const percentage = (cgpa / 10) * 100;

        // Update results display
        updateResults(totalCredits, totalGradePoints, cgpa, percentage);
        updateGradeTable(validSubjects);
        
        showMessage('CGPA calculated successfully!', 'success');
    }

    // Update results display
    function updateResults(totalCredits, totalGradePoints, cgpa, percentage) {
        document.getElementById('total-credits').textContent = totalCredits;
        document.getElementById('total-points').textContent = totalGradePoints.toFixed(2);
        document.getElementById('cgpa-value').textContent = cgpa.toFixed(2);
        document.getElementById('percentage-value').textContent = percentage.toFixed(2) + '%';
    }

    // Update grade table
    function updateGradeTable(subjects) {
        const tableBody = document.getElementById('grade-table-body');
        tableBody.innerHTML = '';

        subjects.forEach(subject => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subject.name}</td>
                <td>${subject.gradeLetter} (${subject.grade})</td>
                <td>${subject.credits}</td>
                <td>${subject.gradePoints.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Clear all subjects and reset
    function clearAll() {
        if (confirm('Are you sure you want to clear all subjects?')) {
            // Reset to single subject row
            subjectsContainer.innerHTML = `
                <div class="subject-row">
                    <input type="text" class="subject-name" placeholder="Subject Name">
                    <select class="grade-select">
                        <option value="">Select Grade</option>
                        <option value="10">A+ (10)</option>
                        <option value="9">A (9)</option>
                        <option value="8">B+ (8)</option>
                        <option value="7">B (7)</option>
                        <option value="6">C+ (6)</option>
                        <option value="5">C (5)</option>
                        <option value="4">D (4)</option>
                        <option value="0">F (0)</option>
                    </select>
                    <input type="number" class="credits" placeholder="Credits" min="1" max="10">
                    <button type="button" class="remove-subject">Remove</button>
                </div>
            `;
            
            // Reset results
            document.getElementById('total-credits').textContent = '0';
            document.getElementById('total-points').textContent = '0';
            document.getElementById('cgpa-value').textContent = '0.00';
            document.getElementById('percentage-value').textContent = '0.00%';
            document.getElementById('grade-table-body').innerHTML = '';
            
            subjectCount = 1;
            setupRemoveButtons();
            clearMessages();
            showMessage('All subjects cleared!', 'success');
        }
    }

    // Show message to user
    function showMessage(text, type) {
        // Remove existing messages
        clearMessages();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = text;
        
        const inputSection = document.querySelector('.input-section');
        inputSection.insertBefore(messageDiv, inputSection.firstChild);
        
        // Auto-remove success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 3000);
        }
    }

    // Clear all messages
    function clearMessages() {
        const messages = document.querySelectorAll('.error-message, .success-message');
        messages.forEach(message => message.remove());
    }

    // Event listeners
    addSubjectBtn.addEventListener('click', addSubjectRow);
    calculateBtn.addEventListener('click', calculateCGPA);
    clearAllBtn.addEventListener('click', clearAll);
    // Setup initial remove button
    setupRemoveButtons();
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            calculateCGPA();
        }
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            addSubjectRow();
        }
    });
    // Auto-calculate on Enter key in credits field
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('credits') && e.key === 'Enter') {
            calculateCGPA();
        }
    });

});
