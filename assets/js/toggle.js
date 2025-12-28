(function() {
  'use strict';

  /**
   * Initialize toggle functionality for post titles
   */
  function initToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-titles');
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        const postItem = this.closest('.post-item');
        const titlesDiv = postItem.querySelector('.post-titles');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle state
        if (isExpanded) {
          // Collapse
          this.setAttribute('aria-expanded', 'false');
          titlesDiv.classList.add('collapsed');
        } else {
          // Expand
          this.setAttribute('aria-expanded', 'true');
          titlesDiv.classList.remove('collapsed');
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }
})();
