// ==================== LOCAL STORAGE MANAGEMENT ====================

const STORAGE_KEY = 'employee_management_system';

// Get all employees from localStorage
function getAllEmployees() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save all employees to localStorage
function saveAllEmployees(employees) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

// Generate unique ID
function generateId() {
    const employees = getAllEmployees();
    if (employees.length === 0) return 1;
    const maxId = Math.max(...employees.map(emp => emp.id));
    return maxId + 1;
}

// ==================== IMAGE HANDLING ====================

// Convert image file to base64
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Resize large images to save space
            const img = new Image();
            img.onload = () => {
                if (img.width > 500 || img.height > 500) {
                    const canvas = document.createElement('canvas');
                    const ratio = Math.min(500 / img.width, 500 / img.height);
                    canvas.width = img.width * ratio;
                    canvas.height = img.height * ratio;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                } else {
                    resolve(reader.result);
                }
            };
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
            img.src = reader.result;
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
    });
}

// Default image path
const DEFAULT_IMAGE = 'user-default.png';

// Get image source with fallback
function getImageSrc(photoData) {
    if (photoData && photoData !== 'null' && photoData !== '') {
        return photoData;
    }
    return DEFAULT_IMAGE;
}

// ==================== UI HELPERS ====================

let dataTable;

// Show alert message
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas ${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.innerHTML = alertHTML;
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 3000);
}

