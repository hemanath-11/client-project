/* ==========================================================================
   Pet Haven - Pure Live Supabase Cloud Database REST & JS Adapter
   ========================================================================== */

class StoreAdapter {
  constructor() {
    this.baseUrl = (CONFIG.SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    this.apiKey = CONFIG.SUPABASE_ANON_KEY || '';
  }

  getHeaders() {
    return {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // --- PETS ---
  async getPets(onSyncCallback) {
    try {
      const res = await fetch(`${this.baseUrl}/rest/v1/pets?select=*&order=created_at.desc`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!res.ok) {
        console.error('Supabase fetch error (pets): HTTP', res.status);
        return [];
      }
      const data = await res.json();
      if (typeof onSyncCallback === 'function') onSyncCallback(data || []);
      return data || [];
    } catch (e) {
      console.error('Database query exception (pets):', e);
      return [];
    }
  }

  async getPetById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/rest/v1/pets?id=eq.${id}&select=*`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!res.ok) return null;
      const data = await res.json();
      return (data && data.length > 0) ? data[0] : null;
    } catch (e) {
      console.error('Database query exception (pet by id):', e);
      return null;
    }
  }

  async savePet(petData) {
    const payload = {
      name: petData.name,
      category: petData.category,
      breed: petData.breed,
      age: petData.age,
      gender: petData.gender,
      price: petData.price,
      description: petData.description,
      care_info: petData.careInfo,
      images: Array.isArray(petData.images) ? petData.images : [petData.images],
      availability: petData.availability || 'Available'
    };

    if (petData.id && !petData.id.startsWith('pet-')) {
      const res = await fetch(`${this.baseUrl}/rest/v1/pets?id=eq.${petData.id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to update pet: ${err}`);
      }
      const data = await res.json();
      return (data && data.length > 0) ? data[0] : payload;
    } else {
      const res = await fetch(`${this.baseUrl}/rest/v1/pets`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify([payload])
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to create pet: ${err}`);
      }
      const data = await res.json();
      return (data && data.length > 0) ? data[0] : payload;
    }
  }

  async deletePet(id) {
    const res = await fetch(`${this.baseUrl}/rest/v1/pets?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to delete pet: ${err}`);
    }
    return true;
  }

  // --- BIRDS ---
  async getBirds(onSyncCallback) {
    try {
      const res = await fetch(`${this.baseUrl}/rest/v1/birds?select=*&order=created_at.desc`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!res.ok) {
        console.error('Supabase fetch error (birds): HTTP', res.status);
        return [];
      }
      const data = await res.json();
      if (typeof onSyncCallback === 'function') onSyncCallback(data || []);
      return data || [];
    } catch (e) {
      console.error('Database query exception (birds):', e);
      return [];
    }
  }

  async getBirdById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/rest/v1/birds?id=eq.${id}&select=*`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!res.ok) return null;
      const data = await res.json();
      return (data && data.length > 0) ? data[0] : null;
    } catch (e) {
      console.error('Database query exception (bird by id):', e);
      return null;
    }
  }

  async saveBird(birdData) {
    const payload = {
      name: birdData.name,
      species: birdData.species,
      age: birdData.age,
      gender: birdData.gender,
      price: birdData.price,
      description: birdData.description,
      images: Array.isArray(birdData.images) ? birdData.images : [birdData.images],
      availability: birdData.availability || 'Available'
    };

    if (birdData.id && !birdData.id.startsWith('bird-')) {
      const res = await fetch(`${this.baseUrl}/rest/v1/birds?id=eq.${birdData.id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to update bird: ${err}`);
      }
      const data = await res.json();
      return (data && data.length > 0) ? data[0] : payload;
    } else {
      const res = await fetch(`${this.baseUrl}/rest/v1/birds`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify([payload])
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to create bird: ${err}`);
      }
      const data = await res.json();
      return (data && data.length > 0) ? data[0] : payload;
    }
  }

  async deleteBird(id) {
    const res = await fetch(`${this.baseUrl}/rest/v1/birds?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to delete bird: ${err}`);
    }
    return true;
  }

  // --- PRODUCTS ---
  async getProducts(onSyncCallback) {
    try {
      const res = await fetch(`${this.baseUrl}/rest/v1/products?select=*&order=created_at.desc`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!res.ok) {
        console.error('Supabase fetch error (products): HTTP', res.status);
        return [];
      }
      const data = await res.json();
      if (typeof onSyncCallback === 'function') onSyncCallback(data || []);
      return data || [];
    } catch (e) {
      console.error('Database query exception (products):', e);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/rest/v1/products?id=eq.${id}&select=*`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!res.ok) return null;
      const data = await res.json();
      return (data && data.length > 0) ? data[0] : null;
    } catch (e) {
      console.error('Database query exception (product by id):', e);
      return null;
    }
  }

  async saveProduct(productData) {
    const payload = {
      name: productData.name,
      category: productData.category,
      brand: productData.brand,
      price: productData.price,
      stock: productData.stock,
      description: productData.description,
      images: Array.isArray(productData.images) ? productData.images : [productData.images],
      availability: productData.availability || 'In Stock'
    };

    if (productData.id && !productData.id.startsWith('prod-')) {
      const res = await fetch(`${this.baseUrl}/rest/v1/products?id=eq.${productData.id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to update product: ${err}`);
      }
      const data = await res.json();
      return (data && data.length > 0) ? data[0] : payload;
    } else {
      const res = await fetch(`${this.baseUrl}/rest/v1/products`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify([payload])
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to create product: ${err}`);
      }
      const data = await res.json();
      return (data && data.length > 0) ? data[0] : payload;
    }
  }

  async deleteProduct(id) {
    const res = await fetch(`${this.baseUrl}/rest/v1/products?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to delete product: ${err}`);
    }
    return true;
  }

  // --- ENQUIRIES ---
  async getEnquiries() {
    try {
      const res = await fetch(`${this.baseUrl}/rest/v1/enquiries?select=*&order=created_at.desc`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data || []).map(e => ({
        id: e.id,
        customerName: e.customer_name,
        phone: e.phone,
        email: e.email,
        itemTitle: e.item_title,
        message: e.message,
        status: e.status || 'New',
        date: (e.created_at || '').split('T')[0]
      }));
    } catch (e) {
      console.error('Database query exception (enquiries):', e);
      return [];
    }
  }

  async saveEnquiry(enquiry) {
    const payload = {
      customer_name: enquiry.customerName,
      phone: enquiry.phone,
      email: enquiry.email,
      item_title: enquiry.itemTitle,
      message: enquiry.message,
      status: 'New'
    };

    const res = await fetch(`${this.baseUrl}/rest/v1/enquiries`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify([payload])
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to create enquiry: ${err}`);
    }
    const data = await res.json();
    return (data && data.length > 0) ? data[0] : payload;
  }

  async updateEnquiryStatus(id, status) {
    const res = await fetch(`${this.baseUrl}/rest/v1/enquiries?id=eq.${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to update enquiry status: ${err}`);
    }
    return true;
  }

  async deleteEnquiry(id) {
    const res = await fetch(`${this.baseUrl}/rest/v1/enquiries?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to delete enquiry: ${err}`);
    }
    return true;
  }
}

const db = new StoreAdapter();
