document.addEventListener('DOMContentLoaded', function() {
    // --- INITIALIZE ALL FUNCTIONS ---
    initLanguageSwitcher();
    initScrollAnimations();
    initCircularSlider();
    initSmoothScroll();

    // --- LANGUAGE SWITCHER WITH PERSISTENCE ---
    function initLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        if (!langButtons.length) return;
        
        const STORAGE_KEY = 'ggc_language';
        const defaultLang = 'sw';

        function updateLanguage(lang) {
            document.documentElement.lang = lang;
            localStorage.setItem(STORAGE_KEY, lang);

            const elements = document.querySelectorAll('[data-en]');
            elements.forEach(element => {
                const text = element.getAttribute(`data-${lang}`);
                if (text) {
                    element.innerHTML = text;
                }
            });

            langButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
            });
        }

        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                updateLanguage(this.getAttribute('data-lang'));
            });
        });

        const savedLang = localStorage.getItem(STORAGE_KEY) || defaultLang;
        updateLanguage(savedLang);
    }

    // --- SCROLL ANIMATION ---
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- CIRCULAR SLIDER (Homepage Only) ---
    function initCircularSlider() {
        const slider = document.querySelector('.hero-slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.slide');
        const dotsContainer = slider.querySelector('.slider-dots');
        let currentSlide = 0;
        const slideCount = slides.length;
        let slideInterval;

        function goToSlide(index) {
            currentSlide = index;
            const prevIndex = (currentSlide - 1 + slideCount) % slideCount;
            const nextIndex = (currentSlide + 1) % slideCount;

            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'prev', 'next');
                if (i === currentSlide) slide.classList.add('active');
                if (i === prevIndex) slide.classList.add('prev');
                if (i === nextIndex) slide.classList.add('next');
            });
            
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                 dot.classList.toggle('active', i === currentSlide);
            });
        }

        function startSlider() {
            slideInterval = setInterval(() => {
                goToSlide((currentSlide + 1) % slideCount);
            }, 5000);
        }

        function stopSlider() { clearInterval(slideInterval); }

        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                stopSlider();
                goToSlide(parseInt(e.target.dataset.index));
                startSlider();
            }
        });

        goToSlide(0);
        startSlider();
    }
    
    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }
});