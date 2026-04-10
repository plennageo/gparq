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
        // Libera GPU memory reservada pelo will-change após as animações terminarem
        setTimeout(() => {
            document.querySelectorAll('[data-animate]').forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 1600); // 1s transition + 0.4s max-delay + margem
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
                    // Libera will-change após transição de entrada (1.2s)
                    setTimeout(() => {
                        entry.target.style.willChange = 'auto';
                    }, 1200);
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

    // ── 5. Microgaleria Editorial — Sistema Genérico v2.1 ──────────────────
    // Suporta múltiplas galerias via [data-gallery] — qualquer card pode virar galeria.
    // Crossfade Cinematográfico + Ken Burns + Progress Line
    // Sem setas visíveis. Sem dots. Apenas sensação.
    // Vanilla JS | Zero deps
    const initMicrogallery = (gallery) => {
        if (!gallery) return;

        const slides       = gallery.querySelectorAll('.s2-gallery-slide');
        const progressFill = gallery.querySelector('.s2-gallery-progress-fill');

        if (!slides.length) return;

        let current = 0;
        let timer   = null;
        let paused  = false;
        const TOTAL = slides.length;
        const DELAY = 4500; // 4.5s — ritmo lento e sofisticado

        /* ── Crossfade: troca de slide por opacity ── */
        const goTo = (index) => {
            slides[current].classList.remove('s2-gallery-active');
            current = ((index % TOTAL) + TOTAL) % TOTAL;
            slides[current].classList.add('s2-gallery-active');
            resetProgress();
        };

        /* ── Progress bar: reinicia animação CSS via force-reflow ── */
        const resetProgress = () => {
            if (!progressFill) return;
            progressFill.classList.remove('s2-progress-active');
            void progressFill.offsetWidth; // força reflow — reinicia a animation
            if (!paused) progressFill.classList.add('s2-progress-active');
        };

        /* ── Autoplay ── */
        const startPlay = () => {
            if (timer) clearInterval(timer);
            timer = setInterval(() => {
                if (!paused) goTo(current + 1);
            }, DELAY);
            resetProgress();
        };

        const stopPlay = () => {
            if (timer) { clearInterval(timer); timer = null; }
            if (progressFill) progressFill.classList.remove('s2-progress-active');
        };

        // Inicia
        startPlay();

        /* ── Cursor semântico por zona de clique ── */
        /* Metade esquerda = prev, metade direita = next — sem setas visíveis */
        gallery.addEventListener('mousemove', (e) => {
            const { left, width } = gallery.getBoundingClientRect();
            const zone = (e.clientX - left) / width < 0.5 ? 'prev' : 'next';
            gallery.setAttribute('data-cursor', zone);
        });

        gallery.addEventListener('mouseleave', () => {
            gallery.removeAttribute('data-cursor');
        });

        /* ── Click: zona esquerda = anterior, direita = próxima ── */
        gallery.addEventListener('click', (e) => {
            const { left, width } = gallery.getBoundingClientRect();
            const goNext = (e.clientX - left) / width >= 0.5;
            goTo(goNext ? current + 1 : current - 1);
            startPlay();
        });

        /* ── Pausa no hover — suspende timer e progresso visual ── */
        gallery.addEventListener('mouseenter', () => {
            paused = true;
            if (progressFill) progressFill.classList.remove('s2-progress-active');
        });

        gallery.addEventListener('mouseleave', () => {
            paused = false;
            startPlay();
        });

        /* ── Touch / Swipe — mobile ── */
        let touchX = 0;
        let touchY = 0;

        gallery.addEventListener('touchstart', (e) => {
            touchX = e.changedTouches[0].screenX;
            touchY = e.changedTouches[0].screenY;
        }, { passive: true });

        gallery.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].screenX - touchX;
            const dy = e.changedTouches[0].screenY - touchY;
            // Só swipes predominantemente horizontais (> 40px)
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                goTo(dx < 0 ? current + 1 : current - 1);
                startPlay();
            }
        }, { passive: true });

        /* ── Teclado — acessibilidade ── */
        gallery.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { goTo(current + 1); startPlay(); }
            if (e.key === 'ArrowLeft')  { goTo(current - 1); startPlay(); }
        });

        /* ── IntersectionObserver: pausa fora do viewport ── */
        /* Economiza GPU e evita Ken Burns invisível */
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { startPlay(); }
                    else                       { stopPlay();  }
                });
            }, { threshold: 0.25 });
            io.observe(gallery);
        }
    };

    // Inicializa todas as galerias existentes na página
    document.querySelectorAll('[data-gallery]').forEach(g => initMicrogallery(g));

});

