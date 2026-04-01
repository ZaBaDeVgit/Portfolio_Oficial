document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    initHorizontalScroll();
    initNavigation();
    initKeyboardNav();
    initTouchNav();
    hideKeyboardHintAfterScroll();
    initTerminal();
    initMouseParallax();
    setTimeout(() => animateSectionIn(0), 300);
});

let currentSection = 0;
const totalSections = 6;
let isAnimating = false;
let isMobile = window.innerWidth <= 768;

function animateHeroIn() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".gsap-hero-elem", 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }
    )
    .fromTo(".gsap-hero-visual",
        { opacity: 0, scale: 0.8, rotation: -5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1 },
        "-=0.6"
    );
}

function animateCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(el => {
        const text = el.textContent;
        const num = parseInt(text);
        const suffix = text.replace(/[0-9]/g, '');
        
        if (isNaN(num)) return;
        
        gsap.fromTo(el, 
            { textContent: 0 },
            { 
                textContent: num, 
                duration: 1.5, 
                ease: "power2.out",
                snap: { textContent: 1 },
                onUpdate: function() {
                    el.textContent = Math.round(parseFloat(el.textContent)) + suffix;
                }
            }
        );
    });
}

function animateSectionIn(index) {
    if (index === 0) {
        animateHeroIn();
        return;
    }
    
    if (index === 1) {
        gsap.fromTo(".gsap-project-card",
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );
        gsap.fromTo(".gsap-section-header",
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
        );
    }
    
    if (index === 2) {
        gsap.fromTo(".gsap-about-elem",
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" }
        );
        animateCounters();
    }
    
    if (index === 3) {
        gsap.fromTo(".gsap-edu-item",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out" }
        );
        gsap.fromTo(".gsap-cert-item",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.3 }
        );
    }
    
    if (index === 4) {
        gsap.fromTo(".gsap-skill-card",
            { opacity: 0, y: 30, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }
        );
    }
    
    if (index === 5) {
        gsap.fromTo(".gsap-contact-elem",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
        gsap.fromTo(".gsap-contact-card",
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: "power3.out", delay: 0.2 }
        );
    }
}

function initMouseParallax() {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        gsap.to('.gradient-orb-1', { x: x * 30, y: y * 30, duration: 1, ease: "power2.out" });
        gsap.to('.gradient-orb-2', { x: x * -20, y: y * -20, duration: 1, ease: "power2.out" });
    });
}

function initHorizontalScroll() {
    const container = document.getElementById('scrollContainer');
    const panels = document.querySelectorAll('.panel');
    
    window.addEventListener('wheel', (e) => {
        if (isMobile) return;
        if (isAnimating) return;
        
        if (e.deltaY !== 0) {
            e.preventDefault();
            
            if (e.deltaY > 0) {
                goToSection(currentSection + 1);
            } else {
                goToSection(currentSection - 1);
            }
        }
    }, { passive: false });
}

function goToSection(index) {
    if (index < 0 || index >= totalSections || isAnimating) return;
    
    isAnimating = true;
    currentSection = index;
    
    const container = document.getElementById('scrollContainer');
    const panels = document.querySelectorAll('.panel');
    const dots = document.querySelectorAll('.nav-dot');
    
    if (!isMobile) {
        container.style.transform = `translateX(-${currentSection * 100}vw)`;
    }
    
    panels.forEach((panel, i) => {
        panel.classList.toggle('active', i === currentSection);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSection);
    });
    
    gsap.killTweensOf('.gsap-hero-elem, .gsap-hero-visual, .gsap-project-card, .gsap-section-header, .gsap-about-elem, .gsap-stat-card, .gsap-edu-item, .gsap-cert-item, .gsap-skill-card, .gsap-contact-elem, .gsap-contact-card');
    
    setTimeout(() => animateSectionIn(currentSection), 150);
    
    setTimeout(() => {
        isAnimating = false;
    }, 700);
}

