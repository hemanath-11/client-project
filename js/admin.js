/* ==========================================================================
   Pet Haven - Admin Dashboard Logic & Management Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // Check admin session if on admin pages except login
  const path = window.location.pathname.toLowerCase();
  const isLoginPage = path.includes('login');
  const session = localStorage.getItem(CONFIG.ADMIN_AUTH_KEY);

  if (!isLoginPage && !session) {
    window.location.href = 'login.html';
    return;
  }

  // Handle Login Page Submit
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      if (email && password.length >= 6) {
        localStorage.setItem(CONFIG.ADMIN_AUTH_KEY, JSON.stringify({ email, token: 'admin-token-' + Date.now() }));
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'index.html', 600);
      } else {
        showToast('Invalid credentials. Password must be at least 6 characters.', 'error');
      }
    });
    return;
  }

  // Admin Logout Helper
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem(CONFIG.ADMIN_AUTH_KEY);
      window.location.href = 'login.html';
    });
  }

  // Load Dashboard Summary Metrics
  if (document.getElementById('metric-total-pets')) {
    loadDashboardMetrics();
  }

  // Load Data Tables
  if (document.getElementById('admin-pets-table')) loadPetsTable();
  if (document.getElementById('admin-birds-table')) loadBirdsTable();
  if (document.getElementById('admin-products-table')) loadProductsTable();
  if (document.getElementById('admin-enquiries-table')) loadEnquiriesTable();
});

// Dashboard Metrics Counter
async function loadDashboardMetrics() {
  try {
    const pets = await db.getPets();
    const birds = await db.getBirds();
    const products = await db.getProducts();
    const enquiries = await db.getEnquiries();

    const totalPets = pets.length;
    const availPets = pets.filter(p => (p.availability || '').toLowerCase() === 'available').length;
    const totalBirds = birds.length;
    const availBirds = birds.filter(b => (b.availability || '').toLowerCase() === 'available').length;
    const totalProducts = products.length;
    const inStockProds = products.filter(pr => (pr.availability || '').toLowerCase().includes('stock')).length;
    const newEnq = enquiries.filter(e => (e.status || '').toLowerCase() === 'new').length;

    if (document.getElementById('metric-total-pets')) document.getElementById('metric-total-pets').textContent = totalPets;
    if (document.getElementById('metric-avail-pets')) document.getElementById('metric-avail-pets').textContent = availPets;
    if (document.getElementById('metric-total-birds')) document.getElementById('metric-total-birds').textContent = totalBirds;
    if (document.getElementById('metric-avail-birds')) document.getElementById('metric-avail-birds').textContent = availBirds;
    if (document.getElementById('metric-total-prods')) document.getElementById('metric-total-prods').textContent = totalProducts;
    if (document.getElementById('metric-instock-prods')) document.getElementById('metric-instock-prods').textContent = inStockProds;
    if (document.getElementById('metric-new-enquiries')) document.getElementById('metric-new-enquiries').textContent = newEnq;
  } catch (err) {
    console.error('Error loading metrics:', err);
  }
}

// Canvas Image Compression Helper (Downscales large phone camera photos)
function compressImage(file, maxDimension, quality, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Image Preview Handler for Forms
function handleImagePreview(fileInput, previewContainerId) {
  const container = document.getElementById(previewContainerId);
  if (!container) return;

  const files = Array.from(fileInput.files);
  files.forEach((file) => {
    compressImage(file, 800, 0.75, (compressedDataUrl) => {
      const thumb = document.createElement('div');
      thumb.className = 'image-preview-thumb';
      thumb.innerHTML = `
        <img src="${compressedDataUrl}" alt="Preview">
        <button type="button" class="image-preview-remove" onclick="this.parentElement.remove()">&times;</button>
      `;
      container.appendChild(thumb);
    });
  });
}

// Safe Helper to extract first image URL
function getFirstImageUrl(images) {
  if (Array.isArray(images) && images.length > 0) return images[0];
  if (typeof images === 'string' && images.length > 0) return images;
  return '../assets/hero_pets.jpg';
}

/* ================= PETS CRUD ================= */
async function loadPetsTable() {
  const tbody = document.getElementById('pets-table-body');
  if (!tbody) return;

  try {
    const pets = await db.getPets();
    if (!pets || pets.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 2rem;">No pets found. Click "Add New Pet" to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = pets.map(pet => `
      <tr>
        <td><img src="${getFirstImageUrl(pet.images)}" class="table-img-thumb" alt="${pet.name}" onerror="this.src='../assets/hero_pets.jpg'"></td>
        <td><strong>${pet.name}</strong></td>
        <td>${pet.category} (${pet.breed})</td>
        <td>${pet.age} / ${pet.gender}</td>
        <td>${formatCurrency(pet.price)}</td>
        <td><span class="badge ${(pet.availability || 'Available').toLowerCase() === 'available' ? 'badge-available' : 'badge-adopted'}">${pet.availability || 'Available'}</span></td>
        <td class="actions-cell">
          <button onclick="openEditPetModal('${pet.id}')" class="btn btn-outline btn-sm">Edit</button>
          <button onclick="confirmDeletePet('${pet.id}', '${(pet.name || '').replace(/'/g, "\\'")}')" class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #FCA5A5;">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading pets table:', err);
  }
}

