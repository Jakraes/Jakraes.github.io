// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use the system preference
const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return prefersDarkScheme.matches ? 'dark' : 'light';
};

// Apply the current theme
const applyTheme = (theme) => {
    if (theme === 'light') {
        document.body.setAttribute('data-theme', 'light');
    } else {
        document.body.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
};

// Initialize theme
applyTheme(getCurrentTheme());

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// Check if device is touch-enabled (mobile)
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
};

// Custom cursor (only for non-touch devices)
const cursor = document.getElementById('cursor');
const cursorBorder = document.getElementById('cursor-border');
const links = document.querySelectorAll('a');
const projectCards = document.querySelectorAll('.project-card');
const themeButton = document.getElementById('theme-toggle');

// Only initialize custom cursor on non-touch devices
if (!isTouchDevice()) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        // Add slight delay to cursor border for smooth effect
        setTimeout(() => {
            cursorBorder.style.left = `${e.clientX}px`;
            cursorBorder.style.top = `${e.clientY}px`;
        }, 80);
    });

    // Cursor effects on interactive elements
    const handleMouseEnter = () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorBorder.style.width = '60px';
        cursorBorder.style.height = '60px';
        cursorBorder.style.opacity = '0.9';
    };

    const handleMouseLeave = () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorBorder.style.width = '40px';
        cursorBorder.style.height = '40px';
        cursorBorder.style.opacity = '0.5';
    };

    links.forEach(link => {
        link.addEventListener('mouseenter', handleMouseEnter);
        link.addEventListener('mouseleave', handleMouseLeave);
    });

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
    });

    themeButton.addEventListener('mouseenter', handleMouseEnter);
    themeButton.addEventListener('mouseleave', handleMouseLeave);
} else {
    // Hide cursor elements on touch devices
    if (cursor) cursor.style.display = 'none';
    if (cursorBorder) cursorBorder.style.display = 'none';
    
    // Reset cursor style on html element for touch devices
    document.documentElement.style.cursor = 'auto';
}

// Particle animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        // Get the current theme to determine particle color
        const theme = getCurrentTheme();
        const particleColor = theme === 'light' ? '0, 0, 0' : '255, 255, 255';
        
        ctx.fillStyle = `rgba(${particleColor}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
const particlesArray = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle());
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get the current theme to determine particle color
    const theme = getCurrentTheme();
    const particleColor = theme === 'light' ? '0, 0, 0' : '255, 255, 255';

    // Update and draw particles
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }

    // Draw connections between particles
    connectParticles(particleColor);

    requestAnimationFrame(animate);
}

// Connect particles with lines
function connectParticles(particleColor) {
    const maxDistance = 150;

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                const opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(${particleColor}, ${opacity * 0.1})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Start animation
animate();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Reveal animations on scroll
const revealElements = document.querySelectorAll('section');

function checkReveal() {
    const triggerBottom = window.innerHeight * 0.8;

    revealElements.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        
        if (sectionTop < triggerBottom) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Apply initial styles
revealElements.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Check on load and scroll
window.addEventListener('load', checkReveal);
window.addEventListener('scroll', checkReveal);

// Mobile Menu Functionality
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const header = document.querySelector("header");

hamburger.addEventListener("click", mobileMenu);
navLinks.forEach(n => n.addEventListener("click", closeMenu));

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
    header.classList.toggle("menu-open");
}

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("no-scroll");
    header.classList.remove("menu-open");
}

// Add meta viewport tag to prevent horizontal scrolling
function addViewportMeta() {
    // Check if viewport meta tag already exists
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (!viewportMeta) {
        // Create and add viewport meta tag if it doesn't exist
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        document.head.appendChild(viewportMeta);
    }
    
    // Set viewport meta content for desktop and mobile differently
    if (isTouchDevice()) {
        // For mobile devices - prevent scaling
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    } else {
        // For desktop - allow normal behavior
        viewportMeta.content = 'width=device-width, initial-scale=1.0';
    }
}

// Call on page load
window.addEventListener('DOMContentLoaded', addViewportMeta);