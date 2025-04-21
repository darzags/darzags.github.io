document.addEventListener('DOMContentLoaded', () => {
    // Track page view
    gtag('event', 'page_view', {
        'page_title': document.title,
        'page_location': window.location.href,
        'page_path': window.location.pathname
    });

    // Track project carousel interactions
    const projectGrid = document.querySelector('.project-grid');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    const cards = document.querySelectorAll('.project-card');
    const cardWidth = cards[0].offsetWidth;
    const cardsPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const maxIndex = Math.max(0, cards.length - cardsPerView);

    // Track carousel navigation
    prevButton.addEventListener('click', () => {
        gtag('event', 'carousel_navigation', {
            'direction': 'previous',
            'current_index': currentIndex
        });
    });

    nextButton.addEventListener('click', () => {
        gtag('event', 'carousel_navigation', {
            'direction': 'next',
            'current_index': currentIndex
        });
    });

    // Track project card clicks
    cards.forEach((card, index) => {
        const links = card.querySelectorAll('.project-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                gtag('event', 'project_link_click', {
                    'project_title': card.querySelector('h3').textContent,
                    'link_type': link.classList.contains('disabled') ? 'private' : 'external',
                    'link_url': link.href || 'private'
                });
            });
        });
    });

    // Track social media clicks
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', () => {
            gtag('event', 'social_media_click', {
                'platform': link.querySelector('i').className.split(' ')[1].replace('fa-', ''),
                'link_url': link.href
            });
        });
    });

    // Track email clicks
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', () => {
            gtag('event', 'email_click', {
                'email_address': emailLink.href.replace('mailto:', '')
            });
        });
    }

    // Track section visibility
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'section_view', {
                    'section_name': entry.target.className.split(' ')[1],
                    'time_visible': new Date().toISOString()
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

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