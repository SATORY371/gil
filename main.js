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
});
