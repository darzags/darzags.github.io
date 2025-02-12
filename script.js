document.addEventListener('DOMContentLoaded', () => {
    const projectGrid = document.querySelector('.project-grid');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    const cards = document.querySelectorAll('.project-card');
    const cardWidth = cards[0].offsetWidth;
    const cardsPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const maxIndex = Math.max(0, cards.length - cardsPerView);

    // Create dots
    cards.forEach((_, index) => {
        if (index <= maxIndex) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        }
    });

    function updateDots() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        projectGrid.style.transform = `translateX(-${currentIndex * (cardWidth + 32)}px)`;
        updateDots();
    }

    prevButton.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });

    // Optional: Auto-scroll
    let autoScrollInterval = setInterval(() => {
        goToSlide(currentIndex === maxIndex ? 0 : currentIndex + 1);
    }, 5000);

    // Pause auto-scroll on hover
    projectGrid.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });

    projectGrid.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(() => {
            goToSlide(currentIndex === maxIndex ? 0 : currentIndex + 1);
        }, 5000);
    });

    // Update on window resize
    window.addEventListener('resize', () => {
        const newCardsPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
        if (newCardsPerView !== cardsPerView) {
            location.reload(); // Refresh page to recalculate layout
        }
    });
}); 