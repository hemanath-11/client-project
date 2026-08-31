/* ==========================================================================
   Pet Haven - Pets Catalog Page Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('pets-grid');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const genderFilter = document.getElementById('gender-filter');
  const priceFilter = document.getElementById('price-filter');
  const availabilityFilter = document.getElementById('availability-filter');

  if (!container) return;

  // Show loading skeleton while fetching
  if (typeof renderSkeletons === 'function') renderSkeletons(container, 6);

  // Fetch pets directly from Supabase
  let allPets = await db.getPets();
  populateCategoryFilter(allPets);
  renderPets(container, allPets);

  function populateCategoryFilter(pets) {
    if (!categoryFilter) return;
    const selected = categoryFilter.value;
    const catSet = new Set((pets || []).map(p => p.category ? p.category.trim() : '').filter(Boolean));
    const catList = Array.from(catSet).sort();

    categoryFilter.innerHTML = `<option value="">All Categories</option>` +
      catList.map(c => `<option value="${c}" ${c.toLowerCase() === selected.toLowerCase() ? 'selected' : ''}>${c}</option>`).join('');
  }

  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value.toLowerCase().trim() : '';
    const selectedGender = genderFilter ? genderFilter.value.toLowerCase().trim() : '';
    const maxPrice = priceFilter && priceFilter.value ? parseFloat(priceFilter.value) : Infinity;
    const selectedAvailability = availabilityFilter ? availabilityFilter.value.toLowerCase().trim() : '';

    const filtered = (allPets || []).filter(pet => {
      const petName = (pet.name || '').toLowerCase();
      const petBreed = (pet.breed || '').toLowerCase();
      const petCategory = (pet.category || '').toLowerCase();
      const petGender = (pet.gender || '').toLowerCase();
      const petAvailability = (pet.availability || 'available').toLowerCase();
      const petPrice = Number(pet.price) || 0;

      const matchesSearch = !searchTerm || petName.includes(searchTerm) || petBreed.includes(searchTerm) || petCategory.includes(searchTerm);
      const matchesCategory = !selectedCategory || petCategory === selectedCategory;
      const matchesGender = !selectedGender || petGender === selectedGender;
      const matchesPrice = !maxPrice || petPrice <= maxPrice;
      const matchesAvailability = !selectedAvailability || petAvailability === selectedAvailability;

      return matchesSearch && matchesCategory && matchesGender && matchesPrice && matchesAvailability;
    });

    renderPets(container, filtered);
  }

  // Event Listeners
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (genderFilter) genderFilter.addEventListener('change', applyFilters);
  if (priceFilter) priceFilter.addEventListener('input', applyFilters);
  if (availabilityFilter) availabilityFilter.addEventListener('change', applyFilters);
});

function renderPets(container, pets) {
  if (!pets || pets.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h3>No Pets Available</h3>
        <p>Check back soon for new arrivals or try adjusting your search filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pets.map(createPetCardHtml).join('');
}

function renderSkeletons(container, count = 6) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line" style="width: 60%;"></div>
          <div class="skeleton-line" style="width: 40%;"></div>
          <div class="skeleton-line" style="width: 90%;"></div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}
