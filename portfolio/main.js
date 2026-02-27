/**
 * main.js
 * 
 * Handles interaction logic for the Nitish Upadhyay portfolio website.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------
     * Smooth Scrolling for Navigation Links
     * ---------------------------------------------------- */
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add simple smooth scroll behavior handling fixed nav offset
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target element 
            const targetId = link.getAttribute('href').substring(1);
            const targetBlock = document.getElementById(targetId);
            
            if (targetBlock) {
                // Get accurate offset minus fixed navbar
                const navbarHeight = 52; 
                const targetPosition = targetBlock.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ----------------------------------------------------
     * Intersection Observer: Scroll Into View Fade Ins
     * ---------------------------------------------------- */
    // Select all section containers indicating a new section begins
    const sections = document.querySelectorAll('.scroll-section .section-container');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // Play when 15% is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Once in view, we add a class
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Unobserver after appearing once so it doesn't replay on scroll up
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});