function navigateTo(index) {
    goToSection(index);
}

function initNavigation() {
    const dots = document.querySelectorAll('.nav-dot');
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const section = parseInt(dot.dataset.section);
            goToSection(section);
        });
    });
    
    const ctaButtons = document.querySelectorAll('a[href^="#"]');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('href').substring(1);
            const sectionMap = {
                'home': 0,
                'projects': 1,
                'about': 2,
                'education': 3,
                'skills': 4,
                'contact': 5
            };
            const section = sectionMap[target];
            if (section !== undefined) {
                goToSection(section);
            }
        });
    });
}

function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (isMobile) return;
        
        // Si el terminal está abierto, ignorar atajos de navegación
        const terminalWindow = document.getElementById('terminalWindow');
        if (terminalWindow && !terminalWindow.classList.contains('terminal-hidden')) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
            case 'd':
            case 'D':
            case ' ':
                e.preventDefault();
                goToSection(currentSection + 1);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'a':
            case 'A':
                e.preventDefault();
                goToSection(currentSection - 1);
                break;
            case 'Home':
                e.preventDefault();
                goToSection(0);
                break;
            case 'End':
                e.preventDefault();
                goToSection(totalSections - 1);
                break;
        }
    });
}

function initTouchNav() {
    let touchStartX = 0;
    let touchEndX = 0;
    const container = document.getElementById('scrollContainer');
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        if (isMobile) return;
        
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 80;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToSection(currentSection + 1);
            } else {
                goToSection(currentSection - 1);
            }
        }
    }
}

function hideKeyboardHintAfterScroll() {
    const hint = document.querySelector('.keyboard-hint');
    if (!hint) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                hint.style.opacity = '0.6';
            }
        });
    }, { threshold: 0.5 });
    
    const sections = document.querySelectorAll('.panel');
    sections.forEach(section => observer.observe(section));
    
    setTimeout(() => {
        hint.style.transition = 'opacity 2s ease';
        hint.style.opacity = '0';
    }, 5000);
}

