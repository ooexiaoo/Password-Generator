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
    if (!(uppercaseCheck.checked || lowercaseCheck.checked || numbersCheck.checked || specialCharsCheck.checked)) {
      alert('Please select at least one option.');
      return;
    }

    generatePassword();
    changeBackgroundColor();
  });

  copyBtn.addEventListener('click', function () {
    passwordOutput.select();
    document.execCommand('copy');
    alert('Password copied to clipboard!');
  });

  // Event listeners for checkbox changes...

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
  
      return charset || ' ';
    }
  
    function changeBackgroundColor() {
      const passwordStrength = getPasswordStrength();
      let backgroundColor;
      let emoji;
    
      const color1 = [148, 0, 0]; // Red for weak passwords
      const color2 = [255, 255, 0]; // Yellow for medium passwords
      const color3 = [0, 148, 0]; // Green for strong passwords
    
      const maxLength = 128;
      const minLength = 1;
    
      // Calculate the interpolation value between 0 and 1 based on password length
      let interpolation = (passwordStrength - minLength) / (maxLength - minLength);
    
      // Ensure interpolation value is within the range of 0 to 1
      interpolation = Math.min(Math.max(interpolation, 0), 1);

        // Set emoji based on password strength
      if (passwordStrength >= 1 && passwordStrength <= 12) {
        emoji = "😣"; // Emoji for weak passwords
      } else if (passwordStrength >= 13 && passwordStrength <= 26) {
        emoji = "😐"; // Emoji for slightly better passwords
      } else if (passwordStrength >= 27 && passwordStrength <= 64) {
        emoji = "😲"; // Emoji for strong passwords
      } else if (passwordStrength >= 65 && passwordStrength <= 100) {
        emoji = "😨"; // Emoji for very strong passwords
      } else if (passwordStrength >= 101 && passwordStrength <= 128) {
        emoji = "🤯"; // Emoji for very strong passwords
      }
    
            // Set the emoji to the password strength indicator
      const strengthIndicator = document.getElementById('strengthIndicator');
      strengthIndicator.textContent = emoji;

      // Interpolate between colors based on the interpolation value
      if (interpolation <= 0.5) {
        backgroundColor = interpolateColor(color1, color2, interpolation * 2);
      } else {
        backgroundColor = interpolateColor(color2, color3, (interpolation - 0.5) * 2);
      }
    
      document.body.style.transition = 'background-color 0.5s ease-in-out';
      document.body.style.backgroundColor = `rgb(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]})`;
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
      const length = password.length;
      return length;
    }
  });
  