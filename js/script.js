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

    // ── 5. Microgaleria Editorial — Escuta Ativa ──────────────────────────
    // Crossfade autoplay + pausa no hover + swipe mobile + teclado
    // Vanilla JS | Zero deps | Performance: requestAnimationFrame-aware
    const initMicrogallery = () => {
        const gallery = document.querySelector('[data-gallery="escuta"]');
        if (!gallery) return;

        const slides  = gallery.querySelectorAll('.s2-gallery-slide');
        const dots    = gallery.querySelectorAll('.s2-gallery-dot');
        const prevBtn = gallery.querySelector('.s2-gallery-prev');
        const nextBtn = gallery.querySelector('.s2-gallery-next');

        if (!slides.length) return;

        let current  = 0;
        let timer    = null;
        let paused   = false;
        const TOTAL  = slides.length;
        const DELAY  = 4500; // 4.5s — lento, sofisticado

        /* Transição entre slides — somente opacity */
        const goTo = (index) => {
            slides[current].classList.remove('s2-gallery-active');
            dots[current]?.classList.remove('s2-dot-active');
            current = ((index % TOTAL) + TOTAL) % TOTAL;
            slides[current].classList.add('s2-gallery-active');
            dots[current]?.classList.add('s2-dot-active');
        };

        /* Gerenciamento do autoplay */
        const startPlay = () => {
            if (timer) clearInterval(timer);
            timer = setInterval(() => {
                if (!paused) goTo(current + 1);
            }, DELAY);
        };

        const stopPlay = () => {
            if (timer) { clearInterval(timer); timer = null; }
        };

        // Inicia autoplay
        startPlay();

        /* Setas */
        prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(current - 1);
            startPlay(); // reseta o timer
        });

        nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(current + 1);
            startPlay();
        });

        /* Dots */
        dots.forEach((dot, i) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                if (i !== current) { goTo(i); startPlay(); }
            });
        });

        /* Pausa no hover — desktop */
        gallery.addEventListener('mouseenter', () => { paused = true;  });
        gallery.addEventListener('mouseleave', () => { paused = false; });

        /* Touch / Swipe — mobile */
        let touchX = 0;
        let touchY = 0;

        gallery.addEventListener('touchstart', (e) => {
            touchX = e.changedTouches[0].screenX;
            touchY = e.changedTouches[0].screenY;
        }, { passive: true });

        gallery.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].screenX - touchX;
            const dy = e.changedTouches[0].screenY - touchY;
            // Só responde a swipes predominantemente horizontais (> 40px)
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                goTo(dx < 0 ? current + 1 : current - 1);
                startPlay();
            }
        }, { passive: true });

        /* Teclado — acessibilidade */
        gallery.setAttribute('tabindex', '0');
        gallery.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { goTo(current + 1); startPlay(); }
            if (e.key === 'ArrowLeft')  { goTo(current - 1); startPlay(); }
        });

        /* IntersectionObserver — pausa quando fora do viewport
           Economiza recursos e evita troca invisível de imagens */
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startPlay();
                    } else {
                        stopPlay();
                    }
                });
            }, { threshold: 0.25 });
            io.observe(gallery);
        }
    };

    initMicrogallery();

});

