// OBA V2 - Interactive Script

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Reveal on Scroll ---
    const reveals = document.querySelectorAll('.reveal');

    function reveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal(); // init

    // --- 2. Parallax Effect (Hero) ---
    const hero = document.querySelector('.hero');
    const floatCards = document.querySelectorAll('.float-card');
    const blobs = document.querySelectorAll('.blob');

    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 900) return; // Disable on mobile

            const x = (window.innerWidth - e.pageX * 2) / 90;
            const y = (window.innerHeight - e.pageY * 2) / 90;

            floatCards.forEach(card => {
                card.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });

            blobs.forEach((blob, index) => {
                const speed = (index + 1) * 2;
                blob.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
            });
        });
    }

    // --- 3. Scroll to Top & Sticky Nav ---
    const scrollTopBtn = document.getElementById('scrollTop');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        // Scroll Top visibility
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Navbar glass intensity
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.7)';
            navbar.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 4. Mobile Nav Active State ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.app-item');

    window.addEventListener('scroll', () => {
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
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

});