function openAddPetModal() {
  document.getElementById('pet-modal-title').textContent = 'Add New Pet';
  document.getElementById('pet-id').value = '';
  document.getElementById('pet-form').reset();
  document.getElementById('pet-image-previews').innerHTML = '';
  document.getElementById('pet-modal').classList.add('active');
}

async function openEditPetModal(id) {
  try {
    const pet = await db.getPetById(id);
    if (!pet) return;

    document.getElementById('pet-modal-title').textContent = 'Edit Pet';
    document.getElementById('pet-id').value = pet.id;
    document.getElementById('pet-name').value = pet.name;
    document.getElementById('pet-category').value = pet.category;
    document.getElementById('pet-breed').value = pet.breed;
    document.getElementById('pet-age').value = pet.age;
    document.getElementById('pet-gender').value = pet.gender;
    document.getElementById('pet-price').value = pet.price;
    document.getElementById('pet-availability').value = pet.availability;
    document.getElementById('pet-description').value = pet.description;
    document.getElementById('pet-care').value = pet.careInfo || '';

    const previewContainer = document.getElementById('pet-image-previews');
    const imgs = Array.isArray(pet.images) ? pet.images : (pet.images ? [pet.images] : []);
    previewContainer.innerHTML = imgs.map(img => `
      <div class="image-preview-thumb">
        <img src="${img}">
        <button type="button" class="image-preview-remove" onclick="this.parentElement.remove()">&times;</button>
      </div>
    `).join('');

    document.getElementById('pet-modal').classList.add('active');
  } catch (err) {
    console.error('Error opening edit pet modal:', err);
  }
}

function closePetModal() {
  document.getElementById('pet-modal').classList.remove('active');
}

async function savePetForm(e) {
  e.preventDefault();
  try {
    const id = document.getElementById('pet-id').value;
    const name = document.getElementById('pet-name').value;
    const category = document.getElementById('pet-category').value;
    const breed = document.getElementById('pet-breed').value;
    const age = document.getElementById('pet-age').value;
    const gender = document.getElementById('pet-gender').value;
    const price = parseFloat(document.getElementById('pet-price').value);
    const availability = document.getElementById('pet-availability').value;
    const description = document.getElementById('pet-description').value;
    const careInfo = document.getElementById('pet-care').value;

    const previewImgs = Array.from(document.querySelectorAll('#pet-image-previews img')).map(img => img.src);
    const images = previewImgs.length > 0 ? previewImgs : ['../assets/hero_pets.jpg'];

    await db.savePet({
      id: id || undefined,
      name, category, breed, age, gender, price, availability, description, careInfo, images
    });

    closePetModal();
    showToast(id ? 'Pet updated successfully!' : 'Pet added successfully!', 'success');
    loadPetsTable();
  } catch (err) {
    console.error('Error saving pet:', err);
    showToast('Failed to save pet: ' + err.message, 'error');
  }
}

async function confirmDeletePet(id, name) {
  if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
    await db.deletePet(id);
    showToast(`Deleted ${name}`, 'success');
    loadPetsTable();
  }
}

/* ================= BIRDS CRUD ================= */
async function loadBirdsTable() {
  const tbody = document.getElementById('birds-table-body');
  if (!tbody) return;

  try {
    const birds = await db.getBirds();
    if (!birds || birds.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 2rem;">No birds found. Click "Add New Bird" to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = birds.map(bird => `
      <tr>
        <td><img src="${getFirstImageUrl(bird.images)}" class="table-img-thumb" alt="${bird.name}" onerror="this.src='../assets/hero_pets.jpg'"></td>
        <td><strong>${bird.name}</strong></td>
        <td>${bird.species}</td>
        <td>${bird.age} / ${bird.gender}</td>
        <td>${formatCurrency(bird.price)}</td>
        <td><span class="badge ${(bird.availability || 'Available').toLowerCase() === 'available' ? 'badge-available' : 'badge-adopted'}">${bird.availability || 'Available'}</span></td>
        <td class="actions-cell">
          <button onclick="openEditBirdModal('${bird.id}')" class="btn btn-outline btn-sm">Edit</button>
          <button onclick="confirmDeleteBird('${bird.id}', '${(bird.name || '').replace(/'/g, "\\'")}')" class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #FCA5A5;">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading birds table:', err);
  }
}

