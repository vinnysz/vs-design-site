// VS DESIGN - MAIN JAVASCRIPT (VERSÃO SEM EFEITO 3D)
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    console.log('🚀 VS Design - Site carregado com sucesso!');

    // ===== VARIÁVEIS GLOBAIS =====
    let ticking = false;

    // ===== PARTICLES CANVAS OTIMIZADO =====
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let width, height;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = `rgba(0, 102, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 102, 255, ${0.1 * (1 - distance/100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            drawConnections();
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationId = requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        resizeCanvas();
        initParticles();
        animateParticles();
    }

    // ===== MENU MOBILE SUAVE =====
    const menuBtn = document.querySelector('.menu-mobile');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            
            if (navLinks.classList.contains('show')) {
                navLinks.style.animation = 'slideUp 0.3s ease forwards';
                setTimeout(() => {
                    navLinks.classList.remove('show');
                    navLinks.style.animation = '';
                }, 280);
            } else {
                navLinks.classList.add('show');
                navLinks.style.animation = 'slideDown 0.3s ease forwards';
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.animation = 'slideUp 0.3s ease forwards';
                    setTimeout(() => {
                        navLinks.classList.remove('show');
                        navLinks.style.animation = '';
                        menuBtn.classList.remove('active');
                    }, 280);
                }
            });
        });
    }

    // ===== SCROLL SUAVE =====
    function smoothScroll(target, duration = 1000) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            
            window.scrollTo(0, startPosition + distance * ease(progress));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScroll(target, 1000);
            }
        });
    });

    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.createElement('a');
    backToTop.href = '#home';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        smoothScroll(document.querySelector('#home'), 800);
    });

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                
                if (scrollY > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }

                const blobs = document.querySelectorAll('.liquid-blob');
                blobs.forEach((blob, index) => {
                    const speed = 0.1 + (index * 0.02);
                    blob.style.transform = `translateY(${scrollY * speed}px)`;
                });

                ticking = false;
            });
            
            ticking = true;
        }
    });

    // ===== REVELAR ELEMENTOS NO SCROLL =====
    const revealElements = document.querySelectorAll('.glass-card, .portfolio-item, .section-title, .service-card, .stat-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                entry.target.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.98)';
        el.style.willChange = 'opacity, transform';
        revealObserver.observe(el);
    });

    // ===== CONTADORES ANIMADOS =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateNumbers() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const increment = target / 60;
            let frame = 0;

            function updateNumber() {
                frame++;
                current = Math.min(Math.ceil(increment * frame), target);
                stat.innerText = current;

                if (current < target) {
                    requestAnimationFrame(updateNumber);
                }
            }

            requestAnimationFrame(updateNumber);
        });
    }

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                setTimeout(animateNumbers, 200);
            }
        });
    }, { threshold: 0.5 });

    const aboutSection = document.querySelector('#sobre');
    if (aboutSection) aboutObserver.observe(aboutSection);

    // ===== FILTROS DO PORTFÓLIO =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach((item, index) => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ===== FORMULÁRIO DE CONTATO =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso!', 'success');
                this.reset();
                btn.innerText = originalText;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'all';
            }, 1000);
        });
    }

    // ===== NOTIFICAÇÕES =====
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'var(--blue)' : '#ff4444'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            opacity: 0;
            transform: translateX(30px);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(30px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // ===== REMOVIDO: Efeito 3D/perspectiva dos cards =====
    // Agora os cards (balões) não têm mais efeito de rotação ao passar o mouse
    // Eles mantêm apenas o efeito de levantar (translateY) que já está no CSS

    // ===== ANIMAÇÕES CSS =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }

        .glass-card, .portfolio-item, .service-card {
            will-change: transform, opacity;
            backface-visibility: hidden;
        }

        .nav-links.show {
            display: flex !important;
        }
    `;
    document.head.appendChild(style);
});

// ===== CARROSSEL EDIÇÕES VIRAL =====
const carousel = document.querySelector('.edicoes-carousel');
const prevBtn = document.querySelector('.edicoes-prev');
const nextBtn = document.querySelector('.edicoes-next');
const indicators = document.querySelector('.carousel-indicators');

if (carousel) {
    const cards = document.querySelectorAll('.edicao-card');
    const cardCount = cards.length;
    
    // Criar indicadores
    for (let i = 0; i < cardCount; i++) {
        const indicator = document.createElement('span');
        indicator.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + 20; // width + gap
            carousel.scrollTo({
                left: cardWidth * i,
                behavior: 'smooth'
            });
        });
        indicators.appendChild(indicator);
    }
    
    // Atualizar indicador ativo
    function updateIndicators() {
        const scrollPosition = carousel.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 20;
        const activeIndex = Math.round(scrollPosition / cardWidth);
        
        document.querySelectorAll('.carousel-indicators span').forEach((ind, idx) => {
            ind.classList.toggle('active', idx === activeIndex);
        });
    }
    
    carousel.addEventListener('scroll', updateIndicators);
    
    // Botões de navegação
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + 20;
            carousel.scrollBy({
                left: -cardWidth * 3,
                behavior: 'smooth'
            });
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + 20;
            carousel.scrollBy({
                left: cardWidth * 3,
                behavior: 'smooth'
            });
        });
    }
    
    // Pausar vídeos quando não estão visíveis
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('.edicao-video');
            if (video) {
                if (entry.isIntersecting) {
                    video.play().catch(() => {}); // Autoplay pode ser bloqueado
                } else {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.5 });
    
    cards.forEach(card => observer.observe(card));
}


// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const pergunta = item.querySelector('.faq-pergunta');
    
    pergunta.addEventListener('click', () => {
        // Fecha todos os outros itens
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Abre/fecha o item clicado
        item.classList.toggle('active');
    });
});