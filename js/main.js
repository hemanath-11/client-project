/* ==========================================================================
   Pet Haven - Common UI & Helper Functions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  setActiveNavLink();
});

// Mobile Navigation Toggle
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }
}

// Highlight current page in navbar
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Format Currency
function formatCurrency(amount) {
  return CONFIG.CURRENCY_SYMBOL + Number(amount).toLocaleString('en-IN');
}

// Generate Dynamic WhatsApp URL
function generateWhatsAppUrl(itemTitle, price) {
  const text = `Hi! I am interested in ${itemTitle} (Priced at ${formatCurrency(price)}) from ${CONFIG.SITE_NAME}. Is it still available?`;
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Toast Notifications
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}"></path>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Render Pet Card Component
function createPetCardHtml(pet) {
  let mainImg = 'assets/hero_pets.jpg';
  if (Array.isArray(pet.images) && pet.images.length > 0) {
    mainImg = pet.images[0];
  } else if (typeof pet.images === 'string' && pet.images.length > 0) {
    mainImg = pet.images;
  }
  const avail = pet.availability || 'Available';
  const desc = (pet.description || '').substring(0, 75);
  const waUrl = generateWhatsAppUrl((pet.name || 'Pet') + ' (' + (pet.breed || '') + ')', pet.price || 0);

  return `
    <div class="item-card">
      <div class="item-card-image">
        <img src="${mainImg}" alt="${pet.name || 'Pet'}" loading="lazy" onerror="this.src='assets/hero_pets.jpg'">
        <span class="badge ${avail.toLowerCase() === 'available' ? 'badge-available' : 'badge-adopted'}">
          ${avail}
        </span>
      </div>
      <div class="item-card-body">
        <div class="item-card-header">
          <h3 class="item-title">${pet.name || 'Unnamed Pet'}</h3>
          <span class="item-price">${formatCurrency(pet.price || 0)}</span>
        </div>
        <div class="item-meta">
          <span>${pet.category || ''}</span> • <span>${pet.breed || ''}</span> • <span>${pet.age || ''}</span>
        </div>
        <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">
          ${desc}${desc.length >= 75 ? '...' : ''}
        </p>
        <div class="item-card-footer">
          <a href="pet-detail.html?id=${pet.id}" class="btn btn-outline btn-sm" style="flex: 1;">View Details</a>
          <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm" title="Enquire on WhatsApp">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Render Bird Card Component
function createBirdCardHtml(bird) {
  let mainImg = 'assets/hero_pets.jpg';
  if (Array.isArray(bird.images) && bird.images.length > 0) {
    mainImg = bird.images[0];
  } else if (typeof bird.images === 'string' && bird.images.length > 0) {
    mainImg = bird.images;
  }
  const avail = bird.availability || 'Available';
  const desc = (bird.description || '').substring(0, 75);
  const waUrl = generateWhatsAppUrl((bird.name || 'Bird') + ' (' + (bird.species || '') + ')', bird.price || 0);

  return `
    <div class="item-card">
      <div class="item-card-image">
        <img src="${mainImg}" alt="${bird.name || 'Bird'}" loading="lazy" onerror="this.src='assets/hero_pets.jpg'">
        <span class="badge ${avail.toLowerCase() === 'available' ? 'badge-available' : 'badge-adopted'}">
          ${avail}
        </span>
      </div>
      <div class="item-card-body">
        <div class="item-card-header">
          <h3 class="item-title">${bird.name || 'Unnamed Bird'}</h3>
          <span class="item-price">${formatCurrency(bird.price || 0)}</span>
        </div>
        <div class="item-meta">
          <span>${bird.species || ''}</span> • <span>${bird.age || ''}</span> • <span>${bird.gender || ''}</span>
        </div>
        <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">
          ${desc}${desc.length >= 75 ? '...' : ''}
        </p>
        <div class="item-card-footer">
          <a href="bird-detail.html?id=${bird.id}" class="btn btn-outline btn-sm" style="flex: 1;">View Details</a>
          <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Render Product Card Component
function createProductCardHtml(product) {
  let mainImg = 'assets/hero_pets.jpg';
  if (Array.isArray(product.images) && product.images.length > 0) {
    mainImg = product.images[0];
  } else if (typeof product.images === 'string' && product.images.length > 0) {
    mainImg = product.images;
  }
  const avail = product.availability || 'In Stock';
  const desc = (product.description || '').substring(0, 75);
  const waUrl = generateWhatsAppUrl(product.name || 'Product', product.price || 0);

  return `
    <div class="item-card">
      <div class="item-card-image">
        <img src="${mainImg}" alt="${product.name || 'Product'}" loading="lazy" onerror="this.src='assets/hero_pets.jpg'">
        <span class="badge badge-available">
          ${avail}
        </span>
      </div>
      <div class="item-card-body">
        <div class="item-card-header">
          <h3 class="item-title">${product.name || 'Unnamed Product'}</h3>
          <span class="item-price">${formatCurrency(product.price || 0)}</span>
        </div>
        <div class="item-meta">
          <span>${product.category || ''}</span> • <span>${product.brand || ''}</span>
        </div>
        <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">
          ${desc}${desc.length >= 75 ? '...' : ''}
        </p>
        <div class="item-card-footer">
          <a href="product-detail.html?id=${product.id}" class="btn btn-outline btn-sm" style="flex: 1;">View Product</a>
          <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;
}
