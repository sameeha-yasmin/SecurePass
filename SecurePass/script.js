const passwordInput = document.querySelector('#password-input');
const toggleVisibilityButton = document.querySelector('#toggle-visibility');
const generateButton = document.querySelector('#generate-button');
const copyButton = document.querySelector('#copy-button');
const resetButton = document.querySelector('#reset-button');
const copyStatus = document.querySelector('#copy-status');
const strengthLabel = document.querySelector('#strength-label');
const strengthProgress = document.querySelector('#strength-progress');
const progressFill = document.querySelector('#progress-fill');
const scoreValue = document.querySelector('#score-value');
const scoreDescription = document.querySelector('#score-description');
const suggestionsList = document.querySelector('#suggestions-list');

const characterSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  special: '!@#$%^&*()-_=+[]{};:,.?'
};

const requirementElements = {
  length: document.querySelector('#requirement-length'),
  uppercase: document.querySelector('#requirement-uppercase'),
  lowercase: document.querySelector('#requirement-lowercase'),
  number: document.querySelector('#requirement-number'),
  special: document.querySelector('#requirement-special')
};

function checkPassword(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

function calculateScore(password, checks) {
  // Length is worth up to 40 points; each character group adds 15 points.
  const lengthPoints = Math.min(password.length, 20) * 2;
  const varietyPoints = ['uppercase', 'lowercase', 'number', 'special']
    .filter((name) => checks[name]).length * 15;

  return lengthPoints + varietyPoints;
}

function getStrength(password, checks, score) {
  if (password.length === 0) {
    return { label: 'Not rated', value: 'none' };
  }

  const allChecksPassed = Object.values(checks).every(Boolean);
  if (score >= 75 && allChecksPassed) {
    return { label: 'Strong', value: 'strong' };
  }
  if (score >= 45) {
    return { label: 'Medium', value: 'medium' };
  }
  return { label: 'Weak', value: 'weak' };
}

function getSuggestions(password, checks) {
  if (password.length === 0) {
    return ['Enter a password to see personalized suggestions.'];
  }

  const suggestions = [];
  if (!checks.length) suggestions.push('Use at least 8 characters.');
  if (!checks.uppercase) suggestions.push('Add an uppercase letter.');
  if (!checks.lowercase) suggestions.push('Add a lowercase letter.');
  if (!checks.number) suggestions.push('Add a number.');
  if (!checks.special) suggestions.push('Add a special character.');

  if (suggestions.length === 0) {
    suggestions.push('The listed checks pass. Consider using a longer, unique password.');
  }
  return suggestions;
}

function updateRequirement(name, isMet) {
  requirementElements[name].classList.toggle('is-met', isMet);
}

function renderSuggestions(suggestions) {
  suggestionsList.replaceChildren();
  suggestions.forEach((suggestion) => {
    const item = document.createElement('li');
    item.textContent = suggestion;
    suggestionsList.append(item);
  });
}

function analyzePassword() {
  const password = passwordInput.value;
  const checks = checkPassword(password);
  const score = calculateScore(password, checks);
  const strength = getStrength(password, checks, score);

  Object.entries(checks).forEach(([name, isMet]) => updateRequirement(name, isMet));
  strengthLabel.textContent = strength.label;
  strengthLabel.dataset.strength = strength.value;
  progressFill.dataset.strength = strength.value;
  progressFill.style.width = `${score}%`;
  strengthProgress.setAttribute('aria-valuenow', String(score));
  strengthProgress.setAttribute('aria-valuetext', `${score} out of 100`);
  scoreValue.textContent = String(score);
  scoreDescription.textContent = password.length === 0
    ? 'Add a password to begin.'
    : `${strength.label} by this tool’s basic checklist.`;
  copyButton.disabled = password.length === 0;
  renderSuggestions(getSuggestions(password, checks));
}

function randomIndex(maximum) {
  const randomValue = new Uint32Array(1);
  window.crypto.getRandomValues(randomValue);
  return randomValue[0] % maximum;
}

function shuffleCharacters(characters) {
  for (let index = characters.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
  }
  return characters;
}

function generatePassword() {
  const sets = Object.values(characterSets);
  const allCharacters = sets.join('');
  const passwordCharacters = sets.map((set) => set[randomIndex(set.length)]);

  while (passwordCharacters.length < 16) {
    passwordCharacters.push(allCharacters[randomIndex(allCharacters.length)]);
  }

  // Start with one character from every required group, then shuffle their positions.
  passwordInput.value = shuffleCharacters(passwordCharacters).join('');
  copyStatus.textContent = 'A new password was generated locally. Review it before using.';
  analyzePassword();
}

async function copyPassword() {
  if (passwordInput.value.length === 0) return;

  try {
    await navigator.clipboard.writeText(passwordInput.value);
    copyStatus.textContent = 'Password copied!';
  } catch (error) {
    copyStatus.textContent = 'Copy is unavailable here. Select and copy the password manually.';
  }
}

toggleVisibilityButton.addEventListener('click', () => {
  const willShowPassword = passwordInput.type === 'password';
  passwordInput.type = willShowPassword ? 'text' : 'password';
  toggleVisibilityButton.textContent = willShowPassword ? 'Hide' : 'Show';
  toggleVisibilityButton.setAttribute('aria-label', `${willShowPassword ? 'Hide' : 'Show'} password`);
  toggleVisibilityButton.setAttribute('aria-pressed', String(willShowPassword));
});

passwordInput.addEventListener('input', () => {
  copyStatus.textContent = '';
  analyzePassword();
});
generateButton.addEventListener('click', generatePassword);
copyButton.addEventListener('click', copyPassword);
resetButton.addEventListener('click', () => {
  passwordInput.value = '';
  copyStatus.textContent = '';
  passwordInput.type = 'password';
  toggleVisibilityButton.textContent = 'Show';
  toggleVisibilityButton.setAttribute('aria-label', 'Show password');
  toggleVisibilityButton.setAttribute('aria-pressed', 'false');
  analyzePassword();
  passwordInput.focus();
});

analyzePassword();
