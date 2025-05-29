// Global Variables
let mouseX = 0;
let mouseY = 0;
let isPlaying = false;
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initTime();
    initParticles();
    initCursor();
    initTyping();
    initMusicPlayer();
    initTheme();
    initAnimations();
    initStats();
    initKonamiCode();
    initVisitorCount();
});

// Loading Screen
function initLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.querySelector('.loading-progress');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;

        loadingProgress.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 300);
        }
    }, 100);
}

// Current Time
function initTime() {
    const updateTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
    };

    updateTime();
    setInterval(updateTime, 1000);
}

// Particle System
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Mouse repulsion
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.vx += (dx / distance) * force * 0.2;
                this.vy += (dy / distance) * force * 0.2;
            }

            // Damping
            this.vx *= 0.99;
            this.vy *= 0.99;

            // Boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#00eeff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.save();
                    ctx.globalAlpha = (1 - distance / 150) * 0.2;
                    ctx.strokeStyle = '#00eeff';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Custom Cursor
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (!cursor || !cursorFollower) return;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);

        // Move gradient spheres
        const sphere1 = document.querySelector('.gradient-sphere');
        const sphere2 = document.querySelector('.gradient-sphere-2');

        if (sphere1) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            sphere1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        }

        if (sphere2) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            sphere2.style.transform = `translate(${-x * 20}px, ${-y * 20}px)`;
        }
    });

    // Hover effects
    const hoverables = document.querySelectorAll('a, button, .interest-tag, .mood-item');

    hoverables.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = 'var(--accent-color)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'var(--primary-color)';
        });
    });

    // Click effect
    document.addEventListener('click', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);
    });

    // Hide on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
}

// Typing Animation
function initTyping() {
    const phrases = [
        "19 y/o digital creator",
        "building cool stuff on the internet",
        "fueled by coffee and curiosity",
        "probably debugging something rn",
        "turning ideas into pixels",
        "ctrl+c ctrl+v enthusiast"
    ];

    let phraseIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;
    const typeText = document.getElementById('typeText');

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typeText.textContent = currentPhrase.substring(0, letterIndex - 1);
            letterIndex--;
        } else {
            typeText.textContent = currentPhrase.substring(0, letterIndex + 1);
            letterIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 80;

        if (!isDeleting && letterIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Music Player
function initMusicPlayer() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const icon = playPauseBtn.querySelector('i');
    const musicTitle = document.querySelector('.music-title');
    const musicArtist = document.querySelector('.music-artist');

    const songs = [
        { title: "lofi hip hop radio", artist: "beats to relax/study to" },
        { title: "Midnight City", artist: "M83" },
        { title: "Resonance", artist: "HOME" },
        { title: "After Dark", artist: "Mr.Kitty" },
        { title: "Neon Lights", artist: "Synthwave Mix" }
    ];

    let currentSong = 0;

    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;

        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            // Simulate song change
            currentSong = (currentSong + 1) % songs.length;
            musicTitle.textContent = songs[currentSong].title;
            musicArtist.textContent = songs[currentSong].artist;
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    });
}

// Theme Toggle
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');

        if (body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Scroll Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
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
    const elements = document.querySelectorAll('.link-card, .currently-card, .mood-item, .stat-card, .thought-bubble');
    elements.forEach(el => observer.observe(el));
}

// Animate Stats
function initStats() {
    const stats = document.querySelectorAll('.stat-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
        current += increment * Math.ceil(range / 50);
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = current.toLocaleString();
    }, stepTime);
}

// Konami Code Easter Egg
function initKonamiCode() {
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-konamiPattern.length);

        if (konamiCode.join('') === konamiPattern.join('')) {
            showEasterEgg();
        }
    });
}

function showEasterEgg() {
    const easterEgg = document.getElementById('easterEgg');
    easterEgg.classList.add('show');

    // Create confetti
    createConfetti();

    setTimeout(() => {
        easterEgg.classList.remove('show');
    }, 3000);
}

function createConfetti() {
    const colors = ['#00eeff', '#9d4edd', '#ff006e', '#00ff88'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -20px;
            transform: rotate(${Math.random() * 360}deg);
            animation: fall ${3 + Math.random() * 2}s ease-out forwards;
            z-index: 10000;
        `;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add falling animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Visitor Count
function initVisitorCount() {
    const visitorCount = document.getElementById('visitorCount');
    // Simulate visitor count (in real app, fetch from backend)
    const count = Math.floor(Math.random() * 90000 + 10000);
    visitorCount.textContent = count.toString().padStart(5, '0');
}

// Glitch effect on hover
document.querySelectorAll('.glitch').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.animation = 'glitch 0.3s infinite';
    });

    element.addEventListener('mouseleave', () => {
        element.style.animation = 'none';
    });
});

// Interest tags floating animation
document.querySelectorAll('.interest-tag').forEach((tag, index) => {
    tag.style.animation = `float ${3 + Math.random() * 2}s ease-in-out ${index * 0.1}s infinite`;
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add random glitch to title occasionally
setInterval(() => {
    if (Math.random() > 0.95) {
        const glitch = document.querySelector('.glitch');
        glitch.style.animation = 'glitch 0.2s ease';
        setTimeout(() => {
            glitch.style.animation = 'none';
        }, 200);
    }
}, 3000);