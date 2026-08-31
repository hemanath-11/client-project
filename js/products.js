/* ==========================================================================
   Pet Haven - Products Catalog Page Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('products-grid');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const brandFilter = document.getElementById('brand-filter');
  const priceFilter = document.getElementById('price-filter');
  const availabilityFilter = document.getElementById('availability-filter');

  if (!container) return;

  if (typeof renderSkeletons === 'function') renderSkeletons(container, 6);

  let allProducts = await db.getProducts();
  populateProductDropdowns(allProducts);
  renderProducts(container, allProducts);

  function populateProductDropdowns(products) {
    if (categoryFilter) {
      const selectedCat = categoryFilter.value;
      const catSet = new Set((products || []).map(p => p.category ? p.category.trim() : '').filter(Boolean));
      const catList = Array.from(catSet).sort();
      categoryFilter.innerHTML = `<option value="">All Categories</option>` +
        catList.map(c => `<option value="${c}" ${c.toLowerCase() === selectedCat.toLowerCase() ? 'selected' : ''}>${c}</option>`).join('');
    }
    if (brandFilter) {
      const selectedBrand = brandFilter.value;
      const brandSet = new Set((products || []).map(p => p.brand ? p.brand.trim() : '').filter(Boolean));
      const brandList = Array.from(brandSet).sort();
      brandFilter.innerHTML = `<option value="">All Brands</option>` +
        brandList.map(b => `<option value="${b}" ${b.toLowerCase() === selectedBrand.toLowerCase() ? 'selected' : ''}>${b}</option>`).join('');
    }
  }

  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value.toLowerCase().trim() : '';
    const selectedBrand = brandFilter ? brandFilter.value.toLowerCase().trim() : '';
    const maxPrice = priceFilter && priceFilter.value ? parseFloat(priceFilter.value) : Infinity;
    const selectedAvailability = availabilityFilter ? availabilityFilter.value.toLowerCase().trim() : '';

    const filtered = (allProducts || []).filter(prod => {
      const prodName = (prod.name || '').toLowerCase();
      const prodBrand = (prod.brand || '').toLowerCase();
      const prodCategory = (prod.category || '').toLowerCase();
      const prodAvailability = (prod.availability || 'in stock').toLowerCase();
      const prodPrice = Number(prod.price) || 0;

      const matchesSearch = !searchTerm || prodName.includes(searchTerm) || prodBrand.includes(searchTerm) || prodCategory.includes(searchTerm);
      const matchesCategory = !selectedCategory || prodCategory === selectedCategory;
      const matchesBrand = !selectedBrand || prodBrand === selectedBrand;
      const matchesPrice = !maxPrice || prodPrice <= maxPrice;
      const matchesAvailability = !selectedAvailability || prodAvailability === selectedAvailability;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesAvailability;
    });

    renderProducts(container, filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (brandFilter) brandFilter.addEventListener('change', applyFilters);
  if (priceFilter) priceFilter.addEventListener('input', applyFilters);
  if (availabilityFilter) availabilityFilter.addEventListener('change', applyFilters);
});

function renderProducts(container, products) {
  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h3>No Products Available</h3>
        <p>Check back soon for new pet foods, toys, and supplies.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(createProductCardHtml).join('');
}
