// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCursor();
    initializeGlitch();
    initializeNavigation();
    initializeCards();
    initializeTypeExperiments();
    initializeStoryScroll();
    initializeParallax();
});

// Custom Cursor
function initializeCursor() {
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .craft-card, .type-experiment');
    
    interactiveElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1.5)`;
            cursor.style.background = 'var(--accent)';
        });

        elem.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
            cursor.style.background = 'var(--accent)';
        });
    });
}

// Glitch Effect
function initializeGlitch() {
    const glitchText = document.querySelector('.glitch');
    if (!glitchText) return;

    let isGlitching = false;

    function triggerGlitch() {
        if (isGlitching) return;
        isGlitching = true;

        let iterations = 0;
        const maxIterations = 15;
        
        const glitchInterval = setInterval(() => {
            glitchText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            glitchText.style.textShadow = `
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(255,0,0,0.75),
                ${Math.random() * 4 - 2}px ${Math.random() * 4 - 2}px 0 rgba(0,255,255,0.75)
            `;

            iterations++;
            if (iterations >= maxIterations) {
                clearInterval(glitchInterval);
                glitchText.style.transform = 'none';
                glitchText.style.textShadow = '';
                isGlitching = false;
            }
        }, 50);
    }

    // Trigger glitch on hover and randomly
    glitchText.addEventListener('mouseenter', triggerGlitch);
    setInterval(() => {
        if (Math.random() > 0.95) triggerGlitch();
    }, 3000);
}

// Orbital Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Update active nav item based on scroll position
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.dimension');
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const targetNav = document.querySelector(`a[href="#${section.id}"]`);
                if (targetNav) {
                    navItems.forEach(item => item.classList.remove('active'));
                    targetNav.classList.add('active');
                }
            }
        });
    });
}

// Card Interactions
function initializeCards() {
    const cards = document.querySelectorAll('.craft-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
        });

        card.addEventListener('mouseleave', () => {
            card.querySelector('.card-inner').style.transform = 'rotateY(0)';
        });
    });
}

// Typography Experiments
function initializeTypeExperiments() {
    const experiments = document.querySelectorAll('.type-experiment');
    
    experiments.forEach(experiment => {
        const effect = experiment.dataset.effect;
        const visual = experiment.querySelector('.experiment-visual');
        
        switch(effect) {
            case 'magnetic':
                initializeMagneticEffect(visual);
                break;
            case 'constellation':
                initializeConstellationEffect(visual);
                break;
            case 'liquid':
                initializeLiquidEffect(visual);
                break;
            // Add more effects as needed
        }
    });
}

// Example of a magnetic effect
function initializeMagneticEffect(element) {
    const text = element.querySelector('.magnetic-text');
    if (!text) return;

    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / 10;
        const deltaY = (y - centerY) / 10;
        
        text.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    element.addEventListener('mouseleave', () => {
        text.style.transform = 'translate(0, 0)';
    });
}

// Story Scroll Animations
function initializeStoryScroll() {
    const storyChapters = document.querySelectorAll('.story-chapter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2
    });

    storyChapters.forEach(chapter => {
        observer.observe(chapter);
    });
}

// Parallax Effect
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.dimension-title, .craft-card, .type-experiment');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.2;
            const rect = element.getBoundingClientRect();
            const scrolledIntoView = window.scrollY + window.innerHeight - rect.top;
            
            if (scrolledIntoView > 0 && window.scrollY < rect.bottom) {
                element.style.transform = `translateY(${scrolledIntoView * speed}px)`;
            }
        });
    });
}

// Utility Functions
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Reset any necessary calculations
}, 250));
