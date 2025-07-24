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
  filterToggle.addEventListener('click', () => filterMenu.classList.toggle('active'));
  document.addEventListener('click', event => {
    if (!filterMenu.contains(event.target) && !filterToggle.contains(event.target)) {
      filterMenu.classList.remove('active');
    }
  });

  // Fetch data e inicialização
  fetch('../data/products.json')
    .then(res => res.json())
    .then(data => {
      productsData = data;
      filteredProducts = data;
      renderPage(currentPage);
      renderPagination();
    })
    .catch(err => console.error('Erro a carregar products.json:', err));

  // Renderiza produtos para uma página
  function renderPage(page) {
    productsContainer.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredProducts.slice(start, end);

    pageItems.forEach((product, index) => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.style.animationDelay = `${index * 0.1}s`; // Animação opcional

      // Imagem
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('img-container');
      const img = document.createElement('img');
      img.src = `../images/${product.imagem}`;
      img.alt = product.nome;
      imgContainer.appendChild(img);
      productCard.appendChild(imgContainer);

      // Seção de texto
      const textSection = document.createElement('div');
      textSection.classList.add('text-section');
      textSection.innerHTML = `
        <h3 class="product-name">${product.nome}</h3>
        <p class="product-description">${product.descrição}</p>
        <p class="price">${product.preço.toFixed(2)}€</p>
      `;
      productCard.appendChild(textSection);

      // Botão Ver Detalhes com evento de modal
      const button = document.createElement('button');
      button.classList.add('product-button');
      button.textContent = 'Ver Detalhes';
      button.addEventListener('click', () => {
        const modal = document.getElementById('productModal');
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
          <h2>${product.nome}</h2>
          <img src="../images/${product.imagem}" alt="${product.nome}" style="max-width:100%; margin:20px 0; border-radius:8px;">
          <p><strong>Descrição:</strong> ${product.descrição}</p>
          <p><strong>Preço:</strong> ${product.preço.toFixed(2)}€</p>
          <p><strong>Marca:</strong> ${product.marca}</p>
          <p><strong>Família:</strong> ${product.familia}</p>
          <p><strong>Categoria:</strong> ${product.categoria}</p>
        `;
        modal.style.display = 'flex';
      });
      productCard.appendChild(button);

      productsContainer.appendChild(productCard);
    });
  }

  // Renderização da paginação
  function renderPagination() {
    paginationContainer.innerHTML = '';
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const prev = document.createElement('button');
    prev.textContent = 'Anterior';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', () => changePage(currentPage - 1));
    paginationContainer.appendChild(prev);

    for (let i = 1; i <= pageCount; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) btn.disabled = true;
      btn.addEventListener('click', () => changePage(i));
      paginationContainer.appendChild(btn);
    }

    const next = document.createElement('button');
    next.textContent = 'Próximo';
    next.disabled = currentPage === pageCount;
    next.addEventListener('click', () => changePage(currentPage + 1));
    paginationContainer.appendChild(next);
  }

  // Mudar de página
  function changePage(page) {
    currentPage = page;
    renderPage(page);
    renderPagination();
    window.scrollTo({ top: productsContainer.offsetTop - 20, behavior: 'smooth' });
  }

  // Filtrar e ordenar produtos
  function filterAndSortProducts() {
    const searchText = document.getElementById('searchFilter').value.toLowerCase();
    const selFam = document.getElementById('familiaFilter').value;
    const selCat = document.getElementById('categoriaFilter').value;
    const selMar = document.getElementById('marcaFilter').value;
    const maxPrice = parseFloat(document.getElementById('priceFilter').value);
    const sortFilter = document.getElementById('sortFilter').value;

    filteredProducts = productsData.filter(p => {
      return p.nome.toLowerCase().includes(searchText)
        && (selFam === 'all' || p.familia === selFam)
        && (selCat === 'all' || p.categoria === selCat)
        && (selMar === 'all' || p.marca === selMar)
        && p.preço <= maxPrice;
    });

    if (sortFilter === 'price-asc') filteredProducts.sort((a, b) => a.preço - b.preço);
    else if (sortFilter === 'price-desc') filteredProducts.sort((a, b) => b.preço - a.preço);
    else if (sortFilter === 'name-asc') filteredProducts.sort((a, b) => a.nome.localeCompare(b.nome));

    currentPage = 1;
    renderPage(1);
    renderPagination();
  }

  // Eventos para filtros
  ['searchFilter','familiaFilter','categoriaFilter','marcaFilter','sortFilter'].forEach(id => {
    const eventType = id === 'searchFilter' ? 'input' : 'change';
    document.getElementById(id).addEventListener(eventType, filterAndSortProducts);
  });
  document.getElementById('priceFilter').addEventListener('input', () => {
    document.getElementById('priceValue').textContent = `Até ${document.getElementById('priceFilter').value}€`;
    filterAndSortProducts();
  });

  // Fechar modal
  const modal = document.getElementById('productModal');
  document.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
});
