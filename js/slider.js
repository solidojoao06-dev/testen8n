document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (n) => {
            slides.forEach(slide => slide.classList.remove('active-slide'));
            slides[n].classList.add('active-slide');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        const startSlideShow = () => {
            slideInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
        };

        const stopSlideShow = () => {
            clearInterval(slideInterval);
        };

        // Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopSlideShow(); // Opcional: para o automático ao navegar manualmente
                startSlideShow(); // Opcional: reinicia o automático
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopSlideShow();
                startSlideShow();
            });
        }

        // Iniciar
        showSlide(currentSlide);
        startSlideShow();
    }
});
