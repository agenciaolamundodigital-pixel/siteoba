// OBA V2 - Interactive Script

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Reveal on Scroll (Intersection Observer) ---
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(el => revealObserver.observe(el));

    // --- 2. Enhanced Parallax Effect (Hero & Backgrounds) ---
    const hero = document.querySelector('.hero');
    const parallaxElements = document.querySelectorAll('[data-speed]');
    const bgParallaxes = document.querySelectorAll('[data-parallax-speed]');

    // Mouse Parallax (Hero)
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 900) return;

            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const moveX = clientX - centerX;
            const moveY = clientY - centerY;

            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-speed') || 0.1;
                el.style.transform = `translateX(${moveX * speed}px) translateY(${moveY * speed}px)`;
            });
        });
    }

    // Scroll Parallax (Backgrounds)
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        bgParallaxes.forEach(el => {
            const speed = el.getAttribute('data-parallax-speed') || 0.05;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        // --- 3. Scroll to Top & Sticky Nav ---
        const scrollTopBtn = document.getElementById('scrollTop');
        const navbar = document.querySelector('.navbar');

        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.7)';
            navbar.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)';
        }

        // --- 4. Mobile Nav Active State ---
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.app-item');
        let current = '';
        const offset = 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - offset)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href')?.includes(current)) {
                item.classList.add('active');
            }
        });
    });

    const scrollTopBtn = document.getElementById('scrollTop');
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
