/**
 * JavaScript for the Cookies page
 * 
 * This file contains the client-side functionality for the cookies demo.
 * It shows how to work with cookies using JavaScript.
 */

/**
 * Display a toast notification with a message
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

/**
 * Display a cookie as a visual element in the browser
 */
function displayCookieVisual(name, value) {
  // Create cookie element
  const cookie = document.createElement('div');
  cookie.className = 'cookie';
  
  // Add cookie content
  cookie.innerHTML = `
    <span class="cookie-name">${name}</span>
    <span class="cookie-value">${value}</span>
    <form action="/cookies/delete/${name}" method="POST" class="mt-2">
      <button type="submit" class="btn btn-sm btn-danger">
        <i class="fas fa-times"></i>
      </button>
    </form>
  `;
  
  // Add to cookie jar
  const cookieJar = document.querySelector('.cookie-jar');
  if (cookieJar) {
    cookieJar.appendChild(cookie);
  }
}

/**
 * Set a cookie using JavaScript
 */
function setCookie(name, value, days = 7) {
  // Create an expiration date
  const date = new Date();
  date.setDate(date.getDate() + days);
  
  // Set the cookie with name, value, expiration and path
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  
  // Display success message
  displayToast(`Cookie "${name}" set successfully!`, 'success');
  
  // Update UI without page reload (for demonstration purposes)
  if (document.querySelector('.cookie-jar')) {
    displayCookieVisual(name, value);
  }
}

/**
 * Get a cookie by name
 */
function getCookie(name) {
  // Split all cookies into individual name=value strings
  const cookies = document.cookie.split(';');
  
  // Loop through cookies to find the one we want
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + '=')) {
      // Return just the value part
      return cookie.substring(name.length + 1);
    }
  }
  
  // Return null if cookie not found
  return null;
}

/**
 * Delete a cookie by name
 */
function deleteCookie(name) {
  // To delete a cookie, set its expiration to a past date
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  
  // Display success message
  displayToast(`Cookie "${name}" deleted successfully!`, 'success');
}

// When the page loads, initialize the cookie demo
document.addEventListener('DOMContentLoaded', function() {
  // Add event listener to manual cookie creation form
  const cookieForm = document.querySelector('form');
  if (cookieForm) {
    cookieForm.addEventListener('submit', function(e) {
      // Don't submit the form - we'll handle it with JavaScript
      e.preventDefault();
      
      // Get values from form
      const name = document.getElementById('name').value;
      const value = document.getElementById('value').value;
      const expiration = document.getElementById('expiration').value;
      
      // Basic validation
      if (!name || !value) {
        displayToast('Name and value are required', 'error');
        return;
      }
      
      // Set the cookie
      setCookie(name, value, parseInt(expiration) || 7);
      
      // Reset form
      cookieForm.reset();
      
      // Submit the form to server as well (to keep server-side cookies in sync)
      // This will cause a page reload
      this.submit();
    });
  }
  
  // Check if there's a message to display (from server-side)
  const message = document.querySelector('.alert');
  if (message) {
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      const closeBtn = message.querySelector('.btn-close');
      if (closeBtn) {
        closeBtn.click();
      }
    }, 5000);
  }
});