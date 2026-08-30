/* ==========================================================================
   Pet Haven - Initial Seed Data & Mock Store
   ========================================================================== */

const INITIAL_PETS = [
  {
    id: 'pet-1',
    name: 'Cleo',
    category: 'Dog',
    breed: 'Golden Retriever',
    age: '3 Months',
    gender: 'Male',
    price: 25000,
    description: 'Playful, healthy, and vaccinated Golden Retriever puppy with pure lineage certificate. Extremely friendly with kids.',
    images: [
      'assets/hero_pets.jpg',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'Available',
    featured: true,
    careInfo: 'Requires daily walking, premium puppy kibble, and weekly brushing.'
  },
  {
    id: 'pet-2',
    name: 'Oliver',
    category: 'Cat',
    breed: 'Persian Longhair',
    age: '2.5 Months',
    gender: 'Female',
    price: 18000,
    description: 'Fluffy white Persian kitten with bright blue eyes. De-wormed, litter trained, and calm demeanor.',
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'Available',
    featured: true,
    careInfo: 'Daily coat combing required. Feed wet and dry cat food balanced diet.'
  },
  {
    id: 'pet-3',
    name: 'Max',
    category: 'Dog',
    breed: 'French Bulldog',
    age: '4 Months',
    gender: 'Male',
    price: 35000,
    description: 'Compact and energetic French Bulldog puppy. Health checked with first vaccination round completed.',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'Available',
    featured: true,
    careInfo: 'Moderate exercise needed. Keep in climate-controlled indoor space.'
  },
  {
    id: 'pet-4',
    name: 'Luna',
    category: 'Cat',
    breed: 'British Shorthair',
    age: '3 Months',
    gender: 'Female',
    price: 22000,
    description: 'Plush silver tabby kitten with affectionate personality. Full vaccination passport included.',
    images: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'Available',
    featured: false,
    careInfo: 'Litter trained. Loves interactive feather toys.'
  },
  {
    id: 'pet-5',
    name: 'Nemo & Friends',
    category: 'Fish',
    breed: 'Clownfish & Anemone Duo',
    age: 'Young Adult',
    gender: 'Pair',
    price: 4500,
    description: 'Vibrant orange marine Clownfish pair. Fully acclimatized to saltwater tank setup.',
    images: [
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'Available',
    featured: false,
    careInfo: 'Saltwater tank requirement (salinity 1.024). Feed marine flakes/mysis shrimp.'
  }
];

const INITIAL_BIRDS = [
  {
    id: 'bird-1',
    name: 'Rio',
    species: 'Blue Budgerigar',
    age: 'Young',
    gender: 'Male',
    price: 1200,
    description: 'Bright sky-blue Budgie parakeet with playful chirping. Socialized and hand-tamed.',
    images: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'Available',
    featured: true
  },
  {
    id: 'bird-2',
    name: 'Sunny',
    species: 'Cockatiel',
    age: '6 Months',
    gender: 'Female',
    price: 4500,
    description: 'Lutino yellow Cockatiel with cute orange cheek patches. Whistles sweet melodies.',
    images: [
      'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'Available',
    featured: true
  },
  {
    id: 'bird-3',
    name: 'Mango & Peaches',
    species: 'Lovebirds Pair',
    age: '5 Months',
    gender: 'Pair',
    price: 3200,
    description: 'Peach-faced Lovebird bonded pair. Inseparable, energetic, and colorful feathers.',
    images: [
      'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'Available',
    featured: false
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'CloudComfort Orthopedic Dog Bed',
    category: 'Accessories',
    brand: 'PetHaven Care',
    price: 2499,
    stock: 45,
    description: 'Memory foam orthopedic bed designed for maximum joint support and restful sleep. Machine washable cover.',
    images: [
      'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'In Stock',
    featured: true
  },
  {
    id: 'prod-2',
    name: 'Royal Canin Adult Dog Nutrition (3kg)',
    category: 'Pet Food',
    brand: 'Royal Canin',
    price: 1899,
    stock: 120,
    description: 'Complete nutritional formula enriched with Omega-3 and essential vitamins for active adult dogs.',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'In Stock',
    featured: true
  },
  {
    id: 'prod-3',
    name: 'Interactive Feather Cat Teaser Wand',
    category: 'Toys',
    brand: 'WhiskerJoy',
    price: 499,
    stock: 80,
    description: 'Flexible wand with natural feathers and subtle bell to stimulate hunting instinct in cats.',
    images: [
      'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'In Stock',
    featured: false
  },
  {
    id: 'prod-4',
    name: 'Luxury Bird Cage with Wooden Perches',
    category: 'Cages',
    brand: 'AvianStyle',
    price: 3499,
    stock: 15,
    description: 'Spacious steel wire cage with removable tray, food bowls, and natural perches for small to medium birds.',
    images: [
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80'
    ],
    availability: 'In Stock',
    featured: false
  }
];

const INITIAL_ENQUIRIES = [
  {
    id: 'enq-101',
    customerName: 'Rahul Sharma',
    phone: '+91 98765 12345',
    email: 'rahul.s@example.com',
    itemTitle: 'Cleo (Golden Retriever)',
    message: 'Hi, I am interested in Cleo the Golden Retriever puppy. Is he still available for adoption/purchase?',
    date: '2026-08-28',
    status: 'New'
  },
  {
    id: 'enq-102',
    customerName: 'Priya Patel',
    phone: '+91 91234 56789',
    email: 'priya.p@example.com',
    itemTitle: 'CloudComfort Orthopedic Dog Bed',
    message: 'Do you offer home delivery in Mumbai for the dog bed?',
    date: '2026-08-27',
    status: 'Contacted'
  }
];
