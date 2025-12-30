document.addEventListener('DOMContentLoaded', () => {
    const navBar = document.querySelector('nav');
    if (!navBar) return;

    function handleScroll() {
        if (window.scrollY > 0) {
            navBar.style.boxShadow = '0 5px 20px rgba(190, 190, 190, 0.15)';
            navBar.style.backgroundColor = 'white';
        } else {
            navBar.style.boxShadow = 'none';
            navBar.style.backgroundColor = 'transparent';
        }
    }

    handleScroll();
    document.addEventListener('scroll', handleScroll);
});
