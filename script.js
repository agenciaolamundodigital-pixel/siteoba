// OBA Vibrant - Interaction Script

document.addEventListener('DOMContentLoaded', () => {

    // --- HERO SLIDER LOGIC ---
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    };

    // Auto Link
    let slideTimer = setInterval(nextSlide, slideInterval);

    // --- SCROLL REVEAL ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const visiblePoint = 100;

        reveals.forEach(reveal => {
            const top = reveal.getBoundingClientRect().top;
            if (top < windowHeight - visiblePoint) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once

    // --- SCROLL TO TOP ---
    const scrollBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
