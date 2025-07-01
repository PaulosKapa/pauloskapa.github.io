const textInput = document.getElementById('textInput');
const charCounter = document.getElementById('charCounter');

textInput.addEventListener('input', updateCounter);

function updateCounter() {
    const currentLength = textInput.value.length;
    const maxLength = textInput.maxLength;
    charCounter.textContent = `${currentLength}/${maxLength}`;

    // Change color based on length
    charCounter.classList.remove('warning', 'danger');
    if (currentLength > maxLength * 0.8) { // 80% of max
        charCounter.classList.add('warning');
    }
    if (currentLength > maxLength * 0.95) { // 95% of max
        charCounter.classList.add('danger');
    }
}

// Initialize counter
updateCounter();
