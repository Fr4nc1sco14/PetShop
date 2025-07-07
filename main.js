const headers = document.querySelectorAll('.accordion-header');

headers.forEach(header => {
  header.addEventListener('click', () => {
    header.classList.toggle('active');
    const content = header.nextElementSibling;

    if (content.style.display === 'block') {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  });
});



document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navbarMenu = document.querySelector('.navbar__menu');

  // abre/fecha menu
  menuToggle.addEventListener('click', function(e) {
    navbarMenu.classList.toggle('navbar__menu--open');
  });

  // fecha quando clicar fora
  document.addEventListener('click', function(e) {
    if (
      navbarMenu.classList.contains('navbar__menu--open') &&
      !navbarMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      navbarMenu.classList.remove('navbar__menu--open');
    }
  });
});
