document.addEventListener('DOMContentLoaded', function() {
  const productsContainer = document.querySelector('.Shop-Products-Items');
  const paginationContainer = document.createElement('div');
  paginationContainer.id = 'pagination';
  paginationContainer.style.textAlign = 'center';
  paginationContainer.style.margin = '20px 0';
  productsContainer.parentNode.insertBefore(paginationContainer, productsContainer.nextSibling);

  const itemsPerPage = 8;
  let currentPage = 1;
  let productsData = [];

  // Fetch data and initialize
  fetch('../data/products.json')
    .then(response => response.json())
    .then(data => {
      productsData = data;
      renderPage(currentPage);
      renderPagination();
    })
    .catch(error => console.error('Erro ao carregar products.json:', error));

  // Render products for a given page
  function renderPage(page) {
    productsContainer.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = productsData.slice(start, end);

    pageItems.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      const img = document.createElement('img');
      img.src = `../images/${product.imagem}`;
      img.alt = product.nome;

      const textSection = document.createElement('div');
      textSection.classList.add('text-section');

      const productName = document.createElement('h3');
      productName.classList.add('product-name');
      productName.textContent = product.nome;

      const price = document.createElement('p');
      price.classList.add('price');
      price.textContent = `${product.preço}€`;

      textSection.appendChild(productName);
      textSection.appendChild(price);
      productCard.appendChild(img);
      productCard.appendChild(textSection);
      productsContainer.appendChild(productCard);
    });
  }

  // Render pagination controls
  function renderPagination() {
    paginationContainer.innerHTML = '';
    const pageCount = Math.ceil(productsData.length / itemsPerPage);

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => changePage(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    // Page buttons
    for (let i = 1; i <= pageCount; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      if (i === currentPage) pageButton.disabled = true;
      pageButton.addEventListener('click', () => changePage(i));
      paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Próximo';
    nextButton.disabled = currentPage === pageCount;
    nextButton.addEventListener('click', () => changePage(currentPage + 1));
    paginationContainer.appendChild(nextButton);
  }

  // Change page and re-render
  function changePage(page) {
    currentPage = page;
    renderPage(page);
    renderPagination();
    window.scrollTo({ top: productsContainer.offsetTop - 20, behavior: 'smooth' });
  }
});
