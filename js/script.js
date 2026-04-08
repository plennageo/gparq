/**
 * GP ARQ - Performance Optimized Interaction Logic
 * Pure Vanilla JS | Zero Dependencies | "Light as a grain of sand"
 */

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header');
    
    // 1. Entrance Reveal Handler
    // Triggers CSS transition keyframes defined in style.css
    window.addEventListener('load', () => {
        document.body.classList.add('reveal');
    });

    // 2. Optimized Header Scroll
    // Using simple logic with low overhead
    let lastScroll = 0;
    let ticking = false;

    const updateHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // 3. Optional: Initial reveal if load event already fired
    if (document.readyState === 'complete') {
        document.body.classList.add('reveal');
    }

    // 4. Segunda Dobra — Scroll Reveal (IntersectionObserver)
    // Ativa a classe .s2-visible nos elementos [data-s2-anim] quando entram no viewport
    const s2Targets = document.querySelectorAll('[data-s2-anim]');

    if (s2Targets.length > 0 && 'IntersectionObserver' in window) {
        const s2Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('s2-visible');
                    s2Observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        s2Targets.forEach(el => s2Observer.observe(el));
    } else {
        // Fallback: revela tudo instantaneamente
        s2Targets.forEach(el => el.classList.add('s2-visible'));
    }
});

