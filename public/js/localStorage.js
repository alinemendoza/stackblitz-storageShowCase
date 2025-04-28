/**
 * LocalStorage Demo JS
 * 
 * This file contains the JavaScript code to demonstrate how to use
 * localStorage for storing various types of data.
 */

// Keys for localStorage
const SETTINGS_KEY = 'game-settings';
const HIGH_SCORES_KEY = 'high-scores';

// When the document is ready
document.addEventListener('DOMContentLoaded', function() {
  // Load data from localStorage
  loadSettings();
  loadHighScores();
  
  // Setup toast dismiss
  document.querySelectorAll('.toast .btn-close').forEach(button => {
    button.addEventListener('click', function() {
      const toast = this.closest('.toast');
      const bsToast = bootstrap.Toast.getInstance(toast);
      if (bsToast) {
        bsToast.hide();
      }
    });
  });
});

/**
 * Load settings from localStorage and populate the form
 */
function loadSettings() {
  // Get settings from localStorage with default values
  const defaultSettings = {
    difficulty: 'medium',
    volume: 75,
    notifications: true
  };
  
  // Try to get saved settings
  const savedSettings = localStorage.getItem(SETTINGS_KEY);
  let settings = defaultSettings;
  
  if (savedSettings) {
    try {
      // Parse saved settings
      settings = JSON.parse(savedSettings);
      console.log('Settings loaded from localStorage:', settings);
    } catch (error) {
      console.error('Error parsing settings:', error);
    }
  } else {
    console.log('No saved settings found, using defaults');
  }
  
  // Display settings in the form
  displaySettings(settings);
}

/**
 * Save settings from the form to localStorage
 */
function saveSettings() {
  // Get values from form
  const settings = {
    difficulty: document.getElementById('difficulty').value,
    volume: parseInt(document.getElementById('volume').value),
    notifications: document.getElementById('notifications').checked
  };
  
  try {
    // Convert to JSON string and save to localStorage
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    console.log('Settings saved:', settings);
    
    // Show success message
    displayToast('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    displayToast('Error saving settings', 'error');
  }
}

/**
 * Display settings in the form
 */
function displaySettings(settings) {
  document.getElementById('difficulty').value = settings.difficulty || 'medium';
  document.getElementById('volume').value = settings.volume || 75;
  document.getElementById('notifications').checked = settings.notifications !== undefined ? settings.notifications : true;
}

/**
 * Reset settings to defaults
 */
function resetSettings() {
  const defaultSettings = {
    difficulty: 'medium',
    volume: 75,
    notifications: true
  };
  
  // Remove from localStorage
  localStorage.removeItem(SETTINGS_KEY);
  
  // Display default settings in the form
  displaySettings(defaultSettings);
  
  // Show message
  displayToast('Settings reset to default', 'info');
}

/**
 * Load high scores from localStorage and display them
 */
function loadHighScores() {
  // Try to get high scores from localStorage
  const savedScores = localStorage.getItem(HIGH_SCORES_KEY);
  let scores = [];
  
  if (savedScores) {
    try {
      // Parse scores
      scores = JSON.parse(savedScores);
      console.log('High scores loaded:', scores);
    } catch (error) {
      console.error('Error parsing high scores:', error);
    }
  } else {
    console.log('No high scores found');
  }
  
  // Display scores in the table
  displayHighScores(scores);
}

/**
 * Save a new high score to localStorage
 */
function saveHighScore() {
  // Get values from form
  const playerName = document.getElementById('playerName').value.trim();
  const score = parseInt(document.getElementById('score').value);
  const level = parseInt(document.getElementById('level').value);
  
  // Basic validation
  if (!playerName) {
    displayToast('Please enter a player name', 'warning');
    return;
  }
  
  if (isNaN(score) || score < 0) {
    displayToast('Please enter a valid score', 'warning');
    return;
  }
  
  if (isNaN(level) || level < 1 || level > 10) {
    displayToast('Please enter a level between 1 and 10', 'warning');
    return;
  }
  
  // Create new score object
  const newScore = {
    player: playerName,
    score: score,
    level: level,
    date: new Date().toLocaleDateString()
  };
  
  // Get existing scores
  let scores = [];
  const savedScores = localStorage.getItem(HIGH_SCORES_KEY);
  
  if (savedScores) {
    try {
      scores = JSON.parse(savedScores);
    } catch (error) {
      console.error('Error parsing existing scores:', error);
    }
  }
  
  // Add new score
  scores.push(newScore);
  
  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);
  
  // Keep only top 10 scores
  if (scores.length > 10) {
    scores = scores.slice(0, 10);
  }
  
  // Save to localStorage
  try {
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
    
    // Clear form
    document.getElementById('playerName').value = '';
    document.getElementById('score').value = '';
    document.getElementById('level').value = '';
    
    // Update displayed scores
    displayHighScores(scores);
    
    // Show success message
    displayToast('High score added!', 'success');
  } catch (error) {
    console.error('Error saving high scores:', error);
    displayToast('Error saving high score', 'error');
  }
}

/**
 * Display high scores in the table
 */
function displayHighScores(scores) {
  const tableBody = document.getElementById('highScoresTable');
  
  // Clear existing content
  tableBody.innerHTML = '';
  
  if (scores.length === 0) {
    // No scores to display
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4" class="text-center">No high scores yet</td>';
    tableBody.appendChild(row);
    return;
  }
  
  // Add each score as a row
  scores.forEach((score, index) => {
    const row = document.createElement('tr');
    
    // Highlight the top score
    if (index === 0) {
      row.className = 'table-warning';
    }
    
    row.innerHTML = `
      <td>${score.player}</td>
      <td>${score.score}</td>
      <td>${score.level}</td>
      <td>${score.date}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

/**
 * Clear all high scores from localStorage
 */
function clearHighScores() {
  // Remove from localStorage
  localStorage.removeItem(HIGH_SCORES_KEY);
  
  // Update displayed scores
  displayHighScores([]);
  
  // Show message
  displayToast('All high scores cleared', 'info');
}

/**
 * Display a toast notification with a message
 */
function displayToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastBody = toast.querySelector('.toast-body');
  
  // Set message and styling
  toastBody.textContent = message;
  
  // Remove existing color classes
  toast.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning', 'text-bg-info');
  
  // Add appropriate color class based on type
  switch (type) {
    case 'success':
      toast.classList.add('text-bg-success');
      break;
    case 'error':
      toast.classList.add('text-bg-danger');
      break;
    case 'warning':
      toast.classList.add('text-bg-warning');
      break;
    default:
      toast.classList.add('text-bg-info');
  }
  
  // Show the toast
  const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
  bsToast.show();
}