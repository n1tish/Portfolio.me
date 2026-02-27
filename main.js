/**
 * main.js
 * 
 * Handles interaction logic for the Nitish Upadhyay portfolio website.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------
     * Typewriter Animation for Hero Title
     * ---------------------------------------------------- */
    const greetingEl = document.querySelector('.hero-title .greeting');
    const nameEl = document.querySelector('.hero-title .name');

    if (greetingEl && nameEl) {
        const greetingText = "Hi, I am";
        const nameText = "Nitish Upadhyay";

        // Clear initial text
        greetingEl.textContent = '';
        nameEl.textContent = '';

        let i = 0;
        let j = 0;
        const typingSpeed = 100; // ms per character

        // Add cursor to greeting initially
        greetingEl.classList.add('typing-cursor');

        function typeGreeting() {
            if (i < greetingText.length) {
                greetingEl.textContent += greetingText.charAt(i);
                i++;
                setTimeout(typeGreeting, typingSpeed);
            } else {
                // Remove cursor from greeting, add to name
                greetingEl.classList.remove('typing-cursor');
                nameEl.classList.add('typing-cursor');
                // Wait slightly before starting the name
                setTimeout(typeName, 500);
            }
        }

        function typeName() {
            if (j < nameText.length) {
                nameEl.textContent += nameText.charAt(j);
                j++;
                setTimeout(typeName, typingSpeed);
            }
        }

        // Start after a short initial delay
        setTimeout(typeGreeting, 800);
    }

    /* ----------------------------------------------------
     * Mobile Navigation Toggle
     * ---------------------------------------------------- */
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksEl = document.querySelector('.nav-links');

    if (navToggle && navLinksEl) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinksEl.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a nav link is clicked
        navLinksEl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksEl.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


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