function openAddBirdModal() {
  document.getElementById('bird-modal-title').textContent = 'Add New Bird';
  document.getElementById('bird-id').value = '';
  document.getElementById('bird-form').reset();
  document.getElementById('bird-image-previews').innerHTML = '';
  document.getElementById('bird-modal').classList.add('active');
}

async function openEditBirdModal(id) {
  try {
    const bird = await db.getBirdById(id);
    if (!bird) return;

    document.getElementById('bird-modal-title').textContent = 'Edit Bird';
    document.getElementById('bird-id').value = bird.id;
    document.getElementById('bird-name').value = bird.name;
    document.getElementById('bird-species').value = bird.species;
    document.getElementById('bird-age').value = bird.age;
    document.getElementById('bird-gender').value = bird.gender;
    document.getElementById('bird-price').value = bird.price;
    document.getElementById('bird-availability').value = bird.availability;
    document.getElementById('bird-description').value = bird.description;

    const previewContainer = document.getElementById('bird-image-previews');
    const imgs = Array.isArray(bird.images) ? bird.images : (bird.images ? [bird.images] : []);
    previewContainer.innerHTML = imgs.map(img => `
      <div class="image-preview-thumb">
        <img src="${img}">
        <button type="button" class="image-preview-remove" onclick="this.parentElement.remove()">&times;</button>
      </div>
    `).join('');

    document.getElementById('bird-modal').classList.add('active');
  } catch (err) {
    console.error('Error opening edit bird modal:', err);
  }
}

function closeBirdModal() {
  document.getElementById('bird-modal').classList.remove('active');
}

async function saveBirdForm(e) {
  e.preventDefault();
  try {
    const id = document.getElementById('bird-id').value;
    const name = document.getElementById('bird-name').value;
    const species = document.getElementById('bird-species').value;
    const age = document.getElementById('bird-age').value;
    const gender = document.getElementById('bird-gender').value;
    const price = parseFloat(document.getElementById('bird-price').value);
    const availability = document.getElementById('bird-availability').value;
    const description = document.getElementById('bird-description').value;

    const previewImgs = Array.from(document.querySelectorAll('#bird-image-previews img')).map(img => img.src);
    const images = previewImgs.length > 0 ? previewImgs : ['../assets/hero_pets.jpg'];

    await db.saveBird({
      id: id || undefined,
      name, species, age, gender, price, availability, description, images
    });

    closeBirdModal();
    showToast(id ? 'Bird updated successfully!' : 'Bird added successfully!', 'success');
    loadBirdsTable();
  } catch (err) {
    console.error('Error saving bird:', err);
    showToast('Failed to save bird: ' + err.message, 'error');
  }
}

async function confirmDeleteBird(id, name) {
  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    await db.deleteBird(id);
    showToast(`Deleted ${name}`, 'success');
    loadBirdsTable();
  }
}

/* ================= PRODUCTS CRUD ================= */
async function loadProductsTable() {
  const tbody = document.getElementById('products-table-body');
  if (!tbody) return;

  try {
    const products = await db.getProducts();
    if (!products || products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 2rem;">No products found. Click "Add New Product" to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(prod => `
      <tr>
        <td><img src="${getFirstImageUrl(prod.images)}" class="table-img-thumb" alt="${prod.name}" onerror="this.src='../assets/hero_pets.jpg'"></td>
        <td><strong>${prod.name}</strong></td>
        <td>${prod.category} (${prod.brand})</td>
        <td>${prod.stock} units</td>
        <td>${formatCurrency(prod.price)}</td>
        <td><span class="badge badge-available">${prod.availability}</span></td>
        <td class="actions-cell">
          <button onclick="openEditProductModal('${prod.id}')" class="btn btn-outline btn-sm">Edit</button>
          <button onclick="confirmDeleteProduct('${prod.id}', '${(prod.name || '').replace(/'/g, "\\'")}')" class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #FCA5A5;">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading products table:', err);
  }
}

function openAddProductModal() {
  document.getElementById('product-modal-title').textContent = 'Add New Product';
  document.getElementById('product-id').value = '';
  document.getElementById('product-form').reset();
  document.getElementById('product-image-previews').innerHTML = '';
  document.getElementById('product-modal').classList.add('active');
}

