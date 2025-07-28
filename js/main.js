// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (for future mobile navigation)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Skill dropdown functionality
    const skillDropdowns = document.querySelectorAll('.skill-item-dropdown');
    
    skillDropdowns.forEach(dropdown => {
        const header = dropdown.querySelector('.skill-header');
        
        header.addEventListener('click', function() {
            // Close other dropdowns
            skillDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });
    
    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(45, 45, 45, 0.95)';
        } else {
            nav.style.background = '#2d2d2d';
        }
    });
});