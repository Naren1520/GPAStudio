// CGPA Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Welcome overlay functionality
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const welcomeForm = document.querySelector('.welcome-form');
    const welcomeName = document.getElementById('welcome-name');
    const welcomeUsn = document.getElementById('welcome-usn');
    const welcomeSubmit = document.getElementById('welcome-submit');

    // Check if user details exist in localStorage
    const savedName = localStorage.getItem('studentName');
    const savedUsn = localStorage.getItem('studentUsn');

    if (savedName && savedUsn) {
        // If details exist, hide overlay and populate fields
        welcomeOverlay.classList.add('hidden');
        document.getElementById('student-name').value = savedName;
        document.getElementById('student-usn').value = savedUsn;
        document.getElementById('cgpa-student-name').value = savedName;
        document.getElementById('cgpa-student-usn').value = savedUsn;
    }

    welcomeSubmit.addEventListener('click', function() {
        const name = welcomeName.value.trim();
        const usn = welcomeUsn.value.trim();

        if (!name || !usn) {
            alert('Please enter both Name and USN');
            return;
        }

        // Save to localStorage
        localStorage.setItem('studentName', name);
        localStorage.setItem('studentUsn', usn);

        // Populate both calculator forms and profile
        document.getElementById('student-name').value = name;
        document.getElementById('student-usn').value = usn;
        document.getElementById('cgpa-student-name').value = name;
        document.getElementById('cgpa-student-usn').value = usn;
        document.getElementById('profile-name').textContent = name;
        document.getElementById('profile-usn').textContent = usn;

        // Hide overlay with animation
        welcomeOverlay.style.opacity = '0';
        setTimeout(() => {
            welcomeOverlay.classList.add('hidden');
        }, 300);
    });

    // Profile dropdown functionality
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');

    // Update profile info
    function updateProfileInfo() {
        const name = localStorage.getItem('studentName');
        const usn = localStorage.getItem('studentUsn');
        const college = localStorage.getItem('studentCollege');
        const phone = localStorage.getItem('studentPhone');
        
        document.getElementById('profile-name').textContent = name || 'Not set';
        document.getElementById('profile-usn').textContent = usn || 'Not set';
        document.getElementById('profile-college').textContent = college || 'Not set';
        document.getElementById('profile-phone').textContent = phone || 'Not set';
    }

    // Function to make a field editable
    function makeEditable(fieldId, labelText, validationFn = null) {
        const field = document.getElementById(fieldId);
        const container = field.parentElement;
        const currentValue = field.textContent;
        
        container.classList.add('editing');
        
        const input = document.createElement('input');
        input.value = currentValue !== 'Not set' ? currentValue : '';
        input.placeholder = `Enter ${labelText}`;
        
        const actions = document.createElement('div');
        actions.className = 'edit-actions';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = 'Save';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = 'Cancel';
        
        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
        
        container.insertBefore(input, field);
        container.appendChild(actions);
        
        input.focus();
        
        saveBtn.addEventListener('click', () => {
            const newValue = input.value.trim();
            if (validationFn && !validationFn(newValue)) {
                return;
            }
            localStorage.setItem(`student${labelText.replace(/\s+/g, '')}`, newValue);
            field.textContent = newValue || 'Not set';
            resetField();
        });
        
        cancelBtn.addEventListener('click', resetField);
        
        function resetField() {
            container.classList.remove('editing');
            input.remove();
            actions.remove();
        }
    }

    // Phone number validation
    function validatePhone(phone) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number');
            return false;
        }
        return true;
    }

    // Add event listeners for edit buttons
    document.getElementById('edit-college').addEventListener('click', () => {
        makeEditable('profile-college', 'College');
    });

    document.getElementById('edit-phone').addEventListener('click', () => {
        makeEditable('profile-phone', 'Phone', validatePhone);
    });

    // Initial profile update
    updateProfileInfo();

    // Toggle profile dropdown
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('studentName');
        localStorage.removeItem('studentUsn');
        
        // Clear all forms
        document.getElementById('student-name').value = '';
        document.getElementById('student-usn').value = '';
        document.getElementById('cgpa-student-name').value = '';
        document.getElementById('cgpa-student-usn').value = '';
        
        // Show welcome overlay
        welcomeOverlay.classList.remove('hidden');
        welcomeOverlay.style.opacity = '1';
        
        // Close dropdown
        profileDropdown.classList.remove('active');
    });

    // Add jsPDF library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script);

    // Navigation between SGPA and CGPA calculators
    const sgpaNav = document.getElementById('sgpa-nav');
    const cgpaNav = document.getElementById('cgpa-nav');
    const sgpaCalculator = document.getElementById('sgpa-calculator');
    const cgpaCalculator = document.getElementById('cgpa-calculator');

    sgpaNav.addEventListener('click', function() {
        sgpaNav.classList.add('active');
        cgpaNav.classList.remove('active');
        sgpaCalculator.style.display = 'grid';
        cgpaCalculator.style.display = 'none';
    });

    cgpaNav.addEventListener('click', function() {
        cgpaNav.classList.add('active');
        sgpaNav.classList.remove('active');
        cgpaCalculator.style.display = 'grid';
        sgpaCalculator.style.display = 'none';
    });

    // CGPA Calculator functionality
    const semestersContainer = document.getElementById('semesters-container');
    const addSemesterBtn = document.getElementById('add-semester');
    const calculateFinalCgpaBtn = document.getElementById('calculate-final-cgpa');
    const clearAllSemestersBtn = document.getElementById('clear-all-semesters');
    let semesterCount = 1;

    // Add new semester row
    function addSemesterRow() {
        semesterCount++;
        const semesterRow = document.createElement('div');
        semesterRow.className = 'semester-row';
        semesterRow.innerHTML = `
            <input type="text" class="semester-name" placeholder="Semester Name (e.g., ${semesterCount}st Semester)">
            <input type="number" class="semester-sgpa" placeholder="SGPA" min="0" max="10" step="0.01">
            <button type="button" class="remove-semester">Remove</button>
        `;
        semestersContainer.appendChild(semesterRow);
        
        // Add event listener for remove button
        const removeBtn = semesterRow.querySelector('.remove-semester');
        removeBtn.addEventListener('click', function() {
            semesterRow.remove();
            semesterCount--;
            updateSemesterNumbers();
        });
    }

    // Update semester numbers in placeholders
    function updateSemesterNumbers() {
        const semesterRows = document.querySelectorAll('.semester-row');
        semesterRows.forEach((row, index) => {
            const input = row.querySelector('.semester-name');
            const suffix = getSuffix(index + 1);
            input.placeholder = `Semester Name (e.g., ${index + 1}${suffix} Semester)`;
        });
    }

    // Get ordinal suffix for numbers
    function getSuffix(number) {
        if (number % 10 === 1 && number % 100 !== 11) return 'st';
        if (number % 10 === 2 && number % 100 !== 12) return 'nd';
        if (number % 10 === 3 && number % 100 !== 13) return 'rd';
        return 'th';
    }

    // Calculate final CGPA
    function calculateFinalCGPA() {
        const semesterRows = document.querySelectorAll('#cgpa-calculator .semester-row');
        let totalSGPA = 0;
        let validSemesters = [];
        let hasError = false;

        // Validation
        semesterRows.forEach((row, index) => {
            const semesterName = row.querySelector('.semester-name').value.trim();
            const sgpa = parseFloat(row.querySelector('.semester-sgpa').value);

            if (!semesterName) {
                showMessage(`Please enter name for Semester ${index + 1}`, 'error', true);
                hasError = true;
                return;
            }

            if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) {
                showMessage(`Please enter valid SGPA (0-10) for ${semesterName}`, 'error', true);
                hasError = true;
                return;
            }

            validSemesters.push({
                name: semesterName,
                sgpa: sgpa
            });
            totalSGPA += sgpa;
        });

        if (hasError) return;

        if (validSemesters.length === 0) {
            showMessage('Please add at least one semester!', 'error', true);
            return;
        }

        // Calculate CGPA
        const cgpa = totalSGPA / validSemesters.length;
        const percentage = (cgpa / 10) * 100;

        // Update results display
        document.getElementById('total-semesters').textContent = validSemesters.length;
        document.getElementById('final-cgpa-value').textContent = cgpa.toFixed(2);
        document.getElementById('final-percentage-value').textContent = percentage.toFixed(2) + '%';

        // Update semester table
        const tableBody = document.getElementById('semester-table-body');
        tableBody.innerHTML = '';

        validSemesters.forEach(semester => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${semester.name}</td>
                <td>${semester.sgpa.toFixed(2)}</td>
                <td>${(1 / validSemesters.length).toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

        showMessage('CGPA calculated successfully!', 'success', true);
    }

    // Clear all semesters
    function clearAllSemesters() {
        if (confirm('Are you sure you want to clear all semesters?')) {
            semestersContainer.innerHTML = `
                <div class="semester-row">
                    <input type="text" class="semester-name" placeholder="Semester Name (e.g., 1st Semester)">
                    <input type="number" class="semester-sgpa" placeholder="SGPA" min="0" max="10" step="0.01">
                    <button type="button" class="remove-semester">Remove</button>
                </div>
            `;
            
            document.getElementById('total-semesters').textContent = '0';
            document.getElementById('final-cgpa-value').textContent = '0.00';
            document.getElementById('final-percentage-value').textContent = '0.00%';
            document.getElementById('semester-table-body').innerHTML = '';
            
            semesterCount = 1;
            showMessage('All semesters cleared!', 'success', true);
        }
    }

    // Event listeners for CGPA calculator
    addSemesterBtn.addEventListener('click', addSemesterRow);
    calculateFinalCgpaBtn.addEventListener('click', calculateFinalCGPA);
    clearAllSemestersBtn.addEventListener('click', clearAllSemesters);

    // Download SGPA/CGPA Marksheet
    const downloadSgpaBtn = document.getElementById('download-marksheet');
    const downloadCgpaBtn = document.getElementById('download-cgpa-marksheet');

    downloadSgpaBtn.addEventListener('click', () => {
        downloadMarksheet('sgpa');
    });

    downloadCgpaBtn.addEventListener('click', () => {
        downloadMarksheet('cgpa');
    });

    function downloadMarksheet(type) {
        const studentName = document.getElementById(type === 'sgpa' ? 'student-name' : 'cgpa-student-name').value.trim();
        const studentUSN = document.getElementById(type === 'sgpa' ? 'student-usn' : 'cgpa-student-usn').value.trim();
        const college = localStorage.getItem('studentCollege') || 'Not set';
        const phone = localStorage.getItem('studentPhone') || 'Not set';

        if (!studentName || !studentUSN) {
            alert('Please enter your Name and USN before downloading the certificate.');
            return;
        }

        if (window.jspdf) {
            const doc = new window.jspdf.jsPDF('p', 'mm', 'a4');
            
            // Header
            doc.setFillColor(210, 230, 245);
            doc.rect(0, 0, 210, 30, 'F');
            doc.setFontSize(24);
            doc.setTextColor(33, 87, 138);
            doc.setFont('helvetica', 'bold');
            doc.text(type === 'sgpa' ? 'SGPA REPORT CARD' : 'CGPA REPORT CARD', 15, 18);
            
            // Student Details Section Background
            doc.setFillColor(245, 247, 250);
            doc.rect(10, 35, 190, 40, 'F');
            
            // Student Details Header
            doc.setFontSize(14);
            doc.setTextColor(33, 87, 138);
            doc.text('STUDENT DETAILS', 15, 45);
            
            // Student Details
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Name:', 25, 55);
            doc.text(studentName, 80, 55);
            
            doc.text('USN:', 25, 62);
            doc.text(studentUSN, 80, 62);
            
            doc.text('College:', 25, 69);
            doc.text(college, 80, 69);
            
            doc.text('Phone:', 25, 76);
            doc.text(phone, 80, 76);
            
            // Table Header
            let y = 90;  // Adjusted starting position to accommodate student details
            doc.setFillColor(33, 87, 138);
            doc.rect(15, y, 180, 10, 'F');
            doc.setTextColor(255, 255, 255);
            
            if (type === 'sgpa') {
                // SGPA Table
                doc.text('Subject', 20, y + 7);
                doc.text('Grade', 80, y + 7);
                doc.text('Credits', 120, y + 7);
                doc.text('Points', 160, y + 7);
                
                // Get data
                y += 15;
                doc.setTextColor(0, 0, 0);
                document.querySelectorAll('#grade-table-body tr').forEach(row => {
                    const cells = row.querySelectorAll('td');
                    doc.text(cells[0].textContent, 20, y);
                    doc.text(cells[1].textContent, 80, y);
                    doc.text(cells[2].textContent, 120, y);
                    doc.text(cells[3].textContent, 160, y);
                    y += 10;
                });
                
                // Summary
                y += 10;
                doc.text('Total Credits: ' + document.getElementById('total-credits').textContent, 20, y);
                y += 10;
                doc.text('SGPA: ' + document.getElementById('cgpa-value').textContent, 20, y);
                y += 10;
                doc.text('Percentage: ' + document.getElementById('percentage-value').textContent, 20, y);
            } else {
                // CGPA Table
                doc.text('Semester', 20, y + 7);
                doc.text('SGPA', 100, y + 7);
                doc.text('Weight', 160, y + 7);
                
                // Get data
                y += 15;
                doc.setTextColor(0, 0, 0);
                document.querySelectorAll('#semester-table-body tr').forEach(row => {
                    const cells = row.querySelectorAll('td');
                    doc.text(cells[0].textContent, 20, y);
                    doc.text(cells[1].textContent, 100, y);
                    doc.text(cells[2].textContent, 160, y);
                    y += 10;
                });
                
                // Summary
                y += 10;
                doc.text('Total Semesters: ' + document.getElementById('total-semesters').textContent, 20, y);
                y += 10;
                doc.text('CGPA: ' + document.getElementById('final-cgpa-value').textContent, 20, y);
                y += 10;
                doc.text('Percentage: ' + document.getElementById('final-percentage-value').textContent, 20, y);
            }
            
            // Footer
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text('Generated by SGPA/CGPA Calculator', 105, 280, { align: 'center' });
            
            // Download
            doc.save(`${studentName}_${type.toUpperCase()}_Report.pdf`);
        } else {
            alert('PDF generation is not available. Please try again later.');
        }
    }

    // Add keyboard shortcuts for CGPA calculator
    document.addEventListener('keydown', function(e) {
        if (cgpaCalculator.style.display !== 'none') {
            if (e.ctrlKey && e.key === 'Enter') {
                calculateFinalCGPA();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                addSemesterRow();
            }
        }
    });

    // Auto-calculate on Enter key in SGPA field
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('semester-sgpa') && e.key === 'Enter') {
            calculateFinalCGPA();
        }
    });

    // Function to show message (modified to support both calculators)
    function showMessage(text, type, isCgpa = false) {
        // Remove existing messages
        clearMessages(isCgpa);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = text;
        
        const inputSection = document.querySelector(isCgpa ? '#cgpa-calculator .input-section' : '#sgpa-calculator .input-section');
        inputSection.insertBefore(messageDiv, inputSection.firstChild);
        
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 3000);
        }
    }

    // Clear all messages (modified to support both calculators)
    function clearMessages(isCgpa = false) {
        const selector = isCgpa ? '#cgpa-calculator .error-message, #cgpa-calculator .success-message' : 
                                '#sgpa-calculator .error-message, #sgpa-calculator .success-message';
        const messages = document.querySelectorAll(selector);
        messages.forEach(message => message.remove());
    }

    // Download button setup is now handled in HTML
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