async function openEditProductModal(id) {
  try {
    const prod = await db.getProductById(id);
    if (!prod) return;

    document.getElementById('product-modal-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = prod.id;
    document.getElementById('product-name').value = prod.name;
    document.getElementById('product-category').value = prod.category;
    document.getElementById('product-brand').value = prod.brand;
    document.getElementById('product-stock').value = prod.stock;
    document.getElementById('product-price').value = prod.price;
    document.getElementById('product-availability').value = prod.availability;
    document.getElementById('product-description').value = prod.description;

    const previewContainer = document.getElementById('product-image-previews');
    const imgs = Array.isArray(prod.images) ? prod.images : (prod.images ? [prod.images] : []);
    previewContainer.innerHTML = imgs.map(img => `
      <div class="image-preview-thumb">
        <img src="${img}">
        <button type="button" class="image-preview-remove" onclick="this.parentElement.remove()">&times;</button>
      </div>
    `).join('');

    document.getElementById('product-modal').classList.add('active');
  } catch (err) {
    console.error('Error opening edit product modal:', err);
  }
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('active');
}

async function saveProductForm(e) {
  e.preventDefault();
  try {
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const brand = document.getElementById('product-brand').value;
    const stock = parseInt(document.getElementById('product-stock').value);
    const price = parseFloat(document.getElementById('product-price').value);
    const availability = document.getElementById('product-availability').value;
    const description = document.getElementById('product-description').value;

    const previewImgs = Array.from(document.querySelectorAll('#product-image-previews img')).map(img => img.src);
    const images = previewImgs.length > 0 ? previewImgs : ['../assets/hero_pets.jpg'];

    await db.saveProduct({
      id: id || undefined,
      name, category, brand, stock, price, availability, description, images
    });

    closeProductModal();
    showToast(id ? 'Product updated successfully!' : 'Product added successfully!', 'success');
    loadProductsTable();
  } catch (err) {
    console.error('Error saving product:', err);
    showToast('Failed to save product: ' + err.message, 'error');
  }
}

async function confirmDeleteProduct(id, name) {
  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    await db.deleteProduct(id);
    showToast(`Deleted ${name}`, 'success');
    loadProductsTable();
  }
}

/* ================= ENQUIRIES ================= */
async function loadEnquiriesTable() {
  const tbody = document.getElementById('enquiries-table-body');
  if (!tbody) return;

  try {
    const list = await db.getEnquiries();
    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 2rem;">No enquiries recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(enq => `
      <tr>
        <td><strong>${enq.customerName}</strong></td>
        <td>${enq.phone}<br><span style="font-size:0.8rem; color:var(--text-muted);">${enq.email}</span></td>
        <td><strong>${enq.itemTitle}</strong></td>
        <td><div style="max-width: 260px; font-size: 0.85rem; color: var(--text-muted);">${enq.message}</div></td>
        <td>${enq.date}</td>
        <td>
          <select onchange="changeEnquiryStatus('${enq.id}', this.value)" class="form-select" style="padding: 0.35rem 0.5rem; font-size: 0.8rem;">
            <option value="New" ${(enq.status || '').toLowerCase() === 'new' ? 'selected' : ''}>New</option>
            <option value="Contacted" ${(enq.status || '').toLowerCase() === 'contacted' ? 'selected' : ''}>Contacted</option>
            <option value="Completed" ${(enq.status || '').toLowerCase() === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td class="actions-cell">
          <a href="https://wa.me/${(enq.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi ' + enq.customerName + ', regarding your inquiry for ' + enq.itemTitle + ' at Pet Haven:')}" target="_blank" class="btn btn-whatsapp btn-sm">
            WhatsApp
          </a>
          <button onclick="confirmDeleteEnquiry('${enq.id}', '${(enq.customerName || '').replace(/'/g, "\\'")}')" class="btn btn-outline btn-sm" style="color: var(--danger); border-color: #FCA5A5;">
            Delete
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading enquiries table:', err);
  }
}

async function changeEnquiryStatus(id, status) {
  await db.updateEnquiryStatus(id, status);
  showToast('Enquiry status updated to ' + status, 'success');
}

async function confirmDeleteEnquiry(id, customerName) {
  if (confirm(`Are you sure you want to delete the enquiry from "${customerName}"?`)) {
    await db.deleteEnquiry(id);
    showToast(`Enquiry deleted successfully`, 'success');
    loadEnquiriesTable();
  }
}
