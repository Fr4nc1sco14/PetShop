document.addEventListener('DOMContentLoaded', function() {
  const productsContainer = document.querySelector('.Shop-Products-Items');
  const paginationContainer = document.createElement('div');
  paginationContainer.id = 'pagination';
  paginationContainer.style.textAlign = 'center';
  paginationContainer.style.margin = '20px 0';
  productsContainer.parentNode.insertBefore(paginationContainer, productsContainer.nextSibling);

  const filterToggle = document.querySelector('.filter-toggle');
  const filterMenu = document.querySelector('.filter-menu');

  const itemsPerPage = 8;
  let currentPage = 1;
  let productsData = [];
  let filteredProducts = [];

  // Toggle do menu de filtros
  filterToggle.addEventListener('click', function() {
    filterMenu.classList.toggle('active');
  });

  // Fechar o menu de filtros se clicar fora dele
  document.addEventListener('click', function(event) {
    if (!filterMenu.contains(event.target) && !filterToggle.contains(event.target)) {
      filterMenu.classList.remove('active');
    }
  });

  // Fetch data and initialize
  fetch('../data/products.json')
    .then(response => response.json())
    .then(data => {
      productsData = data;
      filteredProducts = data;
      renderPage(currentPage);
      renderPagination();
    })
    .catch(error => console.error('Erro ao carregar products.json:', error));

  // Render products for a given page
  function renderPage(page) {
    productsContainer.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredProducts.slice(start, end);

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
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => changePage(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= pageCount; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      if (i === currentPage) pageButton.disabled = true;
      pageButton.addEventListener('click', () => changePage(i));
      paginationContainer.appendChild(pageButton);
    }

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

  // Filter and sort products
  function filterAndSortProducts() {
    const searchText = document.getElementById('searchFilter').value.toLowerCase();
    const selectedFamilia = document.getElementById('familiaFilter').value;
    const selectedCategoria = document.getElementById('categoriaFilter').value;
    const selectedMarca = document.getElementById('marcaFilter').value;
    const maxPrice = parseFloat(document.getElementById('priceFilter').value);
    const stockFilter = document.getElementById('stockFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;

    filteredProducts = productsData.filter(product => {
      const matchesSearch = product.nome.toLowerCase().includes(searchText);
      const matchesFamilia = selectedFamilia === 'all' || product.familia === selectedFamilia;
      const matchesCategoria = selectedCategoria === 'all' || product.categoria === selectedCategoria;
      const matchesMarca = selectedMarca === 'all' || product.marca === selectedMarca;
      const matchesPrice = product.preço <= maxPrice;
      const matchesStock = stockFilter === 'all' || (stockFilter === 'in-stock' && true); // Assuming all are in stock

      return matchesSearch && matchesFamilia && matchesCategoria && matchesMarca && matchesPrice && matchesStock;
    });

    // Sort products
    if (sortFilter === 'price-asc') {
      filteredProducts.sort((a, b) => a.preço - b.preço);
    } else if (sortFilter === 'price-desc') {
      filteredProducts.sort((a, b) => b.preço - a.preço);
    } else if (sortFilter === 'name-asc') {
      filteredProducts.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    currentPage = 1;
    renderPage(currentPage);
    renderPagination();
  }

  // Event listeners for filters
  document.getElementById('searchFilter').addEventListener('input', filterAndSortProducts);
  document.getElementById('familiaFilter').addEventListener('change', filterAndSortProducts);
  document.getElementById('categoriaFilter').addEventListener('change', filterAndSortProducts);
  document.getElementById('marcaFilter').addEventListener('change', filterAndSortProducts);
  document.getElementById('priceFilter').addEventListener('input', () => {
    const priceValue = document.getElementById('priceFilter').value;
    document.getElementById('priceValue').textContent = `Até ${priceValue}€`;
    filterAndSortProducts();
  });
  document.getElementById('stockFilter').addEventListener('change', filterAndSortProducts);
  document.getElementById('sortFilter').addEventListener('change', filterAndSortProducts);
});