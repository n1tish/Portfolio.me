/**
 * case-study.js
 * Animations and interactivity for all case study pages.
 * Mirrors the animation system in main.js for visual consistency.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       Lucide Icons
       ========================================================= */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* =========================================================
       Guards
       ========================================================= */
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const IS_TOUCH = window.matchMedia('(hover: none)').matches;

    /* =========================================================
       Lenis + GSAP Integration
       ========================================================= */
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* =========================================================
       Scroll Progress Bar
       ========================================================= */
    gsap.to('#scrollProgress', {
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
       Custom Cursor (desktop only)
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

        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
        });
    }

    /* =========================================================
       Page Loader + Hero Animation
       ========================================================= */

    // Split cs-title into word spans before loader hides (so initial state is set)
    const csTitle = document.querySelector('.cs-title');
    if (csTitle && !REDUCED) {
        const words = csTitle.textContent.trim().split(' ');
        csTitle.innerHTML = words
            .map(w => `<span class="line-outer"><span class="line-inner">${w}</span></span>`)
            .join(' ');
        gsap.set(csTitle.querySelectorAll('.line-inner'), { yPercent: 110 });
    }

    function initHeroAnimation() {
        if (REDUCED) return;

        const eyebrow = document.querySelector('.cs-eyebrow');
        const titleInners = document.querySelectorAll('.cs-title .line-inner');
        const subtitle = document.querySelector('.cs-subtitle');
        const metrics = document.querySelector('.cs-metrics-strip');
        const heroImg = document.querySelector('.cs-hero-image');

        if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 12 });
        if (subtitle) gsap.set(subtitle, { opacity: 0, y: 16 });
        if (metrics) gsap.set(metrics, { opacity: 0, y: 16 });
        if (heroImg) gsap.set(heroImg, { opacity: 0, y: 24 });

        const tl = gsap.timeline();

        if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0);
        if (titleInners.length) {
            tl.to(titleInners, { yPercent: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 0.1);
        }
        if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
        if (metrics) tl.to(metrics, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
        if (heroImg) tl.to(heroImg, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.3');
    }

    initHeroAnimation();

    /* =========================================================
       Section Title Word Reveals
       ========================================================= */
    document.querySelectorAll('.cs-section-title').forEach(el => {
        if (REDUCED) return;
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
            scrollTrigger: { trigger: el, start: 'top 85%' }
        });
    });

    /* =========================================================
       Section Content Fade-Ins
       ========================================================= */
    if (!REDUCED) {

        // Section labels
        document.querySelectorAll('.cs-section-label').forEach(el => {
            gsap.from(el, {
                opacity: 0, y: 12, duration: 0.5, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%' }
            });
        });

        // Body text paragraphs
        document.querySelectorAll('.cs-body-text').forEach(el => {
            gsap.from(el, {
                opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%' }
            });
        });

        // Callouts — slide in from left
        document.querySelectorAll('.cs-callout').forEach(el => {
            gsap.from(el, {
                opacity: 0, x: -16, duration: 0.6, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%' }
            });
        });

        // Numbered steps
        document.querySelectorAll('.cs-step').forEach(el => {
            gsap.from(el, {
                opacity: 0, y: 24, duration: 0.6, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%' }
            });
        });

        // Info cards and outcome cards — staggered per group
        document.querySelectorAll('.cs-cards, .cs-outcomes').forEach(group => {
            const items = group.querySelectorAll('.cs-card, .cs-outcome-card');
            if (items.length) {
                gsap.from(items, {
                    opacity: 0, y: 32, stagger: 0.12, duration: 0.7, ease: 'power2.out',
                    scrollTrigger: { trigger: group, start: 'top 85%' }
                });
            }
        });

        // Bullet list items — staggered
        document.querySelectorAll('.cs-list').forEach(list => {
            gsap.from(list.querySelectorAll('li'), {
                opacity: 0, x: -12, stagger: 0.07, duration: 0.5, ease: 'power2.out',
                scrollTrigger: { trigger: list, start: 'top 88%' }
            });
        });

        // Timeline items (journey page)
        document.querySelectorAll('.cs-timeline-item').forEach(el => {
            gsap.from(el, {
                opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%' }
            });
        });

        // Tags
        document.querySelectorAll('.cs-tags').forEach(group => {
            gsap.from(group.querySelectorAll('.cs-tag'), {
                opacity: 0, scale: 0.9, stagger: 0.05, duration: 0.4, ease: 'power2.out',
                scrollTrigger: { trigger: group, start: 'top 90%' }
            });
        });

        // Footer
        const footer = document.querySelector('.cs-footer');
        if (footer) {
            gsap.from(footer, {
                opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
                scrollTrigger: { trigger: footer, start: 'top 95%' }
            });
        }
    }

    /* =========================================================
       Smooth Scroll via Lenis
       ========================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                lenis.scrollTo(0);
            }
        });
    });

    /* =========================================================
       Theme Toggle
       ========================================================= */
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

});
