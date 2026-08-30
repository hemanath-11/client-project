# Pet Haven - Pet Shop Web Application

A fully responsive, production-ready pet shop web application based on custom Figma design specifications. Includes customer-facing catalog pages (Pets, Birds, Products, Details, Contact) and an Admin Dashboard (`/admin`) for inventory management and customer enquiries.

---

## 🌟 Key Features

1. **Figma Visual Fidelity**: Rebuilt layout, typography (`Inter`), colors (Forest/Emerald Green `#0F766E`, soft periwinkle footer `#DCE6F1`), and 16px rounded card design.
2. **Responsive Design**: Tested and optimized for Desktop (1440px), Laptop (1024px), Tablet (768px), and Mobile (430px, 390px, 375px) with mobile drawer navigation.
3. **Data-Driven Architecture**: JavaScript components render cards dynamically from data structures.
4. **Offline & Supabase Prepared**: Features a built-in LocalStorage data adapter that lets store managers test all CRUD operations, filtering, and enquiries immediately offline, as well as a pre-wired Supabase adapter layer (`js/supabase.js`).
5. **Dynamic WhatsApp Enquiries**: Direct WhatsApp button generation with encoded pre-filled item titles and pricing. Configurable via `js/config.js`.
6. **Admin Dashboard (`/admin`)**:
   - Authentication guard (`/admin/login.html`)
   - Overview metrics counters (Total Pets, Available Pets, Total Birds, Products in Stock, New Enquiries)
   - Add/Edit/Delete modals for Pets, Birds, and Products
   - Image upload preview and removal
   - Enquiry status tracking (New, Contacted, Completed)

---

## 🚀 Running Locally

Because this application uses standard HTML, CSS, and JavaScript, you can run it directly:

### Option 1: Live Server / VS Code
Open the project directory in VS Code and click **Go Live** with the Live Server extension.

### Option 2: Node.js / npx http-server
```bash
npx http-server -p 3000
```
Open `http://localhost:3000` in your browser.

---

## 🔐 Admin Dashboard Access

- **Login URL**: `/admin/login.html` or click the link in the site footer.
- **Default Credentials**:
  - **Email**: `admin@pethaven.com`
  - **Password**: `admin123`

---

## 🗄️ Supabase Database Setup & Schema

To connect your own live Supabase backend:

1. Create a project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and run the following migration script:

```sql
-- Create Pets Table
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  age VARCHAR(50) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  care_info TEXT,
  images TEXT[] DEFAULT '{}',
  availability VARCHAR(50) DEFAULT 'Available',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Birds Table
CREATE TABLE birds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  age VARCHAR(50) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  availability VARCHAR(50) DEFAULT 'Available',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  availability VARCHAR(50) DEFAULT 'In Stock',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Enquiries Table
CREATE TABLE enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  item_title VARCHAR(255) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Update `js/config.js` with your Supabase credentials:
```javascript
SUPABASE_URL: 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co',
SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY'
```

---

## ⚡ Deployment to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Log into [https://vercel.com](https://vercel.com) and click **Add New Project**.
3. Select your repository.
4. Framework Preset: **Other** / **Static HTML**.
5. Click **Deploy**. Vercel will immediately deploy your site with global CDN SSL!