// Show simple toast notification
function showToast(message, type = 'success') {
    // Remove existing toast containers
    const existingToasts = document.querySelectorAll('.toast-container');
    existingToasts.forEach(el => el.remove());
    
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
    toastContainer.style.zIndex = '9999';
    
    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toastContainer.innerHTML = `
        <div class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${icon} me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    const toastElement = toastContainer.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement, {
        delay: 3000,
        autohide: true
    });
    toast.show();
    
    // Remove container after toast is hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
    });
}

// Update empty state
function updateEmptyState() {
    const employees = getAllEmployees();
    const emptyState = document.getElementById('emptyState');
    const tableWrapper = document.querySelector('.table-responsive');
    
    if (employees.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (tableWrapper) tableWrapper.style.display = 'none';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (tableWrapper) tableWrapper.style.display = 'block';
    }
}

// ==================== FORM VALIDATION ====================

function validateName(name) {
    if (!name || name.trim() === '') {
        return { valid: false, message: 'Full name is required' };
    }
    
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2) {
        return { valid: false, message: 'Please enter at least first and last name' };
    }
    
    for (let part of parts) {
        if (!/^[A-Z]/.test(part)) {
            return { valid: false, message: 'Each name must start with a capital letter (e.g., John Doe)' };
        }
    }
    
    return { valid: true, message: '' };
}

function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, message: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    return { valid: true, message: '' };
}

function validateMobile(mobile) {
    if (!mobile || mobile.trim() === '') {
        return { valid: false, message: 'Mobile number is required' };
    }
    
    const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '');
    if (!/^\d{10,}$/.test(cleanMobile)) {
        return { valid: false, message: 'Enter a valid mobile number (minimum 10 digits)' };
    }
    
    return { valid: true, message: '' };
}

function validateCity(city) {
    if (!city || city.trim() === '') {
        return { valid: false, message: 'City is required' };
    }
    
    return { valid: true, message: '' };
}

// Show validation error on field
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        const feedback = field.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.style.display = 'block';
        }
    }
}

// Clear validation errors
function clearFieldErrors(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('is-invalid', 'is-valid');
        });
        const feedbacks = form.querySelectorAll('.invalid-feedback');
        feedbacks.forEach(fb => {
            fb.style.display = 'none';
        });
    }
}

// ==================== DATATABLE MANAGEMENT ====================

// Create action buttons HTML for a row
function createActionButtons(id) {
    return `
        <div class="btn-group-actions">
            <button class="btn btn-info btn-sm me-1" onclick="openEditModal(${id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteEmployeeConfirm(${id})">
                <i class="fas fa-trash-alt"></i> Delete
            </button>
        </div>
    `;
}

// Create photo HTML for a row
function createPhotoHTML(photoData, username) {
    const photoSrc = getImageSrc(photoData);
    return `
        <img src="${photoSrc}" 
             alt="${escapeHtml(username)}'s photo" 
             class="employee-photo"
             onclick="viewPhoto('${photoSrc}', '${escapeHtml(username)}')"
             onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';"
             loading="lazy"
             style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #4361ee; cursor: pointer;">
    `;
}

// Add a single row to DataTable (without full refresh)
function addRowToTable(employee) {
    if (!dataTable) return;
    
    const rowData = [
        employee.id,
        createPhotoHTML(employee.photo, employee.username),
        escapeHtml(employee.username),
        escapeHtml(employee.email),
        escapeHtml(employee.mobile),
        escapeHtml(employee.city),
        createActionButtons(employee.id)
    ];
    
    // Add the row to DataTable
    const rowNode = dataTable.row.add(rowData).draw(false).node();
    
    // Add ID to the row
    $(rowNode).attr('id', 'emp-' + employee.id);
    
    // Highlight the new row
    $(rowNode).addClass('bg-light');
    setTimeout(() => {
        $(rowNode).removeClass('bg-light');
    }, 2000);
    
    // Update empty state
    updateEmptyState();
}

// Update a single row in DataTable (without full refresh)
function updateRowInTable(employee) {
    if (!dataTable) return;
    
    const rowId = '#emp-' + employee.id;
    const row = $(rowId);
    
    if (row.length) {
        // Get the row index in DataTable
        const rowIndex = dataTable.row(row).index();
        
        if (rowIndex !== undefined) {
            const rowData = [
                employee.id,
                createPhotoHTML(employee.photo, employee.username),
                escapeHtml(employee.username),
                escapeHtml(employee.email),
                escapeHtml(employee.mobile),
                escapeHtml(employee.city),
                createActionButtons(employee.id)
            ];
            
            // Update the row data
            dataTable.row(rowIndex).data(rowData).draw(false);
            
            // Highlight the updated row
            const updatedRow = $('#emp-' + employee.id);
            updatedRow.addClass('bg-light');
            setTimeout(() => {
                updatedRow.removeClass('bg-light');
            }, 2000);
        }
    }
}

// Remove a single row from DataTable (without full refresh)
function removeRowFromTable(id) {
    if (!dataTable) return;
    
    const rowId = '#emp-' + id;
    const row = $(rowId);
    
    if (row.length) {
        dataTable.row(row).remove().draw(false);
    }
    
    // Update empty state
    updateEmptyState();
}

// Remove all rows from DataTable
function clearAllRowsFromTable() {
    if (!dataTable) return;
    
    dataTable.clear().draw();
    updateEmptyState();
}

// Initialize DataTable
function initializeDataTable() {
    // Destroy existing DataTable if it exists
    if ($.fn.DataTable.isDataTable('#employeeTable')) {
        $('#employeeTable').DataTable().destroy();
    }
    
    // Initialize new DataTable
    dataTable = $('#employeeTable').DataTable({
        "order": [[0, "desc"]],
        "pageLength": 10,
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "language": {
            "search": "Search:",
            "lengthMenu": "Show _MENU_ entries",
            "info": "Showing _START_ to _END_ of _TOTAL_ entries",
            "paginate": {
                "previous": '<i class="fas fa-chevron-left"></i>',
                "next": '<i class="fas fa-chevron-right"></i>'
            }
        },
        "columnDefs": [
            { "orderable": false, "targets": [1, 6] }
        ],
        "responsive": true,
        "drawCallback": function() {
            updateEmptyState();
        }
    });
    
    // Load existing data
    const employees = getAllEmployees();
    
    // Sort by ID descending (newest first) to match default order
    employees.sort((a, b) => b.id - a.id);
    
    // Add all rows
    employees.forEach(employee => {
        const rowData = [
            employee.id,
            createPhotoHTML(employee.photo, employee.username),
            escapeHtml(employee.username),
            escapeHtml(employee.email),
            escapeHtml(employee.mobile),
            escapeHtml(employee.city),
            createActionButtons(employee.id)
        ];
        
        const rowNode = dataTable.row.add(rowData).draw(false).node();
        $(rowNode).attr('id', 'emp-' + employee.id);
    });
    
    updateEmptyState();
}

// ==================== CRUD OPERATIONS ====================

async function addEmployee(formData) {
    try {
        const employees = getAllEmployees();
        
        const newEmployee = {
            id: generateId(),
            username: formData.username.trim(),
            email: formData.email.trim(),
            mobile: formData.mobile.trim(),
            city: formData.city.trim(),
            photo: formData.photo || null,
            createdAt: new Date().toISOString()
        };
        
        employees.push(newEmployee);
        saveAllEmployees(employees);
        
        // Add row directly to table
        addRowToTable(newEmployee);
        
        return { success: true, data: newEmployee };
    } catch (error) {
        console.error('Error adding employee:', error);
        return { success: false, message: 'Failed to add employee: ' + error.message };
    }
}

async function updateEmployee(id, formData) {
    try {
        const employees = getAllEmployees();
        const index = employees.findIndex(emp => emp.id === parseInt(id));
        
        if (index === -1) {
            return { success: false, message: 'Employee not found' };
        }
        
        employees[index] = {
            ...employees[index],
            username: formData.username.trim(),
            email: formData.email.trim(),
            mobile: formData.mobile.trim(),
            city: formData.city.trim(),
            photo: formData.photo !== undefined ? formData.photo : employees[index].photo,
            updatedAt: new Date().toISOString()
        };
        
        saveAllEmployees(employees);
        
        // Update row directly in table
        updateRowInTable(employees[index]);
        
        return { success: true, data: employees[index] };
    } catch (error) {
        console.error('Error updating employee:', error);
        return { success: false, message: 'Failed to update employee: ' + error.message };
    }
}

function deleteEmployee(id) {
    try {
        const employees = getAllEmployees();
        const employeeToDelete = employees.find(emp => emp.id === parseInt(id));
        
        if (!employeeToDelete) {
            return { success: false, message: 'Employee not found' };
        }
        
        const filteredEmployees = employees.filter(emp => emp.id !== parseInt(id));
        saveAllEmployees(filteredEmployees);
        
        // Remove row directly from table
        removeRowFromTable(id);
        
        return { success: true, message: 'Employee deleted successfully', data: employeeToDelete };
    } catch (error) {
        console.error('Error deleting employee:', error);
        return { success: false, message: 'Failed to delete employee: ' + error.message };
    }
}

function deleteAllEmployees() {
    try {
        const employees = getAllEmployees();
        if (employees.length === 0) {
            return { success: false, message: 'No employees to delete' };
        }
        
        saveAllEmployees([]);
        
        // Clear all rows from table
        clearAllRowsFromTable();
        
        return { success: true, message: `Deleted ${employees.length} employees successfully` };
    } catch (error) {
        console.error('Error deleting all employees:', error);
        return { success: false, message: 'Failed to delete all employees: ' + error.message };
    }
}

function getEmployee(id) {
    const employees = getAllEmployees();
    return employees.find(emp => emp.id === parseInt(id)) || null;
}

// ==================== MODAL OPERATIONS ====================

// Make viewPhoto globally accessible
window.viewPhoto = function(photoSrc, username) {
    const modalElement = document.getElementById('viewPhotoModal');
    if (!modalElement) {
        console.error('View photo modal not found');
        return;
    }
    
    const modal = new bootstrap.Modal(modalElement);
    const imageElement = document.getElementById('viewPhotoImage');
    
    if (!imageElement) {
        console.error('View photo image element not found');
        return;
    }
    
    imageElement.src = photoSrc;
    imageElement.alt = `${username}'s photo`;
    modal.show();
};

