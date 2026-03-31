document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initNavigation();
    initKeyboardNav();
    initTouchNav();
    hideKeyboardHintAfterScroll();
    initTerminal();
});

let currentSection = 0;
const totalSections = 6;
let isAnimating = false;
let isMobile = window.innerWidth <= 768;

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