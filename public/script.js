// Initialize form data
let formData = {
    step: 1,
    images: []
};

// Generate year options dynamically
function generateYearOptions() {
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    const startYear = 1970;
    
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    
    const olderOption = document.createElement('option');
    olderOption.value = 'Älter als 1970';
    olderOption.textContent = 'Älter als 1970';
    yearSelect.appendChild(olderOption);
}

// Generate mileage options
function generateMileageOptions() {
    const mileageSelect = document.getElementById('mileage');
    const ranges = [
        '0-10.000',
        '10.001-20.000',
        '20.001-30.000',
        '30.001-40.000',
        '40.001-50.000',
        '50.001-60.000',
        '60.001-70.000',
        '70.001-80.000',
        '80.001-90.000',
        '90.001-100.000',
        '100.001-110.000',
        '110.001-120.000',
        '120.001-130.000',
        '130.001-140.000',
        '140.001-150.000',
        '150.001-160.000',
        '160.001-170.000',
        '170.001-180.000',
        '180.001-190.000',
        '190.001-200.000',
        'Über 200.000'
    ];
    
    ranges.forEach(range => {
        const option = document.createElement('option');
        option.value = range;
        option.textContent = range;
        mileageSelect.appendChild(option);
    });
}

// Update progress text
function updateProgressText(step) {
    const progressText = document.getElementById('progressText');
    const texts = [
        'Dein Auto im Detail – Schritt 1 von 4',
        'Technische Details – Schritt 2 von 4',
        'Zusätzliche Informationen – Schritt 3 von 4',
        'Kontaktinformationen – Schritt 4 von 4'
    ];
    progressText.textContent = texts[step - 1];
}

// Step navigation
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // Update progress bar fill
    const progressFill = document.getElementById('progressFill');
    const progressPercent = (step / 4) * 100;
    if (progressFill) {
        progressFill.style.width = progressPercent + '%';
    }
    
    // Update progress text
    updateProgressText(step);
    
    formData.step = step;
}

