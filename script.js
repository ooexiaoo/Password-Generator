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
  
    generateBtn.addEventListener('click', function () {
      generatePassword();
      changeBackgroundColor();
    });
  
    copyBtn.addEventListener('click', function () {
      passwordOutput.select();
      document.execCommand('copy');
      alert('Password copied to clipboard!');
    });
  
    uppercaseCheck.addEventListener('change', function () {
      generatePassword();
    });
  
    lowercaseCheck.addEventListener('change', function () {
      generatePassword();
    });
  
    numbersCheck.addEventListener('change', function () {
      generatePassword();
    });
  
    specialCharsCheck.addEventListener('change', function () {
      generatePassword();
    });
  
    function generatePassword() {
      const length = lengthRange.value;
      const uppercase = uppercaseCheck.checked;
      const lowercase = lowercaseCheck.checked;
      const numbers = numbersCheck.checked;
      const specialChars = specialCharsCheck.checked;
      const charset = generateCharset(uppercase, lowercase, numbers, specialChars);
  
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
  
      passwordOutput.value = password;
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
      const passwordStrength = getPasswordStrength();
      let backgroundColor;
      if (passwordStrength === 'weak') {
        backgroundColor = '#ff9999'; // Red for weak passwords
      } else if (passwordStrength === 'medium') {
        backgroundColor = '#ffff99'; // Yellow for medium passwords
      } else {
        backgroundColor = '#99ff99'; // Green for strong passwords
      }
      document.body.style.transition = 'background-color 0.5s ease-in-out';
      document.body.style.backgroundColor = backgroundColor;
    }
  
    function getPasswordStrength() {
      const password = passwordOutput.value;
      const length = password.length;
      if (length < 12) {
        return 'weak';
      } else if (length < 94) {
        return 'medium';
      } else {
        return 'strong';
      }
    }
  });
  