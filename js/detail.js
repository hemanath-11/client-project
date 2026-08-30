/* ==========================================================================
   Pet Haven - Dynamic Detail Page Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get('id');
  const type = window.DETAIL_TYPE || 'pet'; // 'pet', 'bird', or 'product'

  const container = document.getElementById('detail-container');
  if (!container) return;

  if (!itemId) {
    container.innerHTML = `<div class="empty-state"><h3>Item Not Found</h3><a href="index.html" class="btn btn-primary">Return to Home</a></div>`;
    return;
  }

  let item = null;
  if (type === 'pet') {
    item = await db.getPetById(itemId);
  } else if (type === 'bird') {
    item = await db.getBirdById(itemId);
  } else if (type === 'product') {
    item = await db.getProductById(itemId);
  }

  if (!item) {
    container.innerHTML = `<div class="empty-state"><h3>Item Not Found</h3><a href="index.html" class="btn btn-primary">Return to Home</a></div>`;
    return;
  }

  renderDetail(container, item, type);
});

function renderDetail(container, item, type) {
  const images = (item.images && item.images.length > 0) ? item.images : ['assets/hero_pets.jpg'];
  const mainImg = images[0];
  const title = item.name;
  const price = formatCurrency(item.price);
  const waUrl = generateWhatsAppUrl(title, item.price);

  let specsHtml = '';
  if (type === 'pet') {
    specsHtml = `
      <div class="spec-item"><span>Category</span><span>${item.category}</span></div>
      <div class="spec-item"><span>Breed</span><span>${item.breed}</span></div>
      <div class="spec-item"><span>Age</span><span>${item.age}</span></div>
      <div class="spec-item"><span>Gender</span><span>${item.gender}</span></div>
    `;
  } else if (type === 'bird') {
    specsHtml = `
      <div class="spec-item"><span>Species</span><span>${item.species}</span></div>
      <div class="spec-item"><span>Age</span><span>${item.age}</span></div>
      <div class="spec-item"><span>Gender</span><span>${item.gender}</span></div>
      <div class="spec-item"><span>Status</span><span>${item.availability}</span></div>
    `;
  } else {
    specsHtml = `
      <div class="spec-item"><span>Category</span><span>${item.category}</span></div>
      <div class="spec-item"><span>Brand</span><span>${item.brand}</span></div>
      <div class="spec-item"><span>Stock</span><span>${item.stock || 'In Stock'} units</span></div>
      <div class="spec-item"><span>Status</span><span>${item.availability}</span></div>
    `;
  }

  const html = `
    <div class="detail-grid">
      <div class="detail-gallery">
        <img id="main-gallery-img" class="gallery-main-img" src="${mainImg}" alt="${title}" onerror="this.src='assets/hero_pets.jpg'">
        <div class="gallery-thumbs">
          ${images.map((img, idx) => `
            <img class="gallery-thumb ${idx === 0 ? 'active' : ''}" src="${img}" alt="Thumbnail ${idx+1}" onclick="switchGalleryImg(this, '${img}')">
          `).join('')}
        </div>
      </div>
      <div class="detail-info-box">
        <span class="badge ${item.availability === 'Available' || item.availability === 'In Stock' ? 'badge-available' : 'badge-adopted'}" style="align-self: flex-start; margin-bottom: 1rem;">
          ${item.availability}
        </span>
        <h1 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem; color: #0F172A;">${title}</h1>
        <div style="font-size: 2rem; font-weight: 800; color: var(--primary-800); margin-bottom: 1.5rem;">${price}</div>

        <p class="text-muted" style="margin-bottom: 1.5rem; line-height: 1.7;">
          ${item.description}
        </p>

        <div class="detail-specs-grid">
          ${specsHtml}
        </div>

        ${item.careInfo ? `
          <div style="background: #E6F4EA; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; border-left: 4px solid var(--primary-700);">
            <strong style="color: var(--primary-900); display: block; margin-bottom: 0.25rem;">Care Information:</strong>
            <span style="font-size: 0.9rem; color: #1E293B;">${item.careInfo}</span>
          </div>
        ` : ''}

        <div style="display: flex; gap: 1rem; margin-top: auto; padding-top: 1rem;">
          <a href="${waUrl}" target="_blank" class="btn btn-whatsapp" style="flex: 1; min-height: 52px; font-size: 1.05rem;">
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            Enquire on WhatsApp
          </a>
          <button onclick="openEnquiryModal('${title}')" class="btn btn-primary" style="flex: 1; min-height: 52px; font-size: 1.05rem;">
            Submit Enquiry
          </button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function switchGalleryImg(thumbEl, src) {
  const mainImg = document.getElementById('main-gallery-img');
  if (mainImg) mainImg.src = src;

  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumbEl.classList.add('active');
}

function openEnquiryModal(itemTitle) {
  let modal = document.getElementById('enquiry-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'enquiry-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 style="font-weight: 700;">Enquire About <span id="modal-item-title"></span></h3>
          <button onclick="closeEnquiryModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <form id="enquiry-form" onsubmit="handleEnquirySubmit(event)">
          <div class="modal-body" style="display: flex; flex-direction: column; gap: 1rem;">
            <input type="hidden" id="enq-item-title" name="itemTitle">
            <div class="form-group">
              <label class="form-label">Your Name</label>
              <input type="text" id="enq-name" class="form-input" required placeholder="e.g. John Doe">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" id="enq-phone" class="form-input" required placeholder="e.g. +91 9876543210">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" id="enq-email" class="form-input" required placeholder="e.g. john@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Your Message</label>
              <textarea id="enq-message" class="form-input" rows="3" required placeholder="Ask any questions or request visiting details..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" onclick="closeEnquiryModal()" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary">Submit Enquiry</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('modal-item-title').textContent = itemTitle;
  document.getElementById('enq-item-title').value = itemTitle;
  modal.classList.add('active');
}

function closeEnquiryModal() {
  const modal = document.getElementById('enquiry-modal');
  if (modal) modal.classList.remove('active');
}

async function handleEnquirySubmit(e) {
  e.preventDefault();
  const name = document.getElementById('enq-name').value;
  const phone = document.getElementById('enq-phone').value;
  const email = document.getElementById('enq-email').value;
  const itemTitle = document.getElementById('enq-item-title').value;
  const message = document.getElementById('enq-message').value;

  await db.saveEnquiry({
    customerName: name,
    phone: phone,
    email: email,
    itemTitle: itemTitle,
    message: message
  });

  closeEnquiryModal();
  showToast('Thank you! Your enquiry has been submitted. We will contact you soon.', 'success');
}