function nextStep() {
    const currentStep = formData.step;
    
    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }
    
    if (currentStep < 4) {
        showStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevStep() {
    const currentStep = formData.step;
    if (currentStep > 1) {
        showStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.closest('.form-group')?.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.innerHTML = `
        <div class="error-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64538 18.3024 1.55299 18.6453 1.55298 18.9945C1.55297 19.3437 1.64535 19.6866 1.82 19.99C1.99464 20.2934 2.24593 20.5467 2.55073 20.7239C2.85552 20.901 3.20377 20.9961 3.56 21H20.44C20.7962 20.9961 21.1445 20.901 21.4493 20.7239C21.7541 20.5467 22.0054 20.2934 22.18 19.99C22.3546 19.6866 22.447 19.3437 22.447 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5354 3.55662 13.2841 3.30332 12.9793 3.12619C12.6745 2.94907 12.3262 2.85399 11.97 2.85399C11.6138 2.85399 11.2655 2.94907 10.9607 3.12619C10.6559 3.30332 10.4046 3.55662 10.29 3.86Z" fill="#dc2626"/>
                <path d="M12 9V13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 17H12.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <span>${message}</span>
    `;
    
    // Insert error message after the field or its label
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.appendChild(errorDiv);
    }
}

function hideFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

function validateStep(step) {
    const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    // Clear all previous errors
    currentStepEl.querySelectorAll('.error-message').forEach(error => error.remove());
    
    requiredFields.forEach(field => {
        // Check if field is a radio button group
        if (field.type === 'radio') {
            const radioGroup = currentStepEl.querySelectorAll(`input[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            
            if (!isChecked) {
                isValid = false;
                if (!firstInvalidField) firstInvalidField = field;
                
                // Highlight all radio buttons in the group
                radioGroup.forEach(radio => {
                    const label = radio.closest('.radio-label');
                    if (label) label.style.borderColor = '#ef4444';
                });
                
                // Show error message for radio group
                const firstRadio = radioGroup[0];
                const formGroup = firstRadio.closest('.form-group');
                if (formGroup && !formGroup.querySelector('.error-message')) {
                    showFieldError(firstRadio, 'Dieses Feld ist erforderlich.');
                }
            } else {
                radioGroup.forEach(radio => {
                    const label = radio.closest('.radio-label');
                    if (label) label.style.borderColor = '';
                });
                hideFieldError(radioGroup[0]);
            }
        } else if (field.type === 'checkbox') {
            if (!field.checked) {
                isValid = false;
                if (!firstInvalidField) firstInvalidField = field;
                field.style.outline = '2px solid #ef4444';
                showFieldError(field, 'Dieses Feld ist erforderlich.');
                
                field.addEventListener('change', function() {
                    this.style.outline = '';
                    hideFieldError(this);
                }, { once: true });
            } else {
                field.style.outline = '';
                hideFieldError(field);
            }
        } else {
            if (!field.value || field.value.trim() === '') {
                isValid = false;
                if (!firstInvalidField) firstInvalidField = field;
                field.style.borderColor = '#ef4444';
                showFieldError(field, 'Dieses Feld ist erforderlich.');
                
                field.addEventListener('input', function() {
                    this.style.borderColor = '';
                    hideFieldError(this);
                }, { once: true });
            } else {
                field.style.borderColor = '';
                hideFieldError(field);
            }
        }
    });
    
    if (!isValid) {
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

// Image upload functionality
function setupImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    async function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.85) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Calculate new dimensions
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth || height > maxHeight) {
                        const ratio = Math.min(maxWidth / width, maxHeight / height);
                        width = Math.floor(width * ratio);
                        height = Math.floor(height * ratio);
                    }
                    
                    // Create canvas and compress
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to blob
                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', quality);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
    
    async function handleFiles(files) {
        const remainingSlots = 5 - formData.images.length;
        const filesToAdd = Array.from(files).slice(0, remainingSlots);
        
        if (files.length > remainingSlots && remainingSlots > 0) {
            alert(`Sie können nur bis zu 5 Bilder hochladen. ${filesToAdd.length} Bilder wurden hinzugefügt.`);
        } else if (remainingSlots === 0) {
            alert('Sie haben bereits 5 Bilder hochgeladen. Bitte entfernen Sie ein Bild, um ein neues hinzuzufügen.');
            return;
        }
        
        for (const file of filesToAdd) {
            if (file.type.startsWith('image/')) {
                try {
                    // Show processing message
                    console.log(`📸 Komprimiere ${file.name} (${(file.size / 1024).toFixed(0)} KB)...`);
                    
                    // Compress the image
                    const compressedFile = await compressImage(file);
                    
                    const compressionRatio = ((1 - compressedFile.size / file.size) * 100).toFixed(0);
                    console.log(`✅ ${file.name} komprimiert: ${(file.size / 1024).toFixed(0)} KB → ${(compressedFile.size / 1024).toFixed(0)} KB (${compressionRatio}% kleiner)`);
                    
                    // Check compressed file size (now allow up to 2MB after compression)
                    if (compressedFile.size > 2 * 1024 * 1024) {
                        alert(`${file.name} ist selbst nach Komprimierung zu groß. Bitte verwenden Sie ein kleineres Bild.`);
                        continue;
                    }
                    
                    // Read compressed file for preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        formData.images.push({
                            file: compressedFile,
                            dataUrl: e.target.result
                        });
                        updateImagePreview();
                    };
                    reader.readAsDataURL(compressedFile);
                } catch (error) {
                    console.error('Fehler beim Komprimieren:', error);
                    alert(`Fehler beim Verarbeiten von ${file.name}`);
                }
            } else {
                alert(`${file.name} ist keine Bilddatei. Nur JPEG, PNG, GIF und WEBP werden unterstützt.`);
            }
        }
    }
    
    function updateImagePreview() {
        imagePreview.innerHTML = '';
        
        formData.images.forEach((image, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = image.dataUrl;
            img.alt = 'Fahrzeugbild';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.type = 'button';
            removeBtn.textContent = '×';
            removeBtn.onclick = () => {
                formData.images.splice(index, 1);
                updateImagePreview();
            };
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            imagePreview.appendChild(previewItem);
        });
    }
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateStep(4)) {
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const submitText = document.getElementById('submitText');
    const submitLoading = document.getElementById('submitLoading');
    
    // Show loading state
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline';
    
    // Collect form data
    const form = new FormData(e.target);
    
    // Add images
    formData.images.forEach((image) => {
        form.append('images', image.file);
    });
    
    // Submit to API
    fetch('/api/submit-offer', {
        method: 'POST',
        body: form
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success modal
            showSuccessModal(data.message);
            
            // Reset form
            e.target.reset();
            formData.images = [];
            document.getElementById('imagePreview').innerHTML = '';
            showStep(1);
        } else {
            let errorMessage = data.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
            if (data.errors && data.errors.length > 0) {
                errorMessage += '\n\nFehler:\n' + data.errors.map(err => `• ${err.msg}`).join('\n');
            }
            showSuccessModal(errorMessage, false);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Ein Fehler ist aufgetreten. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
    })
    .finally(() => {
        // Reset button
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
    });
}

// Success Modal Functions
function showSuccessModal(message, isSuccess = true) {
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (modal && e.target === modal) {
        closeSuccessModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSuccessModal();
    }
});

// Smooth scroll to top
function setupScrollToTop() {
    const scrollTopLinks = document.querySelectorAll('a[href="#top"]');
    scrollTopLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

// Setup FIN help image toggle
function setupFinHelp() {
    const helpText = document.getElementById('finHelpText');
    const imageContainer = document.getElementById('finImageContainer');
    
    if (helpText && imageContainer) {
        helpText.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isHidden = imageContainer.style.display === 'none' || !imageContainer.classList.contains('show');
            
            if (isHidden) {
                imageContainer.style.display = 'block';
                imageContainer.classList.add('show');
            } else {
                imageContainer.style.display = 'none';
                imageContainer.classList.remove('show');
            }
        });
        
        console.log('✅ FIN help toggle initialized');
    } else {
        console.log('⚠️ FIN help elements not found');
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚗 MeinAutoPreis24 - Initialisierung...');
    
    // Generate dynamic form options
    generateYearOptions();
    generateMileageOptions();
    
    // Setup image upload
    setupImageUpload();
    
    // Setup FIN help image
    setupFinHelp();
    
    // Setup smooth scrolling
    setupScrollToTop();
    
    // Show first step
    showStep(1);
    
    // Attach form submit handler
    const form = document.getElementById('carValuationForm');
    form.addEventListener('submit', handleFormSubmit);
    
    console.log('✅ Initialisierung abgeschlossen');
});

// Handle radio button change to remove error styling
document.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
        const radioGroup = document.querySelectorAll(`input[name="${e.target.name}"]`);
        radioGroup.forEach(radio => {
            const label = radio.closest('.radio-label');
            if (label) label.style.borderColor = '';
        });
    }
});

