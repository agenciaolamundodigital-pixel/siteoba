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
    const hero = document.querySelector('.hero-slider-section');
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
    const scrollTopBtn = document.getElementById('scrollTop');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.app-item');
    const mobileOffset = 200;

    const handleScroll = () => {
        const scrolled = window.pageYOffset;

        bgParallaxes.forEach(el => {
            const speed = el.getAttribute('data-parallax-speed') || 0.05;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        // --- 3. Scroll to Top & Sticky Nav ---
        if (scrollTopBtn) {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }

        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.7)';
                navbar.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)';
            }
        }

        // --- 4. Mobile Nav Active State ---
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - mobileOffset)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href')?.includes(current)) {
                item.classList.add('active');
            }
        });
    };

    let scrollTicking = false;
    const onScroll = () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 5. Hero Slider Logic ---
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');

    if (slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        const slideIntervalTime = 5000;
        let slideInterval;

        const showSlide = (index) => {
            // Remove active class
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Validate index
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;

            // Add active class
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            showSlide(currentSlide + 1);
        };

        const prevSlide = () => {
            showSlide(currentSlide - 1);
        };

        const startSlider = () => {
            slideInterval = setInterval(nextSlide, slideIntervalTime);
        };

        const resetSlider = () => {
            clearInterval(slideInterval);
            startSlider();
        };

        // Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetSlider();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetSlider();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlider();
            });
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showSlide(index);
                    resetSlider();
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            const tag = document.activeElement?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
            if (e.key === 'ArrowRight') {
                nextSlide();
                resetSlider();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
                resetSlider();
            }
        });

        // Initialize
        startSlider();
    }

    // --- 6. Draggable Floating Logo ---
    const logoWidget = document.getElementById('floating-logo');
    const closeWidgetBtn = document.getElementById('hide-logo-btn');
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    if (logoWidget && closeWidgetBtn) {
        // Close functionality
        closeWidgetBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag start
            logoWidget.style.opacity = '0';
            setTimeout(() => {
                logoWidget.style.display = 'none';
            }, 300);
        });

        // Mouse Drag
        logoWidget.addEventListener('mousedown', (e) => {
            if (e.target === closeWidgetBtn || closeWidgetBtn.contains(e.target)) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            // Get computed style for accurate initial position
            const style = window.getComputedStyle(logoWidget);
            initialLeft = parseInt(style.left);
            initialTop = parseInt(style.top);

            logoWidget.style.cursor = 'grabbing';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            logoWidget.style.left = `${initialLeft + dx}px`;
            logoWidget.style.top = `${initialTop + dy}px`;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                logoWidget.style.cursor = 'grab';
            }
        });

        // Touch Drag (Mobile)
        logoWidget.addEventListener('touchstart', (e) => {
            if (e.target === closeWidgetBtn || closeWidgetBtn.contains(e.target)) return;
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;

            const style = window.getComputedStyle(logoWidget);
            /* Handle potential 'auto' values in responsive layouts if needed, 
               but default css sets fixed values for now or media queries handle it. */
            /* Note: getComputedStyle might return 'auto' if not set, but we set it in CSS. */

            // For robust touch, sometimes reading offsetLeft/Top is better if positioned absolute/fixed
            initialLeft = logoWidget.offsetLeft;
            initialTop = logoWidget.offsetTop;
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent scrolling while dragging logo
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            logoWidget.style.left = `${initialLeft + dx}px`;
            logoWidget.style.top = `${initialTop + dy}px`;
        }, { passive: false });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // --- 7. Interactive Timeline Logic (Horizontal) ---
    const timelineContainer = document.querySelector('.timeline-scroller');

    if (timelineContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let autoScrollSpeed = 0.5; // Controls the speed of auto-movement
        let isHovered = false;
        let userInteracted = false;
        let animationId;

        // Auto Scroll Function (Breathing Movement)
        const autoScroll = () => {
            if (!isHovered && !userInteracted && window.innerWidth > 900) {
                // If not at the end
                if (timelineContainer.scrollLeft < (timelineContainer.scrollWidth - timelineContainer.clientWidth - 2)) {
                    timelineContainer.scrollLeft += autoScrollSpeed;
                }
            }
            if (!userInteracted) {
                animationId = requestAnimationFrame(autoScroll);
            }
        };

        // Start Auto Scrol with a delay to let user settle
        setTimeout(() => {
            animationId = requestAnimationFrame(autoScroll);
        }, 1000);

        // Pause on Hover
        timelineContainer.addEventListener('mouseenter', () => {
            isHovered = true;
            timelineContainer.style.cursor = 'grab';
        });

        timelineContainer.addEventListener('mouseleave', () => {
            isHovered = false;
            isDown = false;
        });

        // Mouse Drag Logic
        timelineContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            userInteracted = true; // Stop auto-scroll permanently after interaction
            cancelAnimationFrame(animationId);
            timelineContainer.style.cursor = 'grabbing';
            startX = e.pageX - timelineContainer.offsetLeft;
            scrollLeft = timelineContainer.scrollLeft;
        });

        timelineContainer.addEventListener('mouseup', () => {
            isDown = false;
            timelineContainer.style.cursor = 'grab';
        });

        timelineContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - timelineContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            timelineContainer.scrollLeft = scrollLeft - walk;
        });

        // Touch Interaction stops auto-scroll
        timelineContainer.addEventListener('touchstart', () => {
            userInteracted = true;
            cancelAnimationFrame(animationId);
        }, { passive: true });
    }


    // --- 7. Mobile Courses Menu Toggle (New) ---
    const mobileCoursesLink = document.querySelector('.mobile-app-bar a[href="#cursos"]');
    const mobileCoursesMenu = document.getElementById('mobile-courses-menu');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

    if (mobileCoursesLink && mobileCoursesMenu && closeMobileMenuBtn) {
        mobileCoursesLink.addEventListener('click', (e) => {
            e.preventDefault();
            mobileCoursesMenu.classList.add('active');
        });

        closeMobileMenuBtn.addEventListener('click', () => {
            mobileCoursesMenu.classList.remove('active');
        });

        // Close when clicking outside content
        mobileCoursesMenu.addEventListener('click', (e) => {
            if (e.target === mobileCoursesMenu) {
                mobileCoursesMenu.classList.remove('active');
            }
        });
    }

    // --- 8. Contact Form Logic ---
    window.sendWhatsApp = function () {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const courseInput = document.getElementById('course');
        const messageInput = document.getElementById('message');

        const name = nameInput ? nameInput.value : '';
        const phone = phoneInput ? phoneInput.value : '';
        const course = (courseInput && courseInput.value) ? courseInput.value : "Geral";
        const message = messageInput ? messageInput.value : '';

        if (!name || !phone) {
            alert("Por favor, preencha pelo menos seu nome e telefone para iniciarmos a conversa.");
            return;
        }

        const text = `*Novo Contato via Site*\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*Interesse:* ${course}\n*Mensagem:* ${message}`;
        const encodedText = encodeURIComponent(text);
        const url = `https://wa.me/5521999999999?text=${encodedText}`;

        window.open(url, '_blank');
    };

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const course = document.getElementById('course').value || "Geral";
            const message = document.getElementById('message').value;

            const subject = `Interesse no curso de ${course} - ${name}`;
            const body = `Nome: ${name}\nTelefone: ${phone}\nCurso de Interesse: ${course}\n\nMensagem:\n${message}`;

            window.location.href = `mailto:contato@oficinabelasartes.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

});
