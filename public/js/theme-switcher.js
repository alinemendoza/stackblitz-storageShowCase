/**
 * Theme Switcher - localStorage Example
 * 
 * This file demonstrates how to use localStorage to save user theme preferences.
 * The code allows users to switch between different visual themes and remembers
 * their choice even after they close the browser.
 */

// Define available themes
const themes = [
  'light',
  'dark',
  'high-contrast',
  'colorful'
];

// The localStorage key we'll use to store the theme
const THEME_STORAGE_KEY = 'preferred-theme';

/**
 * Initialize the theme switcher 
 * This runs when the page loads
 */
function initThemeSwitcher() {
  // Create the theme switcher UI
  createThemeSwitcherUI();
  
  // Load and apply saved theme from localStorage
  loadSavedTheme();
  
  // Add event listeners to theme options
  addThemeSwitcherListeners();
  
  // Display localStorage info for the theme in the debug panel (if it exists)
  updateThemeDebugInfo();
}

/**
 * Create the theme switcher UI elements
 */
function createThemeSwitcherUI() {
  // Create container for theme switcher
  const container = document.createElement('div');
  container.className = 'theme-switcher';
  container.innerHTML = '<p class="me-2">Theme:</p>';
  
  // Create theme option buttons
  themes.forEach(theme => {
    const option = document.createElement('div');
    option.className = `theme-option theme-${theme}-option`;
    option.dataset.theme = theme;
    option.title = `${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`;
    container.appendChild(option);
  });
  
  // Add the theme switcher to the navigation
  const navbarEnd = document.querySelector('.navbar-nav');
  if (navbarEnd) {
    const li = document.createElement('li');
    li.className = 'nav-item theme-switcher-container';
    li.appendChild(container);
    navbarEnd.appendChild(li);
  }
}

/**
 * Load the saved theme from localStorage and apply it
 */
function loadSavedTheme() {
  // Try to get saved theme from localStorage
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  
  // If a theme was saved, apply it
  if (savedTheme && themes.includes(savedTheme)) {
    applyTheme(savedTheme);
  } else {
    // Otherwise, use the default theme
    applyTheme('light');
  }
}

/**
 * Apply a theme to the document
 * @param {string} theme - The theme to apply
 */
function applyTheme(theme) {
  // Remove all theme classes from body
  themes.forEach(t => {
    document.body.classList.remove(`theme-${t}`);
  });
  
  // Add the selected theme class
  document.body.classList.add(`theme-${theme}`);
  
  // Update the active state of theme options
  updateActiveThemeOption(theme);
  
  // Log to console
  console.log(`Theme applied: ${theme}`);
}

/**
 * Save the selected theme to localStorage
 * @param {string} theme - The theme to save
 */
function saveTheme(theme) {
  // Save to localStorage
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  // Show a toast notification if the function exists
  if (typeof displayToast === 'function') {
    displayToast(`Theme preference saved: ${theme}`, 'info');
  }
  
  // Update debug info
  updateThemeDebugInfo();
}

/**
 * Add click event listeners to theme option buttons
 */
function addThemeSwitcherListeners() {
  // Get all theme option elements
  const options = document.querySelectorAll('.theme-option');
  
  // Add click listener to each
  options.forEach(option => {
    option.addEventListener('click', function() {
      const theme = this.dataset.theme;
      applyTheme(theme);
      saveTheme(theme);
    });
  });
}

/**
 * Update the active state of theme option buttons
 * @param {string} activeTheme - The currently active theme
 */
function updateActiveThemeOption(activeTheme) {
  // Remove active class from all options
  const options = document.querySelectorAll('.theme-option');
  options.forEach(option => {
    option.classList.remove('active');
  });
  
  // Add active class to the selected theme
  const activeOption = document.querySelector(`.theme-option[data-theme="${activeTheme}"]`);
  if (activeOption) {
    activeOption.classList.add('active');
  }
}

/**
 * Update the theme debug information in the localStorage demo panel
 */
function updateThemeDebugInfo() {
  // Get the theme debug element if it exists
  const themeDebugElement = document.getElementById('theme-localStorage-debug');
  if (!themeDebugElement) return;
  
  // Get current theme data
  const themeData = localStorage.getItem(THEME_STORAGE_KEY);
  
  // Update the debug element
  themeDebugElement.textContent = themeData || 'No theme saved';
}

/**
 * Reset the theme to default and clear from localStorage
 */
function resetTheme() {
  // Remove theme from localStorage
  localStorage.removeItem(THEME_STORAGE_KEY);
  
  // Apply default theme
  applyTheme('light');
  
  // Update debug info
  updateThemeDebugInfo();
  
  // Show toast notification if available
  if (typeof displayToast === 'function') {
    displayToast('Theme reset to default', 'info');
  }
}

// Initialize the theme switcher when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initThemeSwitcher);