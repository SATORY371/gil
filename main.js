document.addEventListener('DOMContentLoaded', () => {
    // Current page link highlighting
    const navLinks = document.querySelectorAll('nav ul li a');
    const currentUrl = window.location.href;
    
    navLinks.forEach(link => {
        if(currentUrl.includes(link.getAttribute('href')) && link.getAttribute('href') !== 'index.html') {
            link.classList.add('active');
        } else if (currentUrl.endsWith('/') && link.getAttribute('href') === 'index.html') {
             link.classList.add('active');
        }
    });

    // --- Menú Hamburguesa Móvil ---
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    if (header && nav) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '☰';
        header.appendChild(menuBtn);

        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
        });

        // Cerrar al clickear un enlace
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuBtn.innerHTML = '☰';
            });
        });
    }

    // Smooth reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

        document.querySelectorAll('.card, .section-title, .page-header, .content-block, form').forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

    // --- Zenix Flotante Global (Solo Móvil) ---
    function initGlobalZenix() {
        if (window.innerWidth >= 1024) return;
        
        // Crear elemento si no existe
        let floatingZenix = document.getElementById('zenix-floating-avatar');
        if (!floatingZenix) {
            floatingZenix = document.createElement('div');
            floatingZenix.id = 'zenix-floating-avatar';
            floatingZenix.innerHTML = '<img src="IMAGEN/SDK.png" alt="Zenix Floating">';
            floatingZenix.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
            document.body.appendChild(floatingZenix);
        }

        const handleScroll = () => {
            const heroImage = document.querySelector('.zenix-img-wrapper img');
            if (heroImage) {
                // En la página de Zenix (zenix.html), sigue apareciendo al bajar
                const rect = heroImage.getBoundingClientRect();
                if (rect.bottom < 0) {
                    floatingZenix.classList.add('visible');
                } else {
                    floatingZenix.classList.remove('visible');
                }
            } else {
                // En TODAS las demás páginas, Zenix es permanente en móviles
                floatingZenix.classList.add('visible');
            }
        };

        if (!document.querySelector('.zenix-img-wrapper img')) {
            // Si no estamos en zenix.html, la mostramos de una vez
            floatingZenix.classList.add('visible');
        } else {
            // Si estamos en zenix.html, usamos el listener
            window.addEventListener('scroll', handleScroll);
            handleScroll();
        }
    }

    initGlobalZenix();
});
