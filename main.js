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

  menuToggle.addEventListener('click', function() {
    navbarMenu.classList.toggle('active');
  });
});