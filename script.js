// Global Variables
let audioEnabled = false;
let currentSection = 'home';
let particlesArray = [];
let mouseX = 0;
let mouseY = 0;

// Audio Context
let audioContext;
let oscillator;

// Quotes Array
const quotes = [
    "Life is what happens when you're busy making other plans",
    "Be yourself; everyone else is already taken",
    "In the middle of difficulty lies opportunity",
    "The best time to plant a tree was 20 years ago. The second best time is now",
    "Not all those who wander are lost",
    "Stay hungry, stay foolish",
    "Dream big and dare to fail",
    "Life is either a daring adventure or nothing at all",
    "The only impossible journey is the one you never begin",
    "Yesterday is history, tomorrow is a mystery, today is a gift"
];

// Initialize Audio
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Play Sound Effect
function playSound(frequency = 440, duration = 100) {
    if (!audioEnabled || !audioContext) return;

    oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

// Loading Animation
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingPercentage = document.querySelector('.loading-percentage');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        loadingProgress.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.floor(progress)}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    initializeAnimations();
                }, 500);
            }, 500);
        }
    }, 100);
});

// Initialize all animations
function initializeAnimations() {
    initParticles();
    initTypingAnimation();
    initGlitchEffect();
    initCursor();
    initNavigation();
    initThemeToggle();
    initAudioToggle();
    animateStats();
    animateCards();
    initQuoteRotation();
    initKonamiCode();
    updateVisitorCount();
    observeAnimations();
}

// Particle System
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (100 - distance) / 100;

                this.speedX -= forceDirectionX * force * 0.3;
                this.speedY -= forceDirectionY * force * 0.3;
            }

            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 238, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
    }

    // Connect particles
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(0, 238, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });

        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Move gradient spheres
    const sphere1 = document.querySelector('.gradient-sphere');
    const sphere2 = document.querySelector('.gradient-sphere-2');

    if (sphere1) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        sphere1.style.transform = `translate(${x * 50 - 25}px, ${y * 50 - 25}px) scale(${1 + y * 0.2})`;
    }

    if (sphere2) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        sphere2.style.transform = `translate(${-x * 30 + 15}px, ${-y * 30 + 15}px) scale(${1 + x * 0.1})`;
    }
});

// Typing Animation
function initTypingAnimation() {
    const phrases = [
        "CS student / athlete / creator",
        "cybersecurity enthusiast",
        "building secure solutions",
        "sharing my journey on YouTube",
        "code, train, create, repeat"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeText = document.getElementById('typeText');

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typeText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();
}

// Enhanced Glitch Effect
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');

    glitchElements.forEach(element => {
        setInterval(() => {
            if (Math.random() > 0.9) {
                element.style.animation = 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both';

                setTimeout(() => {
                    element.style.animation = 'none';
                }, 300);
            }
        }, 3000);
    });
}

// Custom Cursor
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;

        setTimeout(() => {
            cursorOutline.style.left = `${e.clientX}px`;
            cursorOutline.style.top = `${e.clientY}px`;
        }, 50);
    });

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .nav-item, .mood-item, .gallery-item');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = 'var(--primary-color)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            playSound(600, 50);
        });

        element.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'rgba(0, 238, 255, 0.5)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Click effect
    document.addEventListener('click', (e) => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        setTimeout(() => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);
        playSound(800, 100);

        // Create click ripple
        createClickRipple(e.clientX, e.clientY);
    });

    // Hide cursor on mobile
    if (window.innerWidth <= 768) {
        document.body.style.cursor = 'auto';
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }
}

// Create click ripple effect
function createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--primary-color), transparent);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        opacity: 0.6;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.6s ease, opacity 0.6s ease;
    `;

    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(10)';
        ripple.style.opacity = '0';
    }, 10);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');

            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Switch sections
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                    currentSection = targetSection;
                }
            });

            playSound(400, 100);
        });
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');

        if (body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        playSound(500, 100);
    });
}

// Audio Toggle
function initAudioToggle() {
    const audioToggle = document.getElementById('audioToggle');
    const icon = audioToggle.querySelector('i');

    audioToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;

        if (audioEnabled) {
            initAudio();
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            playSound(300, 200);
        } else {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
        }
    });
}

// Animate Stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.floor(current);
                setTimeout(updateCount, 30);
            } else {
                stat.textContent = target;
            }
        };

        // Start animation when visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCount();
                observer.disconnect();
            }
        });

        observer.observe(stat);
    });
}

// Animate Cards
function animateCards() {
    const cards = document.querySelectorAll('.link-card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });

    // Add hover particle effect
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            createCardParticles(card);
        });
    });
}

// Create particles on card hover
function createCardParticles(card) {
    const particlesContainer = card.querySelector('.card-particles');

    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: 0;
            animation: particleFade 1s ease forwards;
        `;

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Add particle fade animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes particleFade {
        0% {
            opacity: 0;
            transform: scale(0) translateY(0);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: scale(1.5) translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

// Quote Rotation
function initQuoteRotation() {
    const quoteText = document.querySelector('.quote-text');
    const quoteRefresh = document.getElementById('quoteRefresh');
    let quoteIndex = 0;

    function changeQuote() {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteText.style.opacity = '0';

        setTimeout(() => {
            quoteText.textContent = `"${quotes[quoteIndex]}"`;
            quoteText.style.opacity = '1';
        }, 300);

        playSound(500, 100);
    }

    quoteRefresh.addEventListener('click', changeQuote);

    // Auto-rotate quotes every 10 seconds
    setInterval(changeQuote, 10000);
}

// Konami Code Easter Egg
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;

            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

// Activate Easter Egg
function activateEasterEgg() {
    // Create confetti
    createConfetti();

    // Change all text to rainbow
    document.body.style.animation = 'rainbow 2s linear infinite';

    // Play celebration sound
    if (audioEnabled) {
        // Play a little melody
        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
        notes.forEach((note, index) => {
            setTimeout(() => playSound(note, 200), index * 150);
        });
    }

    // Reset after 5 seconds
    setTimeout(() => {
        document.body.style.animation = 'none';
    }, 5000);
}

// Create Confetti
function createConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    const colors = ['#00eeff', '#9d4edd', '#ff006e', '#ffd700', '#00ff00', '#ff4500'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 3}s`;

        confettiContainer.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Add rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.innerHTML = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Visitor Count
function updateVisitorCount() {
    const visitorCount = document.getElementById('visitorCount');
    if (visitorCount) {
        // Simulate visitor count
        const count = Math.floor(Math.random() * 5000 + 1000);
        visitorCount.textContent = count.toLocaleString();
    }
}

// Observe Animations
function observeAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    entry.target.style.transition = 'all 0.8s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.mood-item, .gallery-item, .favorite-card').forEach(el => {
        observer.observe(el);
    });
}

// Logo click to home
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', () => {
            document.querySelector('[data-section="home"]').click();
        });
    }

    // Add interactive elements to mood board
    document.querySelectorAll('.mood-item').forEach(item => {
        item.addEventListener('click', () => {
            const moodText = item.querySelector('.mood-text').textContent;
            playSound(800, 100);
        });
    });

    // Add gallery interactions
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            // Simple lightbox effect
            item.style.transform = 'scale(1.1)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 300);
        });
    });
});