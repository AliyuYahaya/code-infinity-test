// ================================ [DOCUMENT READY] ================================ //
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rowForm');
    const rowInput = document.getElementById('numOfRows');
    const generateBtn = document.getElementById('submitBtn');
    const downloadBtn = document.getElementById('download');
    
    downloadBtn.disabled = true;
    
    rowInput.addEventListener('input', checkIfRowCountIsValid);
    
    // ================================ [FORM SUBMISSION] ================================ //
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        if (checkIfRowCountIsValid()) {
            makeTheCsv(rowInput.value.trim());
        }
    });
    
    // ================================ [DOWNLOAD BUTTON] ================================ //
    downloadBtn.addEventListener('click', () => {
        window.location.href = '/api/download-csv';
    });
    
    // ================================ [INPUT VALIDATION] ================================ //
    function checkIfRowCountIsValid() {
        const userValue = rowInput.value.trim();
        const errorMsg = document.getElementById('rowError');
        
        if (!userValue) {
            return showProblem(errorMsg, 'Come on, I need a number here!');
        }
        
        if (isNaN(userValue) || parseInt(userValue) <= 0) {
            return showProblem(errorMsg, 'Has to be a positive number (like 10, 100, etc)');
        }
        
        if (parseInt(userValue) > 1000000) {
            return showProblem(errorMsg, 'Whoa there! Max is 1,000,000 rows. My poor server...');
        }
        
        hideProblem(errorMsg);
        return true;
    }
    
    // ================================ [ERROR DISPLAY] ================================ //
    function showProblem(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        return false;
    }
    
    function hideProblem(element) {
        element.style.display = 'none';
    }
    
    // ================================ [CSV GENERATION] ================================ //
    function makeTheCsv(howManyRows) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Working on it...';
        
        fetch('/api/generate-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numOfRows: parseInt(howManyRows) })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server returned an error: ' + response.status);
            }
            return response.json();
        })
        .then(result => {
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate CSV';
            
            if (result.success) {
                showNotification('success', `Woohoo! Generated ${result.recordCount} records. Ready to download!`);
                downloadBtn.disabled = false;
            } else {
                showNotification('danger', `Uh oh: ${result.message}`);
                downloadBtn.disabled = true;
            }
        })
        .catch(err => {
            console.error('Failed to talk to the server:', err);
            
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate CSV';
            
            showNotification('danger', 'Could not connect to the server. Is it running?');
            downloadBtn.disabled = true;
        });
    }
    
    // ================================ [NOTIFICATIONS] ================================ //
    function showNotification(style, message) {
        const oldAlerts = document.querySelectorAll('.alert');
        oldAlerts.forEach(alert => alert.remove());
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${style} alert-dismissible fade show mt-3`;
        alert.setAttribute('role', 'alert');
        
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        form.parentNode.insertBefore(alert, form.nextSibling);
        
        if (style === 'success') {
            setTimeout(() => {
                const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
                bsAlert.close();
            }, 4000);
        }
    }
    
    // ================================ [END OF SCRIPT] ================================ //
});