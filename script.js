// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all major components
    initializeGlitchEffect();
    initializeNavigation();
    initializeScrollAnimations();
    initializeCardInteractions();
    initializeTypographyGrid();
});

// Glitch Effect for Hero Title
function initializeGlitchEffect() {
    const glitchText = document.querySelector('.glitch');
    if (!glitchText) return;

    let isGlitching = false;

    function triggerGlitch() {
        if (isGlitching) return;
        isGlitching = true;

        let iterations = 0;
        const maxIterations = 10;
        
        const glitchInterval = setInterval(() => {
            glitchText.style.transform = `translate(${Math.random() * 3}px, ${Math.random() * 3}px)`;
            glitchText.style.textShadow = `
                ${Math.random() * 3}px ${Math.random() * 3}px 0 rgba(255,0,0,0.75),
                ${Math.random() * -3}px ${Math.random() * -3}px 0 rgba(0,255,255,0.75)
            `;

            iterations++;
            if (iterations >= maxIterations) {
                clearInterval(glitchInterval);
                glitchText.style.transform = 'none';
                glitchText.style.textShadow = 'none';
                isGlitching = false;
            }
        }, 50);
    }

    // Trigger glitch on hover
    glitchText.addEventListener('mouseenter', triggerGlitch);

    // Random glitch every 5-10 seconds
    setInterval(() => {
        if (Math.random() > 0.7) triggerGlitch();
    }, 5000);
}

// Smooth Scrolling Navigation
function initializeNavigation() {
    const nav = document.querySelector('.floating-nav');
    if (!nav) return;

    // Smooth scroll for navigation links
    nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });

    // Hide/Show navigation based on scroll direction
    let lastScrollTop = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            const currentScroll = window.pageYOffset;
            
            // Determine scroll direction
            if (currentScroll > lastScrollTop && currentScroll > 100) {
                // Scrolling down
                nav.style.transform = 'translate(-50%, -100%)';
            } else {
                // Scrolling up
                nav.style.transform = 'translate(-50%, 0)';
            }

            lastScrollTop = currentScroll;
        }, 50);
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    document.querySelectorAll('.project-section, .project-card, .typo-card').forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Project Card Interactions
function initializeCardInteractions() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        const expandIcon = card.querySelector('.expand-icon');
        if (!expandIcon) return;

        card.addEventListener('mouseenter', () => {
            expandIcon.style.transform = 'rotate(90deg)';
        });

        card.addEventListener('mouseleave', () => {
            expandIcon.style.transform = 'rotate(0)';
        });

        // Add click interaction
        card.addEventListener('click', () => {
            const content = card.querySelector('p');
            if (!content) return;

            // Toggle expanded state
            if (card.classList.contains('expanded')) {
                card.style.maxHeight = null;
                card.classList.remove('expanded');
            } else {
                card.style.maxHeight = content.scrollHeight + 100 + 'px';
                card.classList.add('expanded');
            }
        });
    });
}

// Typography Grid Interactions
function initializeTypographyGrid() {
    const typoCards = document.querySelectorAll('.typo-card');
    
    typoCards.forEach(card => {
        // Add hover effect for images
        const image = card.querySelector('img');
        if (image) {
            // Handle image loading
            image.addEventListener('load', () => {
                image.classList.add('loaded');
            });

            // Add error handling
            image.addEventListener('error', () => {
                image.src = '/api/placeholder/400/300';
            });
        }

        // Add interactive hover states
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize events
window.addEventListener('resize', debounce(() => {
    // Reset any necessary layout calculations
    document.querySelectorAll('.project-card.expanded').forEach(card => {
        const content = card.querySelector('p');
        if (content) {
            card.style.maxHeight = content.scrollHeight + 100 + 'px';
        }
    });
}, 250));
