document.addEventListener('DOMContentLoaded', () => {

    /* ============================= */
    /* DEVICE DETECTION              */
    /* ============================= */
    const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const root = document.documentElement;

    /* ============================= */
    /* THEME TOGGLE                  */
    /* ============================= */
    const themeBtn = document.getElementById('theme-btn');

    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

        root.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme, icon);

        themeBtn.addEventListener('click', () => {
            const newTheme =
                root.getAttribute('data-theme') === 'dark'
                    ? 'light'
                    : 'dark';

            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            updateIcon(newTheme, icon);
        });
    }

    function updateIcon(theme, icon) {
        if (!icon) return;
        icon.classList.toggle('fa-sun', theme === 'dark');
        icon.classList.toggle('fa-moon', theme === 'light');
    }

    /* ============================= */
    /* MOBILE NAV (FIXED)            */
    /* ============================= */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        const icon = hamburger.querySelector('i');

        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('nav-active');

            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close menu on link click (event delegation)
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('nav-active');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }

    /* ============================= */
    /* SCROLL SPY (THROTTLED)        */
    /* ============================= */
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    let ticking = false;

    function updateScrollSpy() {
        let current = '';

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${current}`
            );
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollSpy);
            ticking = true;
        }
    });

    /* ============================= */
    /* INTERSECTION OBSERVER (MERGED)*/
    /* ============================= */
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // stagger effect for project cards
                    if (entry.target.classList.contains('project-card')) {
                        entry.target.style.transitionDelay = `${index * 100}ms`;
                    }
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll('.transition-item, .project-card')
        .forEach(el => observer.observe(el));

    /* ============================= */
    /* FIXED: PREMIUM MAGNETIC EFFECT */
    /* ============================= */
    if (!isTouchDevice) {
        const magneticItems = document.querySelectorAll('.btn, .social-icon, .nav-controls div, .nav-controls a');
        magneticItems.forEach(item => {
            let rect = null;
            let rafId = null;

            item.addEventListener('mouseenter', () => { rect = item.getBoundingClientRect(); });

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

    /* ============================= */
    /* FIXED: PREMIUM TILT EFFECT    */
    /* ============================= */
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('.vanilla-tilt, .project-card');
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
                card.style.borderColor = 'var(--accent)';
                card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5), 0 0 15px var(--accent-glow)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'all 0.5s ease';
                card.style.borderColor = 'var(--glass-border)';
                card.style.boxShadow = 'var(--card-shadow)';
            });

            card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
        });
    }

    /* ============================= */
    /* CUSTOM CURSOR                 */
    /* ============================= */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!isTouchDevice && cursorDot && cursorOutline) {
        document.body.classList.add('custom-cursor-active');

        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;

            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 150, fill: "forwards" });
        });

        const hoverItems = document.querySelectorAll('a, button, .vanilla-tilt, .project-card');
        hoverItems.forEach(item => {
            item.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
            item.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
        });
    }

    /* ============================= */
    /* FIXED: FULL TECH ARSENAL (v4.2)*/
    /* ============================= */
    const skillsData = [
        { name: 'Python', icon: 'fab fa-python', category: 'Languages' },
        { name: 'Java', icon: 'fab fa-java', category: 'Languages' },
        { name: 'JavaScript', icon: 'fab fa-js-square', category: 'Languages' },
        { name: 'C#', icon: 'fas fa-hashtag', category: 'Languages' },
        { name: 'SQL', icon: 'fas fa-database', category: 'Languages' },
        { name: 'React.js', icon: 'fab fa-react', category: 'Frontend' },
        { name: 'HTML5/CSS3', icon: 'fab fa-html5', category: 'Frontend' },
        { name: 'MudBlazor', icon: 'fab fa-windows', category: 'Frontend' },
        { name: 'GitHub/Git', icon: 'fab fa-github', category: 'Tools' },
        { name: 'Jira', icon: 'fab fa-jira', category: 'Tools' },
        { name: 'Power Automate', icon: 'fas fa-cogs', category: 'Workflow' },
        { name: 'SharePoint', icon: 'fas fa-share-alt', category: 'Workflow' }
    ];

    const arsenalContainer = document.getElementById('react-tech-arsenal');
    if (arsenalContainer) {
        const categories = ['All', 'Languages', 'Frontend', 'Tools', 'Workflow'];
        const filterTabs = document.createElement('div');
        filterTabs.className = 'skills-filter';

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
                chip.className = 'skill-chip visible';
                chip.innerHTML = `<i class="${skill.icon}"></i> <span>${skill.name}</span>`;
                skillsGrid.appendChild(chip);
            });
        }
        renderSkills('All');
    }
});