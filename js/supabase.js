/* ==========================================================================
   Pet Haven - Data Layer & Instant-Load Supabase Sync Adapter
   ========================================================================== */

let supabaseClient = null;

if (typeof supabase !== 'undefined' && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_URL.startsWith('http')) {
  try {
    supabaseClient = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  } catch (err) {
    console.warn('Supabase init warning:', err);
  }
} else if (typeof window !== 'undefined') {
  console.warn('Supabase is not configured. Using LocalStorage fallback for offline demo mode.');
}

class StoreAdapter {
  constructor() {
    this.initLocalStorage();
  }

  initLocalStorage() {
    if (!localStorage.getItem('ph_pets')) {
      localStorage.setItem('ph_pets', JSON.stringify(INITIAL_PETS));
    }
    if (!localStorage.getItem('ph_birds')) {
      localStorage.setItem('ph_birds', JSON.stringify(INITIAL_BIRDS));
    }
    if (!localStorage.getItem('ph_products')) {
      localStorage.setItem('ph_products', JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem('ph_enquiries')) {
      localStorage.setItem('ph_enquiries', JSON.stringify(INITIAL_ENQUIRIES));
    }
  }

  getLocalPets() {
    const local = JSON.parse(localStorage.getItem('ph_pets') || '[]');
    return (local && local.length > 0) ? local : INITIAL_PETS;
  }

  getLocalBirds() {
    const local = JSON.parse(localStorage.getItem('ph_birds') || '[]');
    return (local && local.length > 0) ? local : INITIAL_BIRDS;
  }

  getLocalProducts() {
    const local = JSON.parse(localStorage.getItem('ph_products') || '[]');
    return (local && local.length > 0) ? local : INITIAL_PRODUCTS;
  }

  getLocalEnquiries() {
    const local = JSON.parse(localStorage.getItem('ph_enquiries') || '[]');
    return (local && local.length > 0) ? local : INITIAL_ENQUIRIES;
  }

  // --- PETS (Instant Cache-First with Background Sync) ---
  async getPets(onSyncCallback) {
    // 1. Immediately return local cached items for 0ms render speed
    const localPets = this.getLocalPets();

    // 2. Fetch latest from Supabase in background (Non-blocking)
    if (supabaseClient) {
      setTimeout(async () => {
        try {
          const { data, error } = await supabaseClient.from('pets').select('*').order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const supabaseIds = new Set(data.map(p => p.id));
            const customLocal = localPets.filter(p => !supabaseIds.has(p.id));
            const merged = [...data, ...customLocal];
            localStorage.setItem('ph_pets', JSON.stringify(merged));
            if (typeof onSyncCallback === 'function') {
              onSyncCallback(merged);
            }
          } else if (error) {
            console.error('Supabase pets sync failed:', error);
          }
        } catch (e) {
          console.error('Supabase pets fetch failed:', e);
        }
      }, 0);
    }

    return localPets;
  }

  async getPetById(id) {
    const pets = this.getLocalPets();
    return pets.find(p => p.id === id) || null;
  }

  async savePet(petData) {
    // 1. Save locally immediately
    const pets = this.getLocalPets();
    if (!petData.id) petData.id = 'pet-' + Date.now();
    
    const index = pets.findIndex(p => p.id === petData.id);
    if (index !== -1) pets[index] = { ...pets[index], ...petData };
    else pets.unshift(petData);
    
    localStorage.setItem('ph_pets', JSON.stringify(pets));

    // 2. Sync to Supabase in background
    if (supabaseClient) {
      setTimeout(async () => {
        try {
          if (petData.id && !petData.id.startsWith('pet-')) {
            await supabaseClient.from('pets').update({
              name: petData.name, category: petData.category, breed: petData.breed,
              age: petData.age, gender: petData.gender, price: petData.price,
              description: petData.description, care_info: petData.careInfo,
              images: petData.images, availability: petData.availability
            }).eq('id', petData.id);
          } else {
            const payload = { ...petData };
            delete payload.id;
            await supabaseClient.from('pets').insert([payload]);
          }
        } catch (e) {
          console.error('Supabase pets save failed:', e);
        }
      }, 0);
    }

    return petData;
  }

