document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initNavigation();
    initKeyboardNav();
    initTouchNav();
    hideKeyboardHintAfterScroll();
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
                'contact': 4
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

window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    
    const container = document.getElementById('scrollContainer');
    if (isMobile) {
        container.style.transform = 'none';
    }
});