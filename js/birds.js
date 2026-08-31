/* ==========================================================================
   Pet Haven - Birds Catalog Page Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('birds-grid');
  const searchInput = document.getElementById('search-input');
  const speciesFilter = document.getElementById('species-filter');
  const genderFilter = document.getElementById('gender-filter');
  const priceFilter = document.getElementById('price-filter');
  const availabilityFilter = document.getElementById('availability-filter');

  if (!container) return;

  if (typeof renderSkeletons === 'function') renderSkeletons(container, 6);

  let allBirds = await db.getBirds();
  populateSpeciesFilter(allBirds);
  renderBirds(container, allBirds);

  function populateSpeciesFilter(birds) {
    if (!speciesFilter) return;
    const selected = speciesFilter.value;
    const speciesSet = new Set((birds || []).map(b => b.species ? b.species.trim() : '').filter(Boolean));
    const speciesList = Array.from(speciesSet).sort();

    speciesFilter.innerHTML = `<option value="">All Species</option>` +
      speciesList.map(s => `<option value="${s}" ${s.toLowerCase() === selected.toLowerCase() ? 'selected' : ''}>${s}</option>`).join('');
  }

  function applyFilters() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedSpecies = speciesFilter ? speciesFilter.value.toLowerCase().trim() : '';
    const selectedGender = genderFilter ? genderFilter.value.toLowerCase().trim() : '';
    const maxPrice = priceFilter && priceFilter.value ? parseFloat(priceFilter.value) : Infinity;
    const selectedAvailability = availabilityFilter ? availabilityFilter.value.toLowerCase().trim() : '';

    const filtered = (allBirds || []).filter(bird => {
      const birdName = (bird.name || '').toLowerCase();
      const birdSpecies = (bird.species || '').toLowerCase();
      const birdGender = (bird.gender || '').toLowerCase();
      const birdAvailability = (bird.availability || 'available').toLowerCase();
      const birdPrice = Number(bird.price) || 0;

      const matchesSearch = !searchTerm || birdName.includes(searchTerm) || birdSpecies.includes(searchTerm);
      const matchesSpecies = !selectedSpecies || birdSpecies === selectedSpecies;
      const matchesGender = !selectedGender || birdGender === selectedGender;
      const matchesPrice = !maxPrice || birdPrice <= maxPrice;
      const matchesAvailability = !selectedAvailability || birdAvailability === selectedAvailability;

      return matchesSearch && matchesSpecies && matchesGender && matchesPrice && matchesAvailability;
    });

    renderBirds(container, filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (speciesFilter) speciesFilter.addEventListener('change', applyFilters);
  if (genderFilter) genderFilter.addEventListener('change', applyFilters);
  if (priceFilter) priceFilter.addEventListener('input', applyFilters);
  if (availabilityFilter) availabilityFilter.addEventListener('change', applyFilters);
});

function renderBirds(container, birds) {
  if (!birds || birds.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h3>No Birds Available</h3>
        <p>New birds may be added soon. Check back or reset filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = birds.map(createBirdCardHtml).join('');
}
