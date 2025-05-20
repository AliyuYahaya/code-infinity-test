document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const nameField = document.getElementById('name');
    const surnameField = document.getElementById('surname');
    const idField = document.getElementById('idNumber');
    const dobField = document.getElementById('dateOfBirth');

    // Hook up real-time validation
    nameField.addEventListener('input', validateName);
    surnameField.addEventListener('input', validateSurname);
    idField.addEventListener('input', validateIdNumber);
    dobField.addEventListener('input', validateDOB);

    form.addEventListener('submit', e => {
        e.preventDefault();

        const isValid = [
            validateName(),
            validateSurname(),
            validateIdNumber(),
            validateDOB()
        ].every(Boolean);

        if (isValid) {
            const data = {
                name: nameField.value.trim(),
                surname: surnameField.value.trim(),
                idNumber: idField.value.trim(),
                dateOfBirth: dobField.value.trim()
            };

            submitUser(data);
        }
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        form.reset();
        clearErrors();
    });

    function validateName() {
        const inputValue= nameField.value.trim();
        const error = document.getElementById('nameError');

        if (!inputValue) return showError(error, 'Please enter a name');
        if (/[<>\/\\&;:#@]/.test(inputValue)) return showError(error, 'Invalid characters in name');

        hideError(error);
        return true;
    }

    function validateSurname() {
        const inputValue= surnameField.value.trim();
        const error = document.getElementById('surnameError');

        if (!inputValue) return showError(error, 'Please enter a surname');
        if (/[<>\/\\&;:#@]/.test(inputValue)) return showError(error, 'Invalid characters in surname');

        hideError(error);
        return true;
    }

    function validateIdNumber() {
        const inputValue= idField.value.trim();
        const error = document.getElementById('idNumberError');

        if (!inputValue|| inputValue.length !== 13 || isNaN(inputValue)) {
            return showError(error, 'ID should be 13 numeric digits');
        }

        hideError(error);
        return true;
    }

    function validateDOB() {
        const inputValue= dobField.value.trim();
        const error = document.getElementById('dateOfBirthError');

        const parts = val.split('/');
        if (parts.length !== 3) {
            return showError(error, 'Use format dd/mm/yyyy');
        }

        const [day, month, year] = parts.map(Number);
        const date = new Date(year, month - 1, day);

        if (
            isNaN(day) || isNaN(month) || isNaN(year) ||
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return showError(error, 'Not a valid date');
        }

        if (date > new Date()) return showError(error, 'Date cannot be in the future');

        hideError(error);
        return true;
    }


    function showError(el, msg) {
        el.textContent = msg;
        el.style.display = 'block';
        return false;
    }

    function hideError(el) {
        el.style.display = 'none';
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
    }

    function submitUser(data) {
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            if (result.error) {
                showAlert('danger', result.message);

                if (result.message.includes('ID number already exists')) {
                    showError(document.getElementById('idNumberError'), 'ID number already in use');
                    idField.classList.add('is-invalid');
                }

            } else {
                showAlert('success', 'User data saved!');
                form.reset();
                clearErrors();
            }
        })
        .catch(err => {
            console.error('Form submission failed:', err);
            showAlert('danger', 'Something went wrong. Please try again.');
        });
    }

    function showAlert(type, message) {
        const alertBox = document.createElement('div');
        alertBox.className = `alert alert-${type} alert-dismissible fade show`;
        alertBox.setAttribute('role', 'alert');
        alertBox.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        form.parentNode.insertBefore(alertBox, form);

        setTimeout(() => {
            const bsAlert = bootstrap.Alert.getOrCreateInstance(alertBox);
            bsAlert.close();
        }, type === 'success' ? 3000 : 5000);
    }
});
