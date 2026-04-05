document.addEventListener('DOMContentLoaded', () => {

    // ---- Active nav link highlighting ----
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.remove('active');
        const clean = href.replace('../', '').replace('/index.html', '').replace('index.html', '');
        if (
            (currentPath.endsWith('/') && (href === 'index.html' || href === '../index.html')) ||
            (clean && currentPath.includes(clean))
        ) {
            link.classList.add('active');
        }
    });

    // ---- Mobile Hamburger Menu ----
    const header = document.querySelector('header');
    const nav    = document.querySelector('nav');

    if (header && nav && !document.querySelector('.mobile-menu-btn')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Abrir menu');
        menuBtn.innerHTML = '&#9776;';

        const navCta = header.querySelector('.nav-cta');
        if (navCta) header.insertBefore(menuBtn, navCta);
        else         header.appendChild(menuBtn);

        const closeMenu = () => {
            nav.classList.remove('active');
            menuBtn.innerHTML = '&#9776;';
            menuBtn.setAttribute('aria-label', 'Abrir menu');
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = nav.classList.toggle('active');
            menuBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
            menuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu');
        });

        nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('click', (e) => {
            if (nav.classList.contains('active') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // ---- Header scroll effect ----
    const headerEl = document.getElementById('header');
    if (headerEl) {
        const onScroll = () => headerEl.classList.toggle('scrolled', window.scrollY > 50);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ---- Scroll reveal animation ----
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll([
        '.card', '.section-title', '.page-header', '.content-block',
        'form', '.reveal', '.stat-card', '.zenix-card', '.personality-item',
        '.timeline-item', '.phrase-card', '.use-item', '.zenix-stat'
    ].join(',')).forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }
        revealObserver.observe(el);
    });
});
