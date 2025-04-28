/**
 * JavaScript for the API Integration page
 * 
 * This file contains code that demonstrates how to fetch data from external APIs
 * and cache it in localStorage to improve performance and reduce API calls.
 */

/**
 * Check if stored data is still fresh (within cache duration)
 */
function isDataFresh(timestamp) {
  if (!timestamp) return false;
  
  const now = new Date().getTime();
  const storedTime = parseInt(timestamp);
  
  // Consider data fresh for 30 minutes (1800000 milliseconds)
  const CACHE_DURATION = 30 * 60 * 1000;
  
  return (now - storedTime) < CACHE_DURATION;
}

/**
 * Format a timestamp into a readable date/time
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return 'Never';
  
  const date = new Date(parseInt(timestamp));
  return date.toLocaleString();
}

/**
 * Save API data to localStorage
 */
function saveToLocalStorage(key, data) {
  try {
    // Create an object with the data and current timestamp
    const storageObject = {
      timestamp: new Date().getTime(),
      data: data
    };
    
    // Convert to string and save to localStorage
    localStorage.setItem(`space_api_${key}`, JSON.stringify(storageObject));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Load API data from localStorage
 */
function loadFromLocalStorage(key) {
  try {
    // Get the data from localStorage
    const item = localStorage.getItem(`space_api_${key}`);
    if (!item) return null;
    
    // Parse the JSON string
    const storageObject = JSON.parse(item);
    
    // Check if data is still fresh
    if (isDataFresh(storageObject.timestamp)) {
      return storageObject;
    }
    
    // If data is stale, return null to trigger a refresh
    return null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Fetch data from a space-related API
 */
async function fetchSpaceData(endpoint) {
  // Check if we have fresh data in localStorage
  const storedData = loadFromLocalStorage(endpoint);
  if (storedData) {
    console.log(`Using cached ${endpoint} data`);
    return storedData.data;
  }
  
  // If no fresh data, fetch from API
  try {
    console.log(`Fetching ${endpoint} data from API`);
    
    let url;
    if (endpoint === 'apod') {
      url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';
    } else if (endpoint === 'people') {
      // Try HTTPS first, but this API may only support HTTP
      url = 'https://api.open-notify.org/astros.json';
    } else if (endpoint === 'iss') {
      // Try HTTPS first, but this API may only support HTTP
      url = 'https://api.open-notify.org/iss-now.json';
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Save to localStorage with timestamp
    saveToLocalStorage(endpoint, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // For educational purposes, provide static fallback data
    // This is better than showing an error for the demo
    if (endpoint === 'apod') {
      return {
        title: "Astronomy Picture of the Day",
        date: new Date().toISOString().split('T')[0],
        explanation: "This is a fallback explanation. The NASA APOD API may be unavailable or rate-limited. In a real application, you should handle these errors gracefully and provide proper user feedback.",
        media_type: "image",
        url: "https://apod.nasa.gov/apod/image/2008/PerseidsPanoramic_Sarhosseini_1100.jpg"
      };
    } else if (endpoint === 'people') {
      return {
        number: 7,
        people: [
          { name: "Mark Vande Hei", craft: "ISS" },
          { name: "Oleg Novitskiy", craft: "ISS" },
          { name: "Pyotr Dubrov", craft: "ISS" },
          { name: "Thomas Pesquet", craft: "ISS" },
          { name: "Megan McArthur", craft: "ISS" },
          { name: "Shane Kimbrough", craft: "ISS" },
          { name: "Akihiko Hoshide", craft: "ISS" }
        ],
        message: "Note: This is fallback data for educational purposes. The API might be unavailable."
      };
    } else if (endpoint === 'iss') {
      return {
        iss_position: {
          latitude: "35.9535",
          longitude: "-118.2366"
        },
        message: "Note: This is fallback data for educational purposes. The API might be unavailable.",
        timestamp: Date.now()
      };
    }
    
    return null;
  }
}

/**
 * Update the UI with NASA Astronomy Picture of the Day data
 */
function displayApodData(data) {
  const container = document.getElementById('apod-container');
  if (!container) return;
  
  if (!data) {
    container.innerHTML = `
      <div class="alert alert-warning">
        Unable to fetch NASA APOD data. Please try again later.
      </div>
    `;
    return;
  }
  
  // Get the stored timestamp
  const storedData = JSON.parse(localStorage.getItem(`space_api_apod`));
  const timestamp = storedData ? storedData.timestamp : null;
  
  let html = `
    <h3>${data.title}</h3>
    <p class="data-timestamp text-muted">Data fetched: ${formatTimestamp(timestamp)}</p>
  `;
  
  // Add image if available
  if (data.media_type === 'image') {
    html += `
      <div class="image-container">
        <img src="${data.url}" alt="${data.title}" class="img-fluid">
      </div>
    `;
  } else if (data.media_type === 'video') {
    html += `
      <div class="ratio ratio-16x9 mb-3">
        <iframe src="${data.url}" allowfullscreen></iframe>
      </div>
    `;
  }
  
  // Add description
  html += `
    <p class="mt-3">${data.explanation}</p>
    <div class="text-muted mt-3">
      <small>Date: ${data.date}</small>
      ${data.copyright ? `<small class="ms-3">Copyright: ${data.copyright}</small>` : ''}
    </div>
  `;
  
  container.innerHTML = html;
}

/**
 * Update the UI with people in space data
 */
function displayPeopleData(data) {
  const container = document.getElementById('people-container');
  if (!container) return;
  
  if (!data) {
    container.innerHTML = `
      <div class="alert alert-warning">
        Unable to fetch people in space data. Please try again later.
      </div>
    `;
    return;
  }
  
  // Get the stored timestamp
  const storedData = JSON.parse(localStorage.getItem(`space_api_people`));
  const timestamp = storedData ? storedData.timestamp : null;
  
  let html = `
    <h3>${data.number} People in Space</h3>
    <p class="data-timestamp text-muted">Data fetched: ${formatTimestamp(timestamp)}</p>
  `;
  
  if (data.people && data.people.length > 0) {
    html += '<ul class="list-group">';
    
    data.people.forEach(person => {
      html += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <span>
            <i class="fas fa-user-astronaut me-2"></i>
            ${person.name}
          </span>
          <span class="badge bg-primary rounded-pill">${person.craft}</span>
        </li>
      `;
    });
    
    html += '</ul>';
  } else {
    html += '<p>No people in space information available.</p>';
  }
  
  container.innerHTML = html;
}

/**
 * Update the UI with ISS location data
 */
function displayIssData(data) {
  const container = document.getElementById('iss-container');
  if (!container) return;
  
  if (!data) {
    container.innerHTML = `
      <div class="alert alert-warning">
        Unable to fetch ISS location data. Please try again later.
      </div>
    `;
    return;
  }
  
  // Get the stored timestamp
  const storedData = JSON.parse(localStorage.getItem(`space_api_iss`));
  const timestamp = storedData ? storedData.timestamp : null;
  
  try {
    const latitude = parseFloat(data.iss_position.latitude).toFixed(4);
    const longitude = parseFloat(data.iss_position.longitude).toFixed(4);
    
    let html = `
      <h3>ISS Current Location</h3>
      <p class="data-timestamp text-muted">Data fetched: ${formatTimestamp(timestamp)}</p>
      
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <h5>Latitude</h5>
                <p class="display-6">${latitude}°</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <h5>Longitude</h5>
                <p class="display-6">${longitude}°</p>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-3">
            <a href="https://spotthestation.nasa.gov/tracking_map.cfm" 
               class="btn btn-primary" target="_blank">
              View on NASA Tracking Map
            </a>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = `
      <div class="alert alert-warning">
        Error parsing ISS location data. Please try again later.
      </div>
    `;
  }
}

/**
 * Handle fetching and displaying data based on the selected endpoint
 */
async function handleApiFetch(endpoint) {
  // Get the container
  const container = document.getElementById(`${endpoint}-container`);
  if (!container) return;
  
  // Show loading state
  container.innerHTML = `
    <div class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading ${endpoint} data...</p>
    </div>
  `;
  
  // Fetch the data
  const data = await fetchSpaceData(endpoint);
  
  // Display based on endpoint
  if (endpoint === 'apod') {
    displayApodData(data);
  } else if (endpoint === 'people') {
    displayPeopleData(data);
  } else if (endpoint === 'iss') {
    displayIssData(data);
  }
}

/**
 * Clear all stored space data from localStorage
 */
function clearStoredData() {
  // Remove all space API related items
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('space_api_')) {
      localStorage.removeItem(key);
    }
  });
  
  // Show toast notification
  displayToast('All stored API data cleared!', 'warning');
  
  // Reload all data
  handleApiFetch('apod');
  handleApiFetch('people');
  handleApiFetch('iss');
}

/**
 * Display a toast notification
 */
function displayToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  
  // Create toast content
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close">&times;</button>
  `;
  
  // Add to container
  const container = document.getElementById('toast-container');
  container.appendChild(toast);
  
  // Add close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    container.removeChild(toast);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (container.contains(toast)) {
      container.removeChild(toast);
    }
  }, 5000);
}

// When the page loads, initialize the API demo
document.addEventListener('DOMContentLoaded', function() {
  // Fetch data for all endpoints
  handleApiFetch('apod');
  handleApiFetch('people');
  handleApiFetch('iss');
  
  // Add event listeners for refresh buttons
  const refreshButtons = document.querySelectorAll('.refresh-btn');
  refreshButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const endpoint = e.target.closest('button').dataset.endpoint;
      
      // Clear this endpoint data from localStorage
      localStorage.removeItem(`space_api_${endpoint}`);
      
      // Fetch fresh data
      handleApiFetch(endpoint);
      
      // Show toast notification
      displayToast(`Refreshing ${endpoint} data...`, 'success');
    });
  });
  
  // Add event listener for clear data button
  const clearButton = document.getElementById('clear-api-data');
  if (clearButton) {
    clearButton.addEventListener('click', clearStoredData);
  }
});