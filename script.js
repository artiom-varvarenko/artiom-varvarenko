document.addEventListener('DOMContentLoaded', () => {
    // Animate the glitch effect randomly
    const glitchText = document.querySelector('.glitch');

    setInterval(() => {
        // Randomly trigger glitch animation
        if (Math.random() > 0.7) {
            glitchText.style.animation = 'glitch 0.5s cubic-bezier(.25, .46, .45, .94) both';

            setTimeout(() => {
                glitchText.style.animation = 'none';
            }, 500);
        }
    }, 3000);

    // Gradient sphere animation
    const sphere = document.querySelector('.gradient-sphere');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        // Move sphere slightly based on cursor position
        sphere.style.transform = `translate(${x * 30 - 15}px, ${y * 30 - 15}px) scale(${1 + y * 0.1})`;
    });

    // Add entrance animation for cards
    const cards = document.querySelectorAll('.link-card');

    // Set initial state (invisible)
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
    });

    // Animate entrance with staggered delay
    setTimeout(() => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + (index * 120)); // Staggered delay
        });
    }, 400);

    // Optional: Add audio feedback on card hover
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Uncomment below if you want hover sounds
            /*
            const hoverSound = new Audio();
            hoverSound.src = 'hover.mp3'; // You would need to add this file
            hoverSound.volume = 0.1;
            hoverSound.play();
            */
        });
    });

    // Create interactive cursor effect
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorOutline);

    // Add cursor styles
    const style = document.createElement('style');
    style.innerHTML = `
        .cursor-dot {
            width: 5px;
            height: 5px;
            background-color: var(--primary-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
        }
        
        .cursor-outline {
            width: 30px;
            height: 30px;
            border: 1px solid rgba(0, 238, 255, 0.5);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: transform 0.2s ease, width 0.3s ease, height 0.3s ease, border 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;

        // Add a slight delay to outline for smooth effect
        setTimeout(() => {
            cursorOutline.style.left = `${e.clientX}px`;
            cursorOutline.style.top = `${e.clientY}px`;
        }, 50);
    });

    // Expand cursor on card hover
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '50px';
            cursorOutline.style.height = '50px';
            cursorOutline.style.border = '1px solid var(--primary-color)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        card.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '30px';
            cursorOutline.style.height = '30px';
            cursorOutline.style.border = '1px solid rgba(0, 238, 255, 0.5)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Show default cursor on mobile
    if (window.innerWidth <= 768) {
        document.body.style.cursor = 'auto';
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }
});