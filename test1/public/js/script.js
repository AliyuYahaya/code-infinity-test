document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    const nameField = document.getElementById('name');
    const surnameField = document.getElementById('surname');
    const idField = document.getElementById('id');
    const dobField = document.getElementById('dateOfBirth');

    nameField.addEventListener('input', validateName);
    surnameField.addEventListener('input', validateSurname);
    idField.addEventListener('input', validateIdNumber);
    dobField.addEventListener('input', validateDOB);

    // ================================ [SUBMIT FORM] ================================ //
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
                id: idField.value.trim(),
                dateOfBirth: dobField.value.trim()
            };

            submitUser(data);
        }
    });
    // ================================ [EOM] ================================ //


    // ================================ [CANCEL AND RESET FORM] ================================ //
    document.getElementById('cancelBtn').addEventListener('click', () => {
        form.reset();
        clearErrors();
    });
    // ================================ [EOM] ================================ //


    // ================================ [VALIDATORS FOR INPUT FIELDS] ================================ //
    // ================================ [VALIDATES THAT THERE IS A VALIDE NAME INPUT] ================================ //
    function validateName() {
        const inputerdName= nameField.value.trim();
        const error = document.getElementById('nameError');

        if (!inputerdName) return showError(error, 'Please enter a name');
        if (/[<>\/\\&;:#@]/.test(inputerdName)) return showError(error, 'Invalid characters in name');

        hideError(error);
        return true;
    }
    // ================================ [EOM] ================================ //

    // ================================ [VALIDATES THAT THERE IS A VALID SURNAME INPUT] ================================ //
    function validateSurname() {
        const inputedSurn= surnameField.value.trim();
        const error = document.getElementById('surnameError');

        if (!inputedSurn) return showError(error, 'Please enter a surname');
        if (/[<>\/\\&;:#@]/.test(inputedSurn)) return showError(error, 'Invalid character(s) in surname');

        hideError(error);
        return true;
    }
    // ================================ [EOM] ================================ //

    // ================================ [VALIDATES THAT THERE IS A VALID ID INPUT] ================================ //
    function validateIdNumber() {
        const inputedIdNum= idField.value.trim();
        const error = document.getElementById('idError');

        if (!inputedIdNum|| inputedIdNum.length !== 13 || isNaN(inputedIdNum)) {
            return showError(error, 'ID should be exactly 13 numbers');
        }

        hideError(error);
        return true;
    }
    // ================================ [EOM] ================================ //

    // ================================ [METHOD VALIDATENAME: VALIDATES THAT THERE IS A VALID DATE INPUT] ================================ //
    function validateDOB() {
        const inputedDate= dobField.value.trim();
        const error = document.getElementById('dateOfBirthError');

        const partsOfDate = inputedDate.split('/');
        if (partsOfDate.length !== 3) {
            return showError(error, 'Use format dd/mm/yyyy');
        }

        const [day, month, year] = partsOfDate.map(Number);
        const date = new Date(year, month - 1, day);

        if (
            isNaN(day) || isNaN(month) || isNaN(year) ||
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return showError(error, 'invalid date,, try again');
        }

        if (date > new Date()) return showError(error, 'Date cannot be in the future');

        hideError(error);
        return true;
    }
    // ================================ [EOM] ================================ //
    // ================================ [VALIDATIONS DONE] ================================ //


    // ================================ [ERROR MESSAGE RENDERING IN DOM] ================================ //
    function showError(el, msg) {
        el.textContent = msg;
        el.style.display = 'block';
        return false;
    }
    // ================================ [EOM] ================================ //

    // ================================ [HIDE ERROR MESSAGE] ================================ //
    function hideError(el) {
        el.style.display = 'none';
    }
    // ================================ [EOM] ================================ //

    // ================================ [CLEAR ERROR MESSAGES] ================================ //
    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
    }
    // ================================ [EOM] ================================ //

    // ================================ [SUBMIT/POSYT DATA TO MONGODB VIA EXPRESS] ================================ //
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
                    showError(document.getElementById('idError'), 'ID number already in use');
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
    // ================================ [EOM] ================================ //

    // ================================ [ALERT MESSAGE FOR POST ACTIONS] ================================ //
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
    // ================================ [EOM] ================================ //
});
// ================================ [EOF] ================================ //
