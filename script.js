// Notification System with ARIA support
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.getElementById('notification');
  
  // Clear any existing notification
  notification.className = 'notification';
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  notification.textContent = message;
  
  // Add type class and show
  notification.classList.add(type, 'show');
  
  // Auto-hide after duration
  setTimeout(() => {
    notification.classList.remove('show');
  }, duration);
  
  // Also hide on click and manage focus
  notification.onclick = () => {
    notification.classList.remove('show');
    // Return focus to the generate button after dismissing notification
    document.getElementById('generateBtn').focus();
  };
}

document.addEventListener('DOMContentLoaded', function () {
  const lengthRange = document.getElementById('lengthRange');
  const lengthValue = document.getElementById('lengthValue');
  const uppercaseCheck = document.getElementById('uppercaseCheck');
  const lowercaseCheck = document.getElementById('lowercaseCheck');
  const numbersCheck = document.getElementById('numbersCheck');
  const specialCharsCheck = document.getElementById('specialCharsCheck');
  const generateBtn = document.getElementById('generateBtn');
  const passwordOutput = document.getElementById('passwordOutput');
  const copyBtn = document.getElementById('copyBtn');

  lengthRange.addEventListener('input', function () {
    lengthValue.textContent = lengthRange.value;
    generatePassword();
    changeBackgroundColor();
  });

  // Set initial ARIA attributes
  passwordOutput.setAttribute('aria-label', 'Generated password');
  passwordOutput.setAttribute('aria-live', 'polite');
  
  generateBtn.addEventListener('click', function () {
    this.setAttribute('aria-pressed', 'true');
    // Reset pressed state after animation
    setTimeout(() => this.setAttribute('aria-pressed', 'false'), 200);
    try {
      if (!(uppercaseCheck.checked || lowercaseCheck.checked || numbersCheck.checked || specialCharsCheck.checked)) {
        showNotification('Please select at least one character type', 'warning');
        return;
      }

      const password = generatePassword();
      if (password) {
        changeBackgroundColor();
        showNotification('Password generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error generating password:', error);
      showNotification('Failed to generate password. Please try again.', 'error');
    }
  });

  // Initialize copy button state
  copyBtn.setAttribute('aria-label', 'Copy password to clipboard');
  let copyTimeout;
  
  copyBtn.addEventListener('click', function () {
    // Clear any existing timeout
    if (copyTimeout) clearTimeout(copyTimeout);
    
    // Update button state for screen readers
    this.setAttribute('aria-pressed', 'true');
    this.setAttribute('aria-label', 'Copying password...');
    try {
      if (!passwordOutput.value) {
        showNotification('No password to copy', 'warning');
        return;
      }
      
      passwordOutput.select();
      document.execCommand('copy');
      
      // Show feedback
      const selection = window.getSelection();
      selection.removeAllRanges();
      
      // Update button state and provide feedback
      const originalLabel = this.getAttribute('data-original-label') || 'Copy password to clipboard';
      this.setAttribute('aria-label', 'Password copied!');
      this.setAttribute('data-original-label', originalLabel);
      
      showNotification('Password copied to clipboard!', 'success');
      
      // Reset button state after delay
      copyTimeout = setTimeout(() => {
        this.setAttribute('aria-label', originalLabel);
        this.setAttribute('aria-pressed', 'false');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy password:', error);
      showNotification('Failed to copy password to clipboard', 'error');
    }
  });

  // Update ARIA attributes when checkboxes change
  [uppercaseCheck, lowercaseCheck, numbersCheck, specialCharsCheck].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Update aria-checked and aria-invalid for screen readers
      const isValid = [uppercaseCheck, lowercaseCheck, numbersCheck, specialCharsCheck].some(cb => cb.checked);
      checkbox.setAttribute('aria-checked', checkbox.checked);
      checkbox.setAttribute('aria-invalid', !isValid);
      
      // Update password if any checkbox changes
      if (isValid) {
        generatePassword();
        changeBackgroundColor();
      } else {
        showNotification('Please select at least one character type', 'warning');
      }
    });
  });

  // Update password length value for screen readers
  lengthRange.addEventListener('input', function() {
    const value = this.value;
    lengthValue.textContent = value;
    this.setAttribute('aria-valuenow', value);
    
    // Update password when length changes
    if (isValidCharacterSelection()) {
      generatePassword();
      changeBackgroundColor();
    }
  });

  // Check if at least one character type is selected
  function isValidCharacterSelection() {
    return [uppercaseCheck, lowercaseCheck, numbersCheck, specialCharsCheck].some(cb => cb.checked);
  }

  // Generate a cryptographically secure random password
  // Update password strength indicator for screen readers
  function updateAriaStrength(score) {
    const strengthIndicator = document.getElementById('strengthIndicator');
    const strengthText = document.getElementById('strengthText');
    const strengthLevels = [
      'very weak', 'weak', 'moderate', 'strong', 'very strong'
    ];
    const level = Math.min(Math.floor(score / 9), 4);
    
    strengthIndicator.setAttribute('aria-label', `Password strength: ${strengthLevels[level]}`);
    strengthText.setAttribute('aria-live', 'polite');
  }
  
  function generatePassword() {
    try {
      const length = parseInt(lengthRange.value, 10);
      if (isNaN(length) || length < 1 || length > 128) {
        throw new Error('Invalid password length');
      }
      
      const uppercase = uppercaseCheck.checked;
      const lowercase = lowercaseCheck.checked;
      const numbers = numbersCheck.checked;
      const specialChars = specialCharsCheck.checked;
      
      const charset = generateCharset(uppercase, lowercase, numbers, specialChars);
      if (charset.length === 0) {
        throw new Error('No character types selected');
      }

      let password = '';
      const randomValues = new Uint32Array(length);
      window.crypto.getRandomValues(randomValues);
      
      for (let i = 0; i < length; i++) {
        // Use the random value to get an index within the charset length
        const randomIndex = randomValues[i] % charset.length;
        password += charset[randomIndex];
      }

      passwordOutput.value = password;
      // Update ARIA attributes
      passwordOutput.setAttribute('aria-valuenow', password.length);
      updateAriaStrength(getPasswordStrength().score);
      return password;
    } catch (error) {
      console.error('Error in generatePassword:', error);
      showNotification('Error generating password: ' + error.message, 'error');
      passwordOutput.value = '';
      return null;
    }
  }
  
    function generateCharset(uppercase, lowercase, numbers, specialChars) {
      let charset = '';
      if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (numbers) charset += '0123456789';
      if (specialChars) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
      return charset;
    }
  
    function changeBackgroundColor() {
      const { score } = getPasswordStrength();
      
      // Map score (0-20) to a color gradient
      // Red (weak) -> Orange -> Yellow -> Light Green -> Green (strong)
      const hue = Math.min(120 * (score / 20), 120); // 0 (red) to 120 (green)
      const saturation = 80; // Keep saturation high for vibrant colors
      const lightness = 50 + (score / 40) * 20; // Slightly lighter for better contrast
      
      document.body.style.transition = 'background-color 0.5s ease-in-out';
      document.body.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // Interpolate between two colors based on a given ratio
    function interpolateColor(color1, color2, ratio) {
      const result = [];
      for (let i = 0; i < 3; i++) {
        result.push(Math.round(color1[i] * (1 - ratio) + color2[i] * ratio));
      }
      return result;
    }
    
    function getPasswordStrength() {
      const password = passwordOutput.value;
      if (!password) return { score: 0, feedback: 'Enter a password' };
      
      let score = 0;
      const feedback = [];
      
      // Length check (max 128)
      const length = Math.min(password.length, 128);
      // More granular points for length - max 15 points (reduced from 20)
      if (length <= 8) score += length * 0.5; // 0-4 points
      else if (length <= 16) score += 4 + (length - 8) * 0.75; // 4-10 points
      else if (length <= 32) score += 10 + (length - 16) * 0.5; // 10-18 points
      else score += 18 + (length - 32) * 0.2; // 18-33.2 points (capped at 30)
      
      score = Math.min(score, 30); // Cap at 30 points for length
      
      // Character type diversity - more points for using more character types
      const hasLower = /[a-z]/.test(password);
      const hasUpper = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^a-zA-Z0-9]/.test(password);
      
      const typeCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
      score += (typeCount - 1) * 5; // Up to 15 points for character types (5 per type after first)
      
      // Deductions for common patterns
      if (/^[a-z]+$/.test(password)) score -= 3; // All lowercase
      if (/^[A-Z]+$/.test(password)) score -= 3; // All uppercase
      if (/^\d+$/.test(password)) score -= 3;    // All numbers
      if (/(.)\1{2,}/.test(password)) score -= 2; // Repeated characters
      
      // Common patterns (dates, sequences, etc.)
      const commonPatterns = [
        '123', 'abc', 'qwerty', 'password', 'admin', 'welcome', 'letmein',
        'monkey', 'dragon', 'football', 'baseball', 'superman', 'iloveyou'
      ];
      
      const lowerPass = password.toLowerCase();
      if (commonPatterns.some(pattern => lowerPass.includes(pattern))) {
        score -= 4;
        feedback.push('Avoid common words or patterns');
      }
      
      // Calculate final score (0-45 scale: 30 from length + 15 from character types)
      score = Math.max(0, Math.min(45, score));
      
      // Determine strength level based on the new 0-45 scale
      let strength, emoji, color;
      if (score < 10) {
        strength = 'Very Weak';
        emoji = '😣';
        color = '#ff4d4d'; // Red
      } else if (score < 20) {
        strength = 'Weak';
        emoji = '😕';
        color = '#ff9e4d'; // Orange
      } else if (score < 30) {
        strength = 'Moderate';
        emoji = '😐';
        color = '#ffd24d'; // Yellow
      } else if (score < 40) {
        strength = 'Strong';
        emoji = '😊';
        color = '#6bd96a'; // Light green
      } else {
        strength = 'Very Strong';
        emoji = '🔒';
        color = '#2ecc71'; // Green
      }
      
      // Update UI
      const strengthBar = document.getElementById('strengthBar');
      const strengthText = document.getElementById('strengthText');
      const strengthIndicator = document.getElementById('strengthIndicator');
      
      // Scale the score to 100% based on the 0-45 scale
      const percentage = Math.min(100, (score / 45) * 100);
      strengthBar.style.width = `${percentage}%`;
      strengthBar.style.backgroundColor = color;
      strengthText.textContent = strength;
      strengthText.style.color = color;
      strengthIndicator.textContent = emoji;
      
      return { score, strength, feedback };
    }
  });
  