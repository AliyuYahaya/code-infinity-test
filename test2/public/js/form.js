document.addEventListener('DOMContentLoaded', () => {
    const rowForm = document.getElementById('rowForm');
    const numOfRowsField = document.getElementById('numOfRows');
    const submitBtn = document.getElementById('submitBtn');
    const downloadBtn = document.getElementById('download');
    
    // Initially disable download button until CSV is generated
    downloadBtn.disabled = true;
    
    // Validate number of rows
    numOfRowsField.addEventListener('input', validateRows);
    
    // Handle form submission
    rowForm.addEventListener('submit', e => {
        e.preventDefault();
        
        if (validateRows()) {
            generateCSV(numOfRowsField.value.trim());
        }
    });
    
    // Handle download button click
    downloadBtn.addEventListener('click', () => {
        window.location.href = '/api/download-csv';
    });
    
    // Validation function
    function validateRows() {
        const rowCount = numOfRowsField.value.trim();
        const error = document.getElementById('rowError');
        
        if (!rowCount) {
            return showError(error, 'A number is required');
        }
        
        if (isNaN(rowCount) || parseInt(rowCount) <= 0) {
            return showError(error, 'The number cannot be less than zero');
        }
        
        if (parseInt(rowCount) > 1000000) {
            return showError(error, 'The number cannot be more than 1,000,000');
        }
        
        hideError(error);
        return true;
    }
    
    // Error display helper
    function showError(el, msg) {
        el.textContent = msg;
        el.style.display = 'block';
        return false;
    }
    
    // Hide error helper
    function hideError(el) {
        el.style.display = 'none';
    }
    
    // Function to call API and generate CSV
    function generateCSV(numRows) {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
        
        fetch('/api/generate-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numOfRows: parseInt(numRows) })
        })
        .then(res => res.json())
        .then(data => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Generate CSV';
            
            if (data.success) {
                // Show success message
                showAlert('success', `Successfully generated and saved ${data.recordCount} records!`);
                
                // Enable download button
                downloadBtn.disabled = false;
            } else {
                showAlert('danger', `Error: ${data.message}`);
                downloadBtn.disabled = true;
            }
        })
        .catch(err => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Generate CSV';
            showAlert('danger', 'Error connecting to server. Please try again.');
            downloadBtn.disabled = true;
            console.error('Error:', err);
        });
    }
    
    // Function to show alerts
    function showAlert(type, message) {
        // Remove any existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create new alert
        const alertBox = document.createElement('div');
        alertBox.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertBox.setAttribute('role', 'alert');
        alertBox.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Insert after form
        rowForm.parentNode.insertBefore(alertBox, rowForm.nextSibling);
        
        // Auto dismiss success alerts after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                const bsAlert = bootstrap.Alert.getOrCreateInstance(alertBox);
                bsAlert.close();
            }, 5000);
        }
    }
});