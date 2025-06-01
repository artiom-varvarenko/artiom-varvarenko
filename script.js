// Global Variables
let scene, camera, renderer, networkNodes = [], networkConnections = [];
let mouseX = 0, mouseY = 0;
let cubeRotationX = 0, cubeRotationY = 0;
let isDragging = false;
let konami = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    initMatrixRain();
    init3DNetwork();
    initDynamicTyping();
    initCubeInteraction();
    initActivityMonitors();
    initSkillsMatrix();
    initTerminal();
    initKonamiCode();
    initMouseTracking();
    animateElements();
});

// Boot Sequence
function initBootSequence() {
    const bootSequence = document.getElementById('bootSequence');
    const bootText = document.getElementById('bootText');
    const progressBar = document.getElementById('progressBar');

    const bootMessages = [
        'Initializing system...',
        'Loading security protocols...',
        'Establishing secure connection...',
        'Compiling neural networks...',
        'Synchronizing data streams...',
        'Activating defense matrix...',
        'Loading personal interface...',
        'System ready.'
    ];

    let messageIndex = 0;
    let progress = 0;

    const bootInterval = setInterval(() => {
        if (messageIndex < bootMessages.length) {
            bootText.textContent = `> ${bootMessages[messageIndex]}`;
            messageIndex++;
            progress += 12.5;
            progressBar.style.width = `${progress}%`;
        } else {
            clearInterval(bootInterval);
            setTimeout(() => {
                bootSequence.classList.add('fade-out');
                setTimeout(() => {
                    bootSequence.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 300);
}

// Matrix Rain Effect
function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px Fira Code`;

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Gradient effect
            const gradient = ctx.createLinearGradient(0, y - 100, 0, y);
            gradient.addColorStop(0, 'rgba(0, 255, 65, 0)');
            gradient.addColorStop(1, 'rgba(0, 255, 65, 1)');
            ctx.fillStyle = gradient;

            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(drawMatrix, 35);

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 3D Network Visualization
function init3DNetwork() {
    const container = document.getElementById('networkContainer');

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create network nodes
    const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff41,
        wireframe: true,
        opacity: 0.6,
        transparent: true
    });

    for (let i = 0; i < 50; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.x = (Math.random() - 0.5) * 50;
        node.position.y = (Math.random() - 0.5) * 50;
        node.position.z = (Math.random() - 0.5) * 50;
        node.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );
        scene.add(node);
        networkNodes.push(node);
    }

    // Create connections
    const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0x00ff41,
        opacity: 0.2,
        transparent: true
    });

    function updateConnections() {
        // Remove old connections
        networkConnections.forEach(conn => scene.remove(conn));
        networkConnections = [];

        // Create new connections for nearby nodes
        for (let i = 0; i < networkNodes.length; i++) {
            for (let j = i + 1; j < networkNodes.length; j++) {
                const distance = networkNodes[i].position.distanceTo(networkNodes[j].position);
                if (distance < 15) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        networkNodes[i].position,
                        networkNodes[j].position
                    ]);
                    const connection = new THREE.Line(geometry, connectionMaterial);
                    scene.add(connection);
                    networkConnections.push(connection);
                }
            }
        }
    }

    camera.position.z = 30;

    // Animation loop
    function animate3D() {
        requestAnimationFrame(animate3D);

        // Rotate camera around center
        camera.position.x = Math.sin(Date.now() * 0.0001) * 30;
        camera.position.z = Math.cos(Date.now() * 0.0001) * 30;
        camera.lookAt(scene.position);

        // Move nodes
        networkNodes.forEach(node => {
            node.position.add(node.velocity);

            // Bounce off boundaries
            ['x', 'y', 'z'].forEach(axis => {
                if (Math.abs(node.position[axis]) > 25) {
                    node.velocity[axis] *= -1;
                }
            });

            // Pulse effect
            node.scale.setScalar(1 + Math.sin(Date.now() * 0.001) * 0.1);
        });

        // Update connections periodically
        if (Math.random() > 0.98) {
            updateConnections();
        }

        renderer.render(scene, camera);
    }

    updateConnections();
    animate3D();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Dynamic Typing Animation
function initDynamicTyping() {
    const phrases = [
        "Breaking digital barriers",
        "Securing the cyberspace",
        "Building tomorrow's tech",
        "Pushing physical limits",
        "Creating content that matters",
        "Learning, growing, evolving",
        "Code • Train • Create • Repeat"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const dynamicText = document.getElementById('dynamicText');

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            dynamicText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            dynamicText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Interactive Cube
function initCubeInteraction() {
    const cube = document.getElementById('interactiveCube');
    const container = document.getElementById('cubeContainer');
    let startX, startY;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - cubeRotationX;
        startY = e.clientY - cubeRotationY;
        cube.style.animation = 'none';
        container.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        cubeRotationX = e.clientX - startX;
        cubeRotationY = e.clientY - startY;

        cube.style.transform = `rotateX(${-cubeRotationY}deg) rotateY(${cubeRotationX}deg)`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'grab';
            // Resume animation after a delay
            setTimeout(() => {
                if (!isDragging) {
                    cube.style.animation = 'rotate-cube 20s infinite linear';
                }
            }, 2000);
        }
    });
}

// Activity Monitors
function initActivityMonitors() {
    // Code Stats Animation
    animateCodeStats();

    // Security Progress
    animateSecurityProgress();

    // Fitness Chart
    createFitnessChart();

    // Content Stats
    animateContentStats();
}

function animateCodeStats() {
    const linesCode = document.getElementById('linesCode');
    const gitCommits = document.getElementById('gitCommits');
    const codeSnippet = document.getElementById('codeSnippet');

    // Animate numbers
    animateValue(linesCode, 0, 847, 2000);
    animateValue(gitCommits, 0, 23, 1500);

    // Code snippet animation
    const codeExamples = [
        `function exploitVuln() {
    const payload = generatePayload();
    return executeExploit(payload);
}`,
        `class NeuralNetwork:
    def __init__(self, layers):
        self.weights = self.initialize()
        self.train()`,
        `const secure = async (data) => {
    const encrypted = await crypto.encrypt(data);
    return hash(encrypted);
}`,
        `SELECT vulnerability FROM systems
WHERE patch_status = 'pending'
ORDER BY severity DESC;`
    ];

    let codeIndex = 0;
    function showNextCode() {
        codeSnippet.textContent = codeExamples[codeIndex];
        codeIndex = (codeIndex + 1) % codeExamples.length;
    }

    showNextCode();
    setInterval(showNextCode, 5000);
}

function animateSecurityProgress() {
    const progress = document.getElementById('securityProgress');
    const percent = document.getElementById('securityPercent');
    const miniTerminal = document.getElementById('miniTerminal');

    const targetPercent = 73;
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (targetPercent / 100) * circumference;

    setTimeout(() => {
        progress.style.strokeDashoffset = offset;
        animateValue(percent, 0, targetPercent, 2000);
    }, 500);

    // Mini terminal updates
    const terminalMessages = [
        'Scanning port 443...',
        'Vulnerability found!',
        'Exploiting service...',
        'Access granted.',
        'Privilege escalated.'
    ];

    let messageIndex = 0;
    function updateTerminal() {
        miniTerminal.textContent = `$ ${terminalMessages[messageIndex]}`;
        messageIndex = (messageIndex + 1) % terminalMessages.length;
    }

    updateTerminal();
    setInterval(updateTerminal, 3000);
}

function createFitnessChart() {
    const canvas = document.getElementById('fitnessChart');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 120;

    const data = [65, 70, 68, 72, 75, 73, 78, 80, 82, 79, 85, 87];
    const maxValue = Math.max(...data);
    const padding = 20;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    // Draw line chart
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Draw points
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;

        ctx.fillStyle = '#00ff41';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Animate fitness stats
    animateValue(document.getElementById('calories'), 0, 2847, 2000);
    animateValue(document.getElementById('distance'), 0, 15.3, 1500);
}

function animateContentStats() {
    animateValue(document.getElementById('views'), 0, 128500, 2500);
    animateValue(document.getElementById('subscribers'), 0, 3842, 2000);

    const nextUpload = document.getElementById('nextUpload');
    const uploadDates = ['2 days', '5 days', 'Next week', 'Tomorrow'];
    let dateIndex = 0;

    function updateUploadDate() {
        nextUpload.textContent = uploadDates[dateIndex];
        dateIndex = (dateIndex + 1) % uploadDates.length;
    }

    updateUploadDate();
    setInterval(updateUploadDate, 4000);
}

// Skills Matrix
function initSkillsMatrix() {
    const matrix = document.getElementById('skillsMatrix');
    const skillDetails = document.getElementById('skillDetails');

    const skills = [
        { name: 'Python', level: 90, x: 20, y: 20, description: 'Scripting, automation, and security tools' },
        { name: 'JavaScript', level: 85, x: 70, y: 15, description: 'Full-stack development and web security' },
        { name: 'C++', level: 75, x: 45, y: 30, description: 'System programming and performance' },
        { name: 'Pentesting', level: 88, x: 30, y: 60, description: 'Network and application security' },
        { name: 'Linux', level: 92, x: 80, y: 40, description: 'System administration and hardening' },
        { name: 'Cryptography', level: 78, x: 15, y: 80, description: 'Encryption and security protocols' },
        { name: 'Networking', level: 85, x: 60, y: 70, description: 'TCP/IP, routing, and protocols' },
        { name: 'Reverse Eng.', level: 72, x: 85, y: 75, description: 'Binary analysis and exploitation' },
        { name: 'Cloud Sec.', level: 80, x: 50, y: 85, description: 'AWS, Azure, and cloud architecture' },
        { name: 'Fitness', level: 95, x: 35, y: 45, description: 'Strength training and endurance' }
    ];

    // Create skill nodes
    skills.forEach((skill, index) => {
        const node = document.createElement('div');
        node.className = 'skill-node';
        node.style.left = `${skill.x}%`;
        node.style.top = `${skill.y}%`;
        node.textContent = skill.name;

        // Add floating animation with delay
        node.style.animation = `float ${3 + Math.random() * 2}s ease-in-out ${index * 0.1}s infinite`;

        node.addEventListener('mouseenter', () => {
            document.getElementById('skillName').textContent = skill.name;
            document.getElementById('skillDescription').textContent = skill.description;
            document.getElementById('skillLevel').style.width = `${skill.level}%`;

            // Highlight node
            document.querySelectorAll('.skill-node').forEach(n => n.classList.remove('active'));
            node.classList.add('active');
        });

        matrix.appendChild(node);
    });

    // Create connections between related skills
    createSkillConnections();
}

function createSkillConnections() {
    const matrix = document.getElementById('skillsMatrix');
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    matrix.insertBefore(canvas, matrix.firstChild);

    const ctx = canvas.getContext('2d');
    canvas.width = matrix.offsetWidth;
    canvas.height = matrix.offsetHeight;

    // Define connections
    const connections = [
        { from: { x: 20, y: 20 }, to: { x: 70, y: 15 } },
        { from: { x: 30, y: 60 }, to: { x: 80, y: 40 } },
        { from: { x: 15, y: 80 }, to: { x: 50, y: 85 } },
        { from: { x: 60, y: 70 }, to: { x: 85, y: 75 } }
    ];

    // Draw connections
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 1;

    connections.forEach(conn => {
        const fromX = (conn.from.x / 100) * canvas.width;
        const fromY = (conn.from.y / 100) * canvas.height;
        const toX = (conn.to.x / 100) * canvas.width;
        const toY = (conn.to.y / 100) * canvas.height;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    });
}

// Terminal Interface
function initTerminal() {
    const terminal = document.getElementById('terminal');
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');

    const commands = {
        help: 'Available commands: help, about, skills, contact, clear, hack, whoami, ls, cat',
        about: 'Artiom Varvarenko - CS Student, Penetration Tester, Athlete, Content Creator',
        skills: 'Primary: Python, JavaScript, C++, Pentesting, Linux\nSecondary: Cryptography, Networking, Reverse Engineering',
        contact: 'Email: your-email@example.com\nGitHub: github.com/your-username\nLinkedIn: linkedin.com/in/your-username',
        clear: () => {
            terminalOutput.innerHTML = '';
            return 'Terminal cleared.';
        },
        hack: 'Initializing hack mode... Just kidding! Check out hack.artiom-varvarenko.com for real security work.',
        whoami: 'root@artiom:~# A curious mind exploring the digital frontier',
        ls: 'projects/  skills/  achievements/  blog/  contact/',
        cat: 'Usage: cat [filename]. Try: cat projects/current.txt',
        'cat projects/current.txt': 'Current Project: Building an AI-powered vulnerability scanner\nStatus: In Progress\nTech Stack: Python, TensorFlow, Metasploit API'
    };

    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim();

            if (input) {
                // Add command to output
                addTerminalLine(`$ ${input}`, 'command');

                // Process command
                const output = commands[input] || `Command not found: ${input}. Type 'help' for available commands.`;

                if (typeof output === 'function') {
                    addTerminalLine(output(), 'output');
                } else {
                    addTerminalLine(output, 'output');
                }

                // Clear input
                terminalInput.value = '';

                // Scroll to bottom
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        }
    });

    function addTerminalLine(text, type) {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
    }

    // Welcome message
    addTerminalLine('Welcome to Artiom\'s Terminal v1.0', 'output');
    addTerminalLine('Type \'help\' for available commands.', 'output');
}

function openTerminal() {
    const terminal = document.getElementById('terminal');
    terminal.classList.add('active');
    document.getElementById('terminalInput').focus();
}

function closeTerminal() {
    document.getElementById('terminal').classList.remove('active');
}

// Decryption Challenge
function attemptDecode() {
    const input = document.getElementById('decoderInput').value.toLowerCase();
    const encryptedMessage = document.getElementById('encryptedMessage');

    // ROT13 cipher
    if (input === 'rot13' || input === '13') {
        const decrypted = "It's not what you know, it's what you can prove.";
        encryptedMessage.innerHTML = `<span class="cipher-text" style="color: #00ff41;">${decrypted}</span>`;

        // Show success effect
        createConfetti();

        // Show easter egg
        setTimeout(() => {
            document.getElementById('easterEgg').classList.add('show');
            setTimeout(() => {
                document.getElementById('easterEgg').classList.remove('show');
            }, 3000);
        }, 500);
    } else {
        // Wrong key effect
        encryptedMessage.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            encryptedMessage.style.animation = 'pulse 2s ease infinite';
        }, 500);
    }
}

function showHint() {
    const hintText = document.getElementById('hintText');
    const hints = [
        'Think about classic ciphers...',
        'Julius Caesar might know the answer.',
        'The number 13 is significant.',
        'ROT is short for rotation.'
    ];

    const currentHint = hintText.textContent;
    const currentIndex = hints.indexOf(currentHint);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % hints.length;

    hintText.textContent = hints[nextIndex];
    hintText.classList.add('show');
}

// Konami Code
function initKonamiCode() {
    document.addEventListener('keydown', (e) => {
        konami.push(e.key);
        konami = konami.slice(-konamiCode.length);

        if (konami.join(',') === konamiCode.join(',')) {
            activateMatrixMode();
        }
    });
}

function activateMatrixMode() {
    document.body.style.animation = 'matrix-mode 2s ease';

    // Show easter egg
    const easterEgg = document.getElementById('easterEgg');
    easterEgg.classList.add('show');

    // Activate audio visualizer
    const visualizer = document.getElementById('audioVisualizer');
    visualizer.classList.add('active');
    createAudioVisualizer();

    setTimeout(() => {
        easterEgg.classList.remove('show');
        visualizer.classList.remove('active');
        document.body.style.animation = '';
    }, 5000);
}

// Audio Visualizer
function createAudioVisualizer() {
    const canvas = document.getElementById('visualizerCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = 100;

    const bars = 64;
    const barWidth = canvas.width / bars;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < bars; i++) {
            const barHeight = Math.random() * 80 + 20;
            const x = i * barWidth;
            const y = canvas.height - barHeight;

            const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(0, 255, 65, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 212, 255, 0.8)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 2, barHeight);
        }

        requestAnimationFrame(draw);
    }

    draw();
}

// Utility Functions
function animateValue(element, start, end, duration) {
    const isFloat = end % 1 !== 0;
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = start + (end - start) * easeOutQuad(progress);
        element.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    update();
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function createConfetti() {
    const colors = ['#00ff41', '#00d4ff', '#ff0080', '#ffaa00'];
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
            z-index: 10000;
        `;
        document.body.appendChild(confetti);

        // Animate falling
        const duration = 2 + Math.random() * 2;
        confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'ease-out'
        }).onfinish = () => confetti.remove();
    }
}

// Mouse Tracking
function initMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

// Scroll Animations
function animateElements() {
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
    const elements = document.querySelectorAll('.monitor-card, .contact-method, section');
    elements.forEach(el => observer.observe(el));
}

// CSS Animation for Matrix Mode
const style = document.createElement('style');
style.innerHTML = `
    @keyframes matrix-mode {
        0% {
            filter: hue-rotate(0deg) brightness(1);
        }
        50% {
            filter: hue-rotate(180deg) brightness(1.5);
        }
        100% {
            filter: hue-rotate(360deg) brightness(1);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);