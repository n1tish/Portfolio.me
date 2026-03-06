/**
 * main.js
 * Portfolio — Cinematic Motion
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       Lucide Icons
       ========================================================= */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* =========================================================
       Section 0: Guards
       ========================================================= */
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IS_TOUCH = window.matchMedia('(hover: none)').matches;

    /* =========================================================
       Section 1: Lenis + GSAP Integration
       ========================================================= */
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* =========================================================
       Section 2: Page Loader + Hero Animation
       ========================================================= */
    function initHeroAnimation() {
        if (REDUCED) return;

        const heroLines = document.querySelectorAll('.hero-title .line-inner');
        const tagline = document.querySelector('.tagline');
        const ctas = document.querySelector('.hero-ctas');

        gsap.set(heroLines, { yPercent: 110 });
        gsap.set([tagline, ctas], { opacity: 0, y: 16 });

        const tl = gsap.timeline();
        tl.to(heroLines, { yPercent: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' })
            .to(tagline, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
            .to(ctas, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    }

    const loaderTl = gsap.timeline();
    loaderTl
        .to('.loader-logo', { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' })
        .to('#loader', {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            delay: 0.3,
            onComplete: () => {
                const loader = document.getElementById('loader');
                if (loader) loader.style.display = 'none';
                initHeroAnimation();
            }
        });

    /* =========================================================
       Section 3: Scroll Progress Bar
       ========================================================= */
    gsap.to('.scroll-progress', {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });

    /* =========================================================
       Section 4: Custom Cursor (desktop only)
       ========================================================= */
    if (!IS_TOUCH) {
        document.body.classList.add('no-touch');

        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
            gsap.set(dot, { x: mx, y: my });
        });

        function tickCursor() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            gsap.set(ring, { x: rx, y: ry });
            requestAnimationFrame(tickCursor);
        }
        tickCursor();

        document.querySelectorAll('a, button, .key, .product-card, .skill-card, .case-card').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
        });
    }

    /* =========================================================
       Section 5: Magnetic Buttons (desktop only)
       ========================================================= */
    if (!IS_TOUCH) {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    /* =========================================================
       Section 6: Section Headline Text Reveals
       ========================================================= */
    function splitAndReveal(selector, triggerEl) {
        const el = document.querySelector(selector);
        if (!el || REDUCED) return;

        const words = el.textContent.trim().split(' ');
        el.innerHTML = words
            .map(w => `<span class="line-outer"><span class="line-inner">${w}</span></span>`)
            .join(' ');

        const inners = el.querySelectorAll('.line-inner');
        gsap.set(inners, { yPercent: 110 });
        gsap.to(inners, {
            yPercent: 0,
            stagger: 0.07,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: triggerEl || el, start: 'top 85%' }
        });
    }

    ['#about', '#works', '#case-studies', '#products', '#contact'].forEach(id => {
        const sec = document.querySelector(id);
        if (sec) splitAndReveal(`${id} .section-title`, sec);
    });

    /* =========================================================
       Section 7: Section Container Fade-Ins (replaces IntersectionObserver)
       ========================================================= */
    if (!REDUCED) {
        document.querySelectorAll('.scroll-section .section-container').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                y: 30,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 85%' }
            });
        });
    }

    /* =========================================================
       Section 8: About — Bio + Skill Cards
       ========================================================= */
    const aboutText = document.querySelector('.about-text');
    if (aboutText && !REDUCED) {
        gsap.from(aboutText, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: aboutText, start: 'top 85%' }
        });
    }

    if (!REDUCED) {
        gsap.from('.skill-card', {
            opacity: 0,
            y: 32,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' }
        });
    }

    if (!IS_TOUCH) {
        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                gsap.to(card, {
                    rotateX: -y * 10,
                    rotateY: x * 10,
                    duration: 0.4,
                    ease: 'power2.out',
                    transformPerspective: 800
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
            });
        });
    }

    /* =========================================================
       Section 9: Work — Timeline Line + Items + Counters
       ========================================================= */
    const timelineContainer = document.querySelector('#works .timeline-container');
    if (timelineContainer) {
        gsap.from('.timeline-line', {
            scaleY: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: timelineContainer,
                start: 'top 80%',
                end: 'bottom 80%',
                scrub: 1
            }
        });
    }

    document.querySelectorAll('#works .timeline-item').forEach((item, i) => {
        if (!REDUCED) {
            gsap.from(item, {
                opacity: 0,
                x: i % 2 === 0 ? -40 : 40,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: item, start: 'top 85%' }
            });
        }
        ScrollTrigger.create({
            trigger: item,
            start: 'top 70%',
            onEnter: () => item.classList.add('is-active')
        });
    });

    document.querySelectorAll('.counter').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.target.includes('.');
        const obj = { val: 0 };

        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(obj, {
                    val: target,
                    duration: 1.8,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = isDecimal
                            ? obj.val.toFixed(1)
                            : Math.round(obj.val);
                    }
                });
            }
        });
    });

    /* =========================================================
       Section 10: Case Study Cards
       ========================================================= */
    const caseGrid = document.querySelector('.case-grid');
    if (caseGrid && !REDUCED) {
        gsap.from('.case-card', {
            opacity: 0,
            y: 48,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: caseGrid, start: 'top 80%' }
        });
    }

    /* =========================================================
       Section 11: Products — Spotlight + 3D Tilt
       ========================================================= */
    if (!IS_TOUCH) {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--sx', `${e.clientX - r.left}px`);
                card.style.setProperty('--sy', `${e.clientY - r.top}px`);

                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                gsap.to(card, {
                    rotateX: -y * 8,
                    rotateY: x * 8,
                    duration: 0.4,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
            });
        });
    }

    /* =========================================================
       Section 12: Nav Active Indicator
       ========================================================= */
    const navLinkEls = document.querySelectorAll('.nav-links a');
    const indicator = document.querySelector('.nav-indicator');
    const sectionIds = ['#about', '#works', '#case-studies', '#products', '#contact'];

    function setIndicator(link) {
        if (!link || !indicator) return;
        const navLinks = link.closest('.nav-links');
        if (!navLinks) return;
        const r = link.getBoundingClientRect();
        const navR = navLinks.getBoundingClientRect();
        gsap.to(indicator, {
            left: r.left - navR.left,
            width: r.width,
            duration: 0.35,
            ease: 'power2.inOut'
        });
    }

    sectionIds.forEach((id, i) => {
        const sec = document.querySelector(id);
        if (!sec) return;
        ScrollTrigger.create({
            trigger: sec,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setIndicator(navLinkEls[i]),
            onEnterBack: () => setIndicator(navLinkEls[i])
        });
    });

    /* =========================================================
       Section 13: Hero Parallax
       ========================================================= */
    const heroLeft = document.querySelector('.hero-left');
    if (heroLeft) {
        gsap.to(heroLeft, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    /* =========================================================
       Section 14: Products Carousel (GSAP-powered)
       ========================================================= */
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
            gsap.to(carouselTrack, {
                x: -(index * (cardWidth + GAP)),
                duration: 0.7,
                ease: 'power3.out'
            });
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

        buildDots();
        goTo(0);
        startAutoplay();
    }

    /* =========================================================
       Section 15: Mobile Navigation Toggle
       ========================================================= */
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* =========================================================
       Section 16: Smooth Scroll via Lenis
       ========================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                lenis.scrollTo(0);
                return;
            }
            const target = document.getElementById(href.substring(1));
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -52 });
            }
        });
    });

});