function initTerminal() {
    const terminalOverlay = document.getElementById('terminalOverlay');
    const terminalWindow = document.getElementById('terminalWindow');
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalClose = document.getElementById('terminalClose');
    const terminalMinimize = document.getElementById('terminalMinimize');
    const terminalLegend = document.getElementById('terminalLegend');
    const terminalToggle = document.getElementById('terminalToggle');

    const terminalData = {
        bio: `Juan José Zabala
Full Stack Developer · Ciberseguridad · Formador · IA
20 años de experiencia en administración pública española
Passionate about technology and public service`,

        edad: `Edad: 42 años (Nacido: 1983)
Ubicación: España`,

        educacion: `[2023-2025] Dobles Grado Superior DAM + DAW - UNIVERSAE
[2020-2022] FP Grado Medio Sistemas Microinformáticos y Redes - Linkia FP`,

        certificados: `[2025] Curso de iniciación al desarrollo con IA - BIG school
[2025] HTML desde Cero - midudev
[2025] Acreditación Docente para Teleformación - SSCE002POS
[2025] Blockchain: Aplicaciones en Empresa - ADGD11`,

        habilidades: `🛡️ Ciberseguridad
💻 Programación Full Stack
🌐 Desarrollo Web (HTML, CSS, JavaScript)
📱 Desarrollo Android
🔧 Reparación de equipos y redes
☁️ Gestión en la nube
🎨 Diseño de logotipos
💾 Recuperación de datos
📊 Consultoría de TI`,

        proyectos: `[01] Zaba Calendar - Gestión de turnos y eventos
[02] Tetris Game - Implementación del clásico juego
[03] App Quiz - Quiz interactivo con puntuación
[04] E-commerce - Prototipo de tienda online
[05] PDF Generator - Generador automatizado de PDFs
[06] WebSocket-Chat - Chat en tiempo real
[07] Music Player - Reproductor de música moderno
[08] Memory Game - Juego de memoria con niveles`,

        contacto: `📧 Email: juanjose.zabala@example.com
🔗 LinkedIn: Juan José Zabala
🐙 GitHub: @ZaBaDeVgit
📸 Instagram: @zabadev_`,

        whoami: `Juan José Zabala - Full Stack Developer
"Un desarrollador con propósito y pasión"`,

        clear: 'CLEAR'
    };

    const commands = {
        help: () => `Comandos disponibles:
  help      - Muestra esta ayuda
  bio       - Información personal
  edad      - Edad y ubicación
  educacion - Formación académica
  certificados / certs - Certificaciones
  habilidades / skills - Habilidades técnicas
  proyectos / projects - Lista de proyectos
  contacto / contact   - Información de contacto
  whoami    - Quién soy
  clear     - Limpiar terminal
  exit / quit - Cerrar terminal`,

        bio: () => terminalData.bio,
        edad: () => terminalData.edad,
        educacion: () => terminalData.educacion,
        formacion: () => terminalData.educacion,
        certificados: () => terminalData.certificados,
        certs: () => terminalData.certificados,
        habilidades: () => terminalData.habilidades,
        skills: () => terminalData.habilidades,
        proyectos: () => terminalData.proyectos,
        projects: () => terminalData.proyectos,
        contacto: () => terminalData.contacto,
        contact: () => terminalData.contacto,
        whoami: () => terminalData.whoami,
        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        }
    };

    function openTerminal() {
        terminalOverlay.classList.add('active');
        terminalWindow.classList.remove('terminal-hidden');
        terminalLegend.classList.remove('terminal-hidden');
        terminalInput.focus();
    }

    function closeTerminal() {
        terminalOverlay.classList.remove('active');
        terminalWindow.classList.add('terminal-hidden');
        terminalLegend.classList.add('terminal-hidden');
    }

    function toggleTerminal() {
        if (terminalWindow.classList.contains('terminal-hidden')) {
            openTerminal();
        } else {
            closeTerminal();
        }
    }

    function processCommand(cmd) {
        const trimmedCmd = cmd.trim().toLowerCase();
        
        if (trimmedCmd === 'exit' || trimmedCmd === 'quit') {
            closeTerminal();
            return null;
        }

        if (commands[trimmedCmd]) {
            return commands[trimmedCmd]();
        }

        return `Command not found: ${cmd}. Type 'help' for available commands.`;
    }

    function addOutput(command, result, isError = false) {
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line command';
        cmdLine.textContent = `juan@portfolio:~$ ${command}`;
        terminalOutput.appendChild(cmdLine);

        if (result !== null) {
            const resultLine = document.createElement('div');
            resultLine.className = `terminal-line ${isError ? 'error' : 'output'}`;
            resultLine.textContent = result;
            terminalOutput.appendChild(resultLine);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value;
            if (cmd.trim()) {
                const result = processCommand(cmd);
                addOutput(cmd, result, !commands[cmd.trim().toLowerCase()] && cmd.trim().toLowerCase() !== 'exit' && cmd.trim().toLowerCase() !== 'quit' && result !== null);
            } else {
                const emptyLine = document.createElement('div');
                emptyLine.className = 'terminal-line command';
                emptyLine.textContent = 'juan@portfolio:~$ ';
                terminalOutput.appendChild(emptyLine);
            }
            terminalInput.value = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+` (backtick, tecla debajo de Esc) para togglear terminal
        if (e.ctrlKey && e.shiftKey && e.key === '`') {
            e.preventDefault();
            toggleTerminal();
        }
    });

    terminalOverlay.addEventListener('click', closeTerminal);
    terminalClose.addEventListener('click', closeTerminal);
    terminalMinimize.addEventListener('click', closeTerminal);
    terminalToggle.addEventListener('click', toggleTerminal);
}

window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    
    const container = document.getElementById('scrollContainer');
    if (isMobile) {
        container.style.transform = 'none';
    }
});