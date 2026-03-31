document.addEventListener('DOMContentLoaded', () => {
    // 0. DEVICE DETECTION
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 0.1 MAGNETIC BUTTON EFFECT (Performance Optimized with Throttle)
    const magneticItems = document.querySelectorAll('.nav-controls a, .nav-controls div, .social-icon, .btn');
    if (!isTouchDevice) {
        magneticItems.forEach(item => {
            let rect = null;
            let rafId = null;

            item.addEventListener('mouseenter', () => {
                rect = item.getBoundingClientRect();
            });

            item.addEventListener('mousemove', (e) => {
                if (!rect) return;
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    item.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                });
            });

            item.addEventListener('mouseleave', () => {
                if (rafId) cancelAnimationFrame(rafId);
                item.style.transform = `translate(0, 0)`;
                rect = null;
            });
        });
    }

    // 1. THEME TOGGLE LOGIC (Fixed targeted towards 'html' root!)
    const themeBtn = document.getElementById('theme-btn');
    const rootHtml = document.documentElement; // Gets the <html> node

    if (themeBtn && rootHtml) {
        const icon = themeBtn.querySelector('i');
        const savedTheme = localStorage.getItem('portfolio-theme');

        // Initialize Theme from Storage
        if (savedTheme) {
            rootHtml.setAttribute('data-theme', savedTheme);
            updateIcon(savedTheme, icon);
        }

        // Toggle Listeners
        themeBtn.addEventListener('click', () => {
            const currentTheme = rootHtml.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            rootHtml.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            updateIcon(newTheme, icon);
        });
    }

    function updateIcon(theme, icon) {
        if (!icon) return;
        if (theme === 'light') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }


    // 2. CONTINUOUS SCROLL ANIMATIONS
    const transitionItems = document.querySelectorAll('.transition-item');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    transitionItems.forEach(item => observer.observe(item));

    setTimeout(() => {
        const heroItems = document.querySelectorAll('#hero .transition-item');
        heroItems.forEach(item => item.classList.add('visible'));
    }, 100);


    // 3. SCROLL SPY FOR NAVIGATION HIGHLIGHT
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });


    // 4. MOBILE HAMBURGER MENU DROPDOWN
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            const icon = hamburger.querySelector('i');
            if (navLinksContainer.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('nav-active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }


    // 5. 3D TILT EFFECT on Glass Cards (Disabled on mobile for performance)
    const tiltCards = document.querySelectorAll('.tilt-card, .vanilla-tilt');
    isTouchDevice = window.matchMedia('(pointer: coarse)').matches || isTouchDevice;

    if (!isTouchDevice) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                if (card.classList.contains('vanilla-tilt')) {
                    card.style.borderColor = 'var(--accent)';
                    card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5), 0 0 15px var(--accent-glow)';
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'all 0.5s ease';
                if (card.classList.contains('vanilla-tilt')) {
                    card.style.borderColor = 'var(--glass-border)';
                    card.style.boxShadow = 'var(--card-shadow)';
                }
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }

    // 6. CYBER GHOST CURSOR (Disabled on mobile for performance)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && !isTouchDevice) {
        document.body.classList.add('custom-cursor-active');

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Native animate for highly performant tracking
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        const hoverElements = document.querySelectorAll('a, button, .hover-zoom, .exp-item, .contact-mini, .skill-chip, .vanilla-tilt, .link-arrow');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    } else if (isTouchDevice && cursorDot && cursorOutline) {
        // Just hide them if we are on mobile to prevent weird behavior
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }

    // 6.1 STAGGERED PROJECTS LOAD
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });
    projectCards.forEach(card => projectObserver.observe(card));

    // 7. VANILLA JS TECH ARSENAL (Replacing React for Mobile Performance)
    const skillsData = [
        { id: 1, name: 'Python', icon: 'fab fa-python', category: 'Languages' },
        { id: 2, name: 'Java', icon: 'fab fa-java', category: 'Languages' },
        { id: 3, name: 'JavaScript', icon: 'fab fa-js-square', category: 'Languages' },
        { id: 4, name: 'C#', icon: 'fas fa-hashtag', category: 'Languages' },
        { id: 5, name: 'SQL', icon: 'fas fa-database', category: 'Languages' },
        { id: 6, name: 'React.js', icon: 'fab fa-react', category: 'Frontend' },
        { id: 7, name: 'HTML5/CSS3', icon: 'fab fa-html5', category: 'Frontend' },
        { id: 8, name: 'MudBlazor', icon: 'fab fa-windows', category: 'Frontend' },
        { id: 9, name: 'GitHub/Git', icon: 'fab fa-github', category: 'Tools' },
        { id: 10, name: 'Jira', icon: 'fab fa-jira', category: 'Tools' },
        { id: 11, name: 'Power Automate', icon: 'fas fa-cogs', category: 'Workflow' },
        { id: 12, name: 'SharePoint', icon: 'fas fa-share-alt', category: 'Workflow' }
    ];

    const arsenalContainer = document.getElementById('react-tech-arsenal');
    if (arsenalContainer) {
        const categories = ['All', 'Languages', 'Frontend', 'Tools', 'Workflow'];

        // Create Filter Tabs
        const filterTabs = document.createElement('div');
        filterTabs.className = 'skills-filter'; // Match CSS class name!

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `filter-btn ${cat === 'All' ? 'active' : ''}`;
            btn.textContent = cat;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderSkills(cat);
            });
            filterTabs.appendChild(btn);
        });

        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'skills-grid';

        arsenalContainer.innerHTML = '';
        arsenalContainer.appendChild(filterTabs);
        arsenalContainer.appendChild(skillsGrid);

        function renderSkills(filter) {
            skillsGrid.innerHTML = '';
            const filtered = filter === 'All' ? skillsData : skillsData.filter(s => s.category === filter);

            filtered.forEach(skill => {
                const chip = document.createElement('div');
                chip.className = 'skill-chip fade-in-react';
                chip.innerHTML = `<i class="${skill.icon}"></i> <span>${skill.name}</span>`;
                skillsGrid.appendChild(chip);
            });
        }

        renderSkills('All');

        // Fail-safe: ensure container is visible after rendering
        setTimeout(() => {
            arsenalContainer.classList.add('visible');
        }, 300);
    }
});