  async deletePet(id) {
    let pets = this.getLocalPets().filter(p => p.id !== id);
    localStorage.setItem('ph_pets', JSON.stringify(pets));

    if (supabaseClient && !id.startsWith('pet-')) {
      setTimeout(async () => {
        try { await supabaseClient.from('pets').delete().eq('id', id); } catch (e) {
          console.error('Supabase pets delete failed:', e);
        }
      }, 0);
    }
    return true;
  }

  // --- BIRDS (Instant Cache-First with Background Sync) ---
  async getBirds(onSyncCallback) {
    const localBirds = this.getLocalBirds();

    if (supabaseClient) {
      setTimeout(async () => {
        try {
          const { data, error } = await supabaseClient.from('birds').select('*').order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const supabaseIds = new Set(data.map(b => b.id));
            const customLocal = localBirds.filter(b => !supabaseIds.has(b.id));
            const merged = [...data, ...customLocal];
            localStorage.setItem('ph_birds', JSON.stringify(merged));
            if (typeof onSyncCallback === 'function') {
              onSyncCallback(merged);
            }
          } else if (error) {
            console.error('Supabase birds sync failed:', error);
          }
        } catch (e) {
          console.error('Supabase birds fetch failed:', e);
        }
      }, 0);
    }

    return localBirds;
  }

  async getBirdById(id) {
    const birds = this.getLocalBirds();
    return birds.find(b => b.id === id) || null;
  }

  async saveBird(birdData) {
    const birds = this.getLocalBirds();
    if (!birdData.id) birdData.id = 'bird-' + Date.now();

    const index = birds.findIndex(b => b.id === birdData.id);
    if (index !== -1) birds[index] = { ...birds[index], ...birdData };
    else birds.unshift(birdData);

    localStorage.setItem('ph_birds', JSON.stringify(birds));

    if (supabaseClient) {
      setTimeout(async () => {
        try {
          if (birdData.id && !birdData.id.startsWith('bird-')) {
            await supabaseClient.from('birds').update({
              name: birdData.name, species: birdData.species, age: birdData.age,
              gender: birdData.gender, price: birdData.price, description: birdData.description,
              images: birdData.images, availability: birdData.availability
            }).eq('id', birdData.id);
          } else {
            const payload = { ...birdData };
            delete payload.id;
            await supabaseClient.from('birds').insert([payload]);
          }
        } catch (e) {
          console.error('Supabase birds save failed:', e);
        }
      }, 0);
    }

    return birdData;
  }

  async deleteBird(id) {
    let birds = this.getLocalBirds().filter(b => b.id !== id);
    localStorage.setItem('ph_birds', JSON.stringify(birds));

    if (supabaseClient && !id.startsWith('bird-')) {
      setTimeout(async () => {
        try { await supabaseClient.from('birds').delete().eq('id', id); } catch (e) {
          console.error('Supabase birds delete failed:', e);
        }
      }, 0);
    }
    return true;
  }

  // --- PRODUCTS (Instant Cache-First with Background Sync) ---
  async getProducts(onSyncCallback) {
    const localProducts = this.getLocalProducts();

    if (supabaseClient) {
      setTimeout(async () => {
        try {
          const { data, error } = await supabaseClient.from('products').select('*').order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const supabaseIds = new Set(data.map(p => p.id));
            const customLocal = localProducts.filter(p => !supabaseIds.has(p.id));
            const merged = [...data, ...customLocal];
            localStorage.setItem('ph_products', JSON.stringify(merged));
            if (typeof onSyncCallback === 'function') {
              onSyncCallback(merged);
            }
          } else if (error) {
            console.error('Supabase products sync failed:', error);
          }
        } catch (e) {
          console.error('Supabase products fetch failed:', e);
        }
      }, 0);
    }

    return localProducts;
  }

  async getProductById(id) {
    const products = this.getLocalProducts();
    return products.find(p => p.id === id) || null;
  }

  async saveProduct(productData) {
    const products = this.getLocalProducts();
    if (!productData.id) productData.id = 'prod-' + Date.now();

    const index = products.findIndex(p => p.id === productData.id);
    if (index !== -1) products[index] = { ...products[index], ...productData };
    else products.unshift(productData);

    localStorage.setItem('ph_products', JSON.stringify(products));

    if (supabaseClient) {
      setTimeout(async () => {
        try {
          if (productData.id && !productData.id.startsWith('prod-')) {
            await supabaseClient.from('products').update({
              name: productData.name, category: productData.category, brand: productData.brand,
              price: productData.price, stock: productData.stock, description: productData.description,
              images: productData.images, availability: productData.availability
            }).eq('id', productData.id);
          } else {
            const payload = { ...productData };
            delete payload.id;
            await supabaseClient.from('products').insert([payload]);
          }
        } catch (e) {
          console.error('Supabase products save failed:', e);
        }
      }, 0);
    }

    return productData;
  }

  async deleteProduct(id) {
    let products = this.getLocalProducts().filter(p => p.id !== id);
    localStorage.setItem('ph_products', JSON.stringify(products));

    if (supabaseClient && !id.startsWith('prod-')) {
      setTimeout(async () => {
        try { await supabaseClient.from('products').delete().eq('id', id); } catch (e) {
          console.error('Supabase products delete failed:', e);
        }
      }, 0);
    }
    return true;
  }

  // --- ENQUIRIES (Instant Cache-First) ---
  async getEnquiries(onSyncCallback) {
    const localEnquiries = this.getLocalEnquiries();

    if (supabaseClient) {
      setTimeout(async () => {
        try {
          const { data, error } = await supabaseClient.from('enquiries').select('*').order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const list = data.map(e => ({
              id: e.id, customerName: e.customer_name, phone: e.phone,
              email: e.email, itemTitle: e.item_title, message: e.message,
              status: e.status, date: (e.created_at || '').split('T')[0]
            }));
            const ids = new Set(list.map(e => e.id));
            const custom = localEnquiries.filter(e => !ids.has(e.id));
            const merged = [...list, ...custom];
            localStorage.setItem('ph_enquiries', JSON.stringify(merged));
            if (typeof onSyncCallback === 'function') onSyncCallback(merged);
          } else if (error) {
            console.error('Supabase enquiries sync failed:', error);
          }
        } catch (e) {
          console.error('Supabase enquiries fetch failed:', e);
        }
      }, 0);
    }

    return localEnquiries;
  }

  async saveEnquiry(enquiry) {
    const list = this.getLocalEnquiries();
    if (!enquiry.id) enquiry.id = 'enq-' + Date.now();
    enquiry.date = new Date().toISOString().split('T')[0];
    enquiry.status = 'New';
    list.unshift(enquiry);
    localStorage.setItem('ph_enquiries', JSON.stringify(list));

    if (supabaseClient) {
      setTimeout(async () => {
        try {
          await supabaseClient.from('enquiries').insert([{
            customer_name: enquiry.customerName, phone: enquiry.phone,
            email: enquiry.email, item_title: enquiry.itemTitle,
            message: enquiry.message, status: 'New'
          }]);
        } catch (e) {
          console.error('Supabase enquiries save failed:', e);
        }
      }, 0);
    }

    return enquiry;
  }

  async updateEnquiryStatus(id, status) {
    const list = this.getLocalEnquiries();
    const item = list.find(e => e.id === id);
    if (item) {
      item.status = status;
      localStorage.setItem('ph_enquiries', JSON.stringify(list));
    }

    if (supabaseClient && !id.startsWith('enq-')) {
      setTimeout(async () => {
        try { await supabaseClient.from('enquiries').update({ status }).eq('id', id); } catch (e) {
          console.error('Supabase enquiry status update failed:', e);
        }
      }, 0);
    }
    return item;
  }

  async deleteEnquiry(id) {
    let list = this.getLocalEnquiries().filter(e => e.id !== id);
    localStorage.setItem('ph_enquiries', JSON.stringify(list));

    if (supabaseClient && !id.startsWith('enq-')) {
      setTimeout(async () => {
        try { await supabaseClient.from('enquiries').delete().eq('id', id); } catch (e) {
          console.error('Supabase enquiry delete failed:', e);
        }
      }, 0);
    }
    return true;
  }
}

const db = new StoreAdapter();
