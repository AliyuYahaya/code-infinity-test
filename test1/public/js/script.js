document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userForm');
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const idNumberInput = document.getElementById('idNumber');
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    
    // Add event listeners for form validation
    nameInput.addEventListener('input', validateName);
    surnameInput.addEventListener('input', validateSurname);
    idNumberInput.addEventListener('input', validateIdNumber);
    dateOfBirthInput.addEventListener('input', validateDateOfBirth);
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName();
        const isSurnameValid = validateSurname();
        const isIdNumberValid = validateIdNumber();
        const isDateOfBirthValid = validateDateOfBirth();
        
        if (isNameValid && isSurnameValid && isIdNumberValid && isDateOfBirthValid) {
            const userData = {
                name: nameInput.value.trim(),
                surname: surnameInput.value.trim(),
                idNumber: idNumberInput.value.trim(),
                dateOfBirth: dateOfBirthInput.value.trim()
            };
            
            submitForm(userData);
        }
    });
    
    // Cancel button handler
    document.getElementById('cancelBtn').addEventListener('click', function() {
        form.reset();
        hideAllErrors();
    });
    
    // Field validation functions
    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('nameError');
        
        if (!name) {
            showError(errorElement, 'Name is required');
            return false;
        }
        
        // Check for invalid characters
        if (/[<>\/\\&;:#@]/.test(name)) {
            showError(errorElement, 'Name contains invalid characters');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }
    
    function validateSurname() {
        const surname = surnameInput.value.trim();
        const errorElement = document.getElementById('surnameError');
        
        if (!surname) {
            showError(errorElement, 'Surname is required');
            return false;
        }
        
        // Check for invalid characters
        if (/[<>\/\\&;:#@]/.test(surname)) {
            showError(errorElement, 'Surname contains invalid characters');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }
    
    function validateIdNumber() {
        const idNumber = idNumberInput.value.trim();
        const errorElement = document.getElementById('idNumberError');
        
        if (!/^\d{13}$/.test(idNumber)) {
            showError(errorElement, 'ID Number must be exactly 13 digits');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }
    
    function validateDateOfBirth() {
        const dateOfBirth = dateOfBirthInput.value.trim();
        const errorElement = document.getElementById('dateOfBirthError');
        
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth)) {
            showError(errorElement, 'Date must be in format dd/mm/yyyy');
            return false;
        }
        
        // Additional date validation
        const parts = dateOfBirth.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS Date
        const year = parseInt(parts[2], 10);
        
        const date = new Date(year, month, day);
        
        // Check if the date is valid
        if (date.getDate() !== day || 
            date.getMonth() !== month || 
            date.getFullYear() !== year) {
            showError(errorElement, 'Invalid date value');
            return false;
        }
        
        // Check for future dates
        if (date > new Date()) {
            showError(errorElement, 'Date cannot be in the future');
            return false;
        }
        
        hideError(errorElement);
        return true;
    }
    
    // Helper functions for showing/hiding error messages
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }
    
    function hideError(element) {
        element.style.display = 'none';
    }
    
    function hideAllErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => {
            error.style.display = 'none';
        });
    }
    
    // Function to submit form data to backend
    function submitForm(userData) {
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // Use Bootstrap toast or alert instead of native alert
                const alertPlaceholder = document.createElement('div');
                alertPlaceholder.className = 'alert alert-danger alert-dismissible fade show';
                alertPlaceholder.setAttribute('role', 'alert');
                alertPlaceholder.innerHTML = `
                    ${data.message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
                
                form.parentNode.insertBefore(alertPlaceholder, form);
                
                // Auto dismiss after 5 seconds
                setTimeout(() => {
                    const bsAlert = new bootstrap.Alert(alertPlaceholder);
                    bsAlert.close();
                }, 5000);
                
                if (data.message.includes('ID number already exists')) {
                    // Highlight the ID field if duplicate
                    const errorElement = document.getElementById('idNumberError');
                    showError(errorElement, 'This ID Number already exists in the database');
                    idNumberInput.classList.add('is-invalid');
                }
            } else {
                // Success message
                const alertPlaceholder = document.createElement('div');
                alertPlaceholder.className = 'alert alert-success alert-dismissible fade show';
                alertPlaceholder.setAttribute('role', 'alert');
                alertPlaceholder.innerHTML = `
                    User data saved successfully!
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
                
                form.parentNode.insertBefore(alertPlaceholder, form);
                
                // Auto dismiss after 3 seconds
                setTimeout(() => {
                    const bsAlert = new bootstrap.Alert(alertPlaceholder);
                    bsAlert.close();
                }, 3000);
                
                form.reset();
                hideAllErrors();
                
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Error alert
            const alertPlaceholder = document.createElement('div');
            alertPlaceholder.className = 'alert alert-danger alert-dismissible fade show';
            alertPlaceholder.setAttribute('role', 'alert');
            alertPlaceholder.innerHTML = `
                An error occurred while saving the data.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            
            form.parentNode.insertBefore(alertPlaceholder, form);
        });
    }
    
});