// Make openEditModal globally accessible
window.openEditModal = function(id) {
    const employee = getEmployee(id);
    if (!employee) {
        showAlert('Employee not found', 'danger');
        return;
    }
    
    // Reset form
    const form = document.getElementById('editUserForm');
    if (!form) {
        console.error('Edit form not found');
        return;
    }
    
    form.reset();
    clearFieldErrors('editUserForm');
    
    // Populate form
    document.getElementById('editId').value = employee.id;
    document.getElementById('editName').value = employee.username;
    document.getElementById('editEmail').value = employee.email;
    document.getElementById('editMobile').value = employee.mobile;
    document.getElementById('editCity').value = employee.city;
    
    // Show current photo
    const photoPreview = document.getElementById('editPhotoPreview');
    if (photoPreview) {
        const currentPhoto = getImageSrc(employee.photo);
        photoPreview.innerHTML = `
            <div class="text-center">
                <p class="text-muted mb-2">Current Photo:</p>
                <img src="${currentPhoto}" alt="Current photo" style="max-width: 150px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <p class="text-muted small mt-2">Upload new photo to change</p>
            </div>
        `;
    }
    
    // Clear file input
    const photoInput = document.getElementById('editPhoto');
    if (photoInput) {
        photoInput.value = '';
    }
    
    // Show modal
    const modalElement = document.getElementById('editUserModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
};

// Make deleteEmployeeConfirm globally accessible
window.deleteEmployeeConfirm = function(id) {
    const employee = getEmployee(id);
    if (!employee) {
        showAlert('Employee not found', 'danger');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${employee.username}?`)) {
        const result = deleteEmployee(id);
        if (result.success) {
            showToast('Employee deleted successfully!', 'success');
        } else {
            showAlert(result.message, 'danger');
        }
    }
};

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==================== FORM HANDLERS ====================

// Add User Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const addForm = document.getElementById('addUserForm');
    if (addForm) {
        addForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Add form submitted'); // Debug log
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable button to prevent double submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            
            // Clear previous errors
            clearFieldErrors('addUserForm');
            
            // Get form values
            const username = document.getElementById('addName').value;
            const email = document.getElementById('addEmail').value;
            const mobile = document.getElementById('addMobile').value;
            const city = document.getElementById('addCity').value;
            const photoFile = document.getElementById('addPhoto').files[0];
            
            let hasError = false;
            
            // Validate name
            const nameValidation = validateName(username);
            if (!nameValidation.valid) {
                showFieldError('addName', nameValidation.message);
                hasError = true;
            } else {
                document.getElementById('addName').classList.add('is-valid');
            }
            
            // Validate email
            const emailValidation = validateEmail(email);
            if (!emailValidation.valid) {
                showFieldError('addEmail', emailValidation.message);
                hasError = true;
            } else {
                document.getElementById('addEmail').classList.add('is-valid');
            }
            
            // Validate mobile
            const mobileValidation = validateMobile(mobile);
            if (!mobileValidation.valid) {
                showFieldError('addMobile', mobileValidation.message);
                hasError = true;
            } else {
                document.getElementById('addMobile').classList.add('is-valid');
            }
            
            // Validate city
            const cityValidation = validateCity(city);
            if (!cityValidation.valid) {
                showFieldError('addCity', cityValidation.message);
                hasError = true;
            } else {
                document.getElementById('addCity').classList.add('is-valid');
            }
            
            // Stop if validation failed
            if (hasError) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                showAlert('Please fix the errors in the form', 'danger');
                return;
            }
            
            // Process photo
            let photoData = null;
            if (photoFile) {
                try {
                    // Validate file type
                    if (!photoFile.type.startsWith('image/')) {
                        showAlert('Please select a valid image file', 'danger');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        return;
                    }
                    
                    // Validate file size (max 2MB)
                    if (photoFile.size > 2 * 1024 * 1024) {
                        showAlert('Photo size must be less than 2MB', 'danger');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        return;
                    }
                    
                    photoData = await imageToBase64(photoFile);
                    console.log('Photo processed successfully');
                } catch (error) {
                    console.error('Photo processing error:', error);
                    showAlert('Error processing image. Please try again.', 'danger');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    return;
                }
            }
            
            // Add employee
            const result = await addEmployee({
                username,
                email,
                mobile,
                city,
                photo: photoData
            });
            
            if (result.success) {
                console.log('Employee added:', result.data);
                
                // Close modal
                const modalElement = document.getElementById('addUserModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
                
                // Reset form
                this.reset();
                clearFieldErrors('addUserForm');
                const photoPreview = document.getElementById('addPhotoPreview');
                if (photoPreview) {
                    photoPreview.innerHTML = '';
                }
                
                // Show success message
                showToast('Employee added successfully!', 'success');
                
                // Update empty state
                updateEmptyState();
            } else {
                showAlert(result.message, 'danger');
            }
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    }
    
    // Edit User Form Submission
    const editForm = document.getElementById('editUserForm');
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Edit form submitted'); // Debug log
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable button to prevent double submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            
            // Clear previous errors
            clearFieldErrors('editUserForm');
            
            // Get form values
            const id = document.getElementById('editId').value;
            const username = document.getElementById('editName').value;
            const email = document.getElementById('editEmail').value;
            const mobile = document.getElementById('editMobile').value;
            const city = document.getElementById('editCity').value;
            const photoFile = document.getElementById('editPhoto').files[0];
            
            let hasError = false;
            
            // Validate name
            const nameValidation = validateName(username);
            if (!nameValidation.valid) {
                showFieldError('editName', nameValidation.message);
                hasError = true;
            } else {
                document.getElementById('editName').classList.add('is-valid');
            }
            
            // Validate email
            const emailValidation = validateEmail(email);
            if (!emailValidation.valid) {
                showFieldError('editEmail', emailValidation.message);
                hasError = true;
            } else {
                document.getElementById('editEmail').classList.add('is-valid');
            }
            
            // Validate mobile
            const mobileValidation = validateMobile(mobile);
            if (!mobileValidation.valid) {
                showFieldError('editMobile', mobileValidation.message);
                hasError = true;
            } else {
                document.getElementById('editMobile').classList.add('is-valid');
            }
            
            // Validate city
            const cityValidation = validateCity(city);
            if (!cityValidation.valid) {
                showFieldError('editCity', cityValidation.message);
                hasError = true;
            } else {
                document.getElementById('editCity').classList.add('is-valid');
            }
            
            // Stop if validation failed
            if (hasError) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                showAlert('Please fix the errors in the form', 'danger');
                return;
            }
            
            // Process photo if new one selected
            let formData = { username, email, mobile, city };
            
            if (photoFile) {
                try {
                    // Validate file type
                    if (!photoFile.type.startsWith('image/')) {
                        showAlert('Please select a valid image file', 'danger');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        return;
                    }
                    
                    // Validate file size (max 2MB)
                    if (photoFile.size > 2 * 1024 * 1024) {
                        showAlert('Photo size must be less than 2MB', 'danger');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnText;
                        return;
                    }
                    
                    formData.photo = await imageToBase64(photoFile);
                    console.log('New photo processed successfully');
                } catch (error) {
                    console.error('Photo processing error:', error);
                    showAlert('Error processing image. Please try again.', 'danger');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    return;
                }
            }
            
            // Update employee
            const result = await updateEmployee(id, formData);
            
            if (result.success) {
                console.log('Employee updated:', result.data);
                
                // Close modal
                const modalElement = document.getElementById('editUserModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
                
                // Show success message
                showToast('Employee updated successfully!', 'success');
            } else {
                showAlert(result.message, 'danger');
            }
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    }
    
    // Delete All Button
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', function() {
            const employees = getAllEmployees();
            if (employees.length === 0) {
                showAlert('No employees to delete', 'danger');
                return;
            }
            
            if (confirm(`WARNING: This will delete ALL ${employees.length} employees!\n\nAre you absolutely sure?`)) {
                if (confirm('FINAL WARNING: This action cannot be undone!')) {
                    const result = deleteAllEmployees();
                    if (result.success) {
                        showToast(result.message, 'success');
                    } else {
                        showAlert(result.message, 'danger');
                    }
                }
            }
        });
    }
    
    // Photo Preview - Add Form
    const addPhotoInput = document.getElementById('addPhoto');
    if (addPhotoInput) {
        addPhotoInput.addEventListener('change', function(e) {
            const preview = document.getElementById('addPhotoPreview');
            const file = e.target.files[0];
            
            if (!file) {
                preview.innerHTML = '';
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                preview.innerHTML = '<p class="text-danger">Please select an image file</p>';
                this.value = '';
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                preview.innerHTML = '<p class="text-danger">File too large! Max 2MB allowed</p>';
                this.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `
                    <div class="text-center">
                        <p class="text-success mb-2">Photo Preview:</p>
                        <img src="${e.target.result}" alt="Preview" style="max-width: 150px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Photo Preview - Edit Form
    const editPhotoInput = document.getElementById('editPhoto');
    if (editPhotoInput) {
        editPhotoInput.addEventListener('change', function(e) {
            const preview = document.getElementById('editPhotoPreview');
            const file = e.target.files[0];
            
            if (!file) {
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                preview.innerHTML = '<p class="text-danger">Please select an image file</p>';
                this.value = '';
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                preview.innerHTML = '<p class="text-danger">File too large! Max 2MB allowed</p>';
                this.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `
                    <div class="text-center">
                        <p class="text-success mb-2">New Photo Preview:</p>
                        <img src="${e.target.result}" alt="Preview" style="max-width: 150px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        });
    }
    
    // Modal cleanup handlers
    const addModal = document.getElementById('addUserModal');
    if (addModal) {
        addModal.addEventListener('hidden.bs.modal', function() {
            const form = document.getElementById('addUserForm');
            if (form) {
                form.reset();
                clearFieldErrors('addUserForm');
            }
            const photoPreview = document.getElementById('addPhotoPreview');
            if (photoPreview) {
                photoPreview.innerHTML = '';
            }
        });
    }
    
    const editModal = document.getElementById('editUserModal');
    if (editModal) {
        editModal.addEventListener('hidden.bs.modal', function() {
            const form = document.getElementById('editUserForm');
            if (form) {
                form.reset();
                clearFieldErrors('editUserForm');
            }
            const photoPreview = document.getElementById('editPhotoPreview');
            if (photoPreview) {
                photoPreview.innerHTML = '';
            }
        });
    }
    
    // ==================== SAMPLE DATA ====================
    
    function loadSampleData() {
        const employees = getAllEmployees();
        if (employees.length === 0) {
            const sampleData = [
                {
                    id: 1,
                    username: 'John Doe',
                    email: 'john.doe@example.com',
                    mobile: '1234567890',
                    city: 'New York',
                    photo: null,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    username: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    mobile: '9876543210',
                    city: 'Los Angeles',
                    photo: null,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    username: 'Bob Johnson',
                    email: 'bob.johnson@example.com',
                    mobile: '5551234567',
                    city: 'Chicago',
                    photo: null,
                    createdAt: new Date().toISOString()
                }
            ];
            
            saveAllEmployees(sampleData);
            console.log('Sample data loaded');
        }
    }
    
    // ==================== INITIALIZATION ====================
    
    console.log('Document ready');
    
    // Load sample data
    loadSampleData();
    
    // Initialize table
    initializeDataTable();
    
    console.log('Initialization complete');
});