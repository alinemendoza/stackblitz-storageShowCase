/**
 * Main JavaScript file for Web Storage Explorer
 * 
 * This file contains common functionality used across the site.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Setup functionality
  setupMobileNav();
  setupAlertDismissal();
});

/**
 * Sets up mobile navigation menu toggle
 */
function setupMobileNav() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
      const target = document.querySelector(this.getAttribute('data-bs-target'));
      if (target) {
        target.classList.toggle('show');
      }
    });
  }
}

/**
 * Sets up automatic dismissal of alert messages after a timeout
 */
function setupAlertDismissal() {
  // Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
  alerts.forEach(alert => {
    setTimeout(() => {
      const closeBtn = alert.querySelector('.btn-close');
      if (closeBtn) {
        closeBtn.click();
      }
    }, 5000);
  });
}