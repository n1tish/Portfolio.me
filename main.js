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
     * Products Carousel
     * ---------------------------------------------------- */
    const carouselViewport = document.getElementById('carouselViewport');
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrevBtn = document.getElementById('carouselPrev');
    const carouselNextBtn = document.getElementById('carouselNext');
    const carouselDotsEl = document.getElementById('carouselDots');

    if (carouselViewport && carouselTrack) {
        const cards = Array.from(carouselTrack.children);
        let currentIndex = 0;
        let autoplayTimer = null;
        const GAP = 24;

        function getVisibleCount() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function getMaxIndex() {
            return Math.max(0, cards.length - getVisibleCount());
        }

        function applyCardWidths() {
            const visibleCount = getVisibleCount();
            const viewportWidth = carouselViewport.getBoundingClientRect().width;
            const cardWidth = (viewportWidth - GAP * (visibleCount - 1)) / visibleCount;
            cards.forEach(card => { card.style.width = `${cardWidth}px`; });
            return cardWidth;
        }

        function buildDots() {
            carouselDotsEl.innerHTML = '';
            const max = getMaxIndex();
            for (let i = 0; i <= max; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
                carouselDotsEl.appendChild(dot);
            }
        }

        function updateUI(index) {
            carouselDotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            if (carouselPrevBtn) carouselPrevBtn.disabled = index === 0;
            if (carouselNextBtn) carouselNextBtn.disabled = index >= getMaxIndex();
        }

        function goTo(index) {
            index = Math.max(0, Math.min(index, getMaxIndex()));
            const cardWidth = applyCardWidths();
            carouselTrack.style.transform = `translateX(-${index * (cardWidth + GAP)}px)`;
            currentIndex = index;
            updateUI(index);
        }

        function startAutoplay() {
            autoplayTimer = setInterval(() => {
                goTo(currentIndex >= getMaxIndex() ? 0 : currentIndex + 1);
            }, 4000);
        }

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            startAutoplay();
        }

        if (carouselPrevBtn) {
            carouselPrevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoplay(); });
        }
        if (carouselNextBtn) {
            carouselNextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoplay(); });
        }

        carouselViewport.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        carouselViewport.addEventListener('mouseleave', () => { clearInterval(autoplayTimer); startAutoplay(); });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                buildDots();
                goTo(Math.min(currentIndex, getMaxIndex()));
            }, 150);
        });

        // Init
        buildDots();
        goTo(0);
        startAutoplay();
    }

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
