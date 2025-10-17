// Partículas de fondo
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Crear partículas
const particlesArray = [];
const numberOfParticles = 100;

const mouse = {
    x: null,
    y: null,
    radius: 150 // Radio de repulsión del puntero
};

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 200 + 55)}, 0.8)`;
    }

    update() {
        // Interacción con el ratón
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Vuelve a la posición original si no está cerca del ratón
            this.x += this.speedX;
            this.y += this.speedY;
        }
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {
            this.speedX = -this.speedX;
        }

        if (this.y < 0 || this.y > canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Conectar partículas cercanas
        for (let j = i; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(106, 11, 203, ${0.2 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

init();
animateParticles();

// Variables para almacenar posiciones iniciales de elementos flotantes
const floatingElements = document.querySelectorAll('.floating-element');
const initialTransforms = Array.from(floatingElements).map(el => el.style.transform || '');

// Efecto 3D en el movimiento del mouse
document.addEventListener('mousemove', (e) => {
    // Actualizamos las coordenadas del ratón para la interacción de partículas
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Efecto 3D en tarjetas
    const cards = document.querySelectorAll('.timeline-content, .education-card, .certification-card, .project-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        const angleX = (e.clientY - cardY) * 0.01;
        const angleY = (e.clientX - cardX) * -0.01;

        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    });

    // Efecto 3D en el contenedor principal
    const container = document.querySelector('.container-3d');
    if (container) {
        const rotateY = (mouseX - 0.5) * 10;
        const rotateX = (mouseY - 0.5) * -10;
        container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    // Mover elementos flotantes según la posición del mouse
    floatingElements.forEach((element, index) => {
        const speed = (index + 1) * 0.05; // Aumenté la velocidad para mayor efecto
        const x = (mouseX - 0.5) * speed * 200;
        const y = (mouseY - 0.5) * speed * 200;

        // Combinar transform inicial con movimiento del mouse
        const baseTransform = initialTransforms[index] || '';
        element.style.transform = `${baseTransform} translate(${x}px, ${y}px)`;
    });

    // Efecto en focos de luz
    const particles = document.querySelectorAll('.particle-light');
    particles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        const particleX = rect.left + rect.width / 2;
        const particleY = rect.top + rect.height / 2;

        const angleX = (e.clientY - particleY) * 0.002;
        const angleY = (e.clientX - particleX) * -0.002;

        particle.style.transform = `translateZ(20px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
});

// Resetear la posición del ratón cuando sale de la ventana
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Efecto de scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.floating-element');

    parallax.forEach((element, index) => {
        const speed = 0.5;
        const scrollY = scrolled * speed;

        // Mantener el movimiento del mouse mientras se hace scroll
        const currentMouseX = (window.mouseX || 0.5);
        const currentMouseY = (window.mouseY || 0.5);
        const mouseSpeed = (index + 1) * 0.05;
        const mouseX = (currentMouseX - 0.5) * mouseSpeed * 200;
        const mouseY = (currentMouseY - 0.5) * mouseSpeed * 200;

        const baseTransform = initialTransforms[index] || '';
        element.style.transform = `${baseTransform} translate(${mouseX}px, ${scrollY + mouseY}px)`;
    });
});

// Guardar posición del mouse para el scroll
document.addEventListener('mousemove', (e) => {
    window.mouseX = e.clientX / window.innerWidth;
    window.mouseY = e.clientY / window.innerHeight;
});

// Smooth scrolling para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animación de entrada para secciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0) translateZ(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(50px) translateZ(-20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Navbar activa según sección visible
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100; // Offset para mejor detección

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink(); // Llamar una vez al cargar