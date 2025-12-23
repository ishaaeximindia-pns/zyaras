import type { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: '1',
    slug: 'classic-blue-jeans',
    name: 'Classic Blue Jeans',
    category: 'Women',
    subcategory: 'Jeans',
    model: 'B2C',
    tagline: 'Timeless style and comfort.',
    description:
      'Our Classic Blue Jeans are made from premium denim for a perfect fit that lasts. A wardrobe staple for any occasion.',
    keyBenefit: 'Perfect Fit',
    price: 68,
    status: 'Popular',
    isFeatured: true,
    heroImage: 'product-nexus-flow',
    features: [
      {
        title: 'Premium Denim',
        description: 'Made with high-quality, durable denim that softens with every wash.',
        icon: 'Copy',
      },
      {
        title: 'Flattering Fit',
        description: 'Designed to hug your curves in all the right places for a confident look.',
        icon: 'PersonStanding',
      },
      {
        title: 'Versatile Style',
        description: 'Easily dress them up or down for a casual day out or a night on the town.',
        icon: 'Sparkles',
      },
    ],
    useCases: [
      {
        title: 'Casual Weekend Wear',
        description:
          'Pair with a simple t-shirt and sneakers for a relaxed and stylish weekend outfit.',
        image: 'use-case-1',
      },
      {
        title: 'Evening Out',
        description:
          'Combine with a chic blouse and heels for a sophisticated evening look.',
        image: 'use-case-2',
      },
    ],
    faqs: [
      {
        question: 'What is the inseam length?',
        answer: 'Our Classic Blue Jeans come in three inseam lengths: 28" (petite), 30" (regular), and 32" (tall).',
      },
      {
        question: 'How should I care for my jeans?',
        answer:
          'To maintain the color and fit, we recommend washing in cold water and hanging to dry.',
      },
    ],
     pricing: [
      { name: 'Standard', price: '68', priceSuffix: '', features: ['1-Year Warranty', 'Free Returns', 'Standard Shipping'], cta: 'Add to Cart', isFeatured: true },
    ]
  },
  {
    id: '2',
    slug: 'leather-tote-bag',
    name: 'Leather Tote Bag',
    category: 'Women',
    subcategory: 'Handbags',
    model: 'B2C',
    tagline: 'Effortless elegance for your daily essentials.',
    description:
      'This luxurious leather tote bag is handcrafted from the finest materials, offering both style and functionality. Spacious enough for your laptop and daily necessities.',
    keyBenefit: 'Spacious & Stylish',
    price: 125,
    status: 'New',
    isFeatured: true,
    heroImage: 'product-pixel-forge',
    features: [
      {
        title: 'Genuine Leather',
        description: 'Crafted from soft, full-grain leather that develops a beautiful patina over time.',
        icon: 'Gem',
      },
      {
        title: 'Spacious Interior',
        description: 'Features multiple compartments, including a padded laptop sleeve.',
        icon: 'Laptop',
      },
      {
        title: 'Handmade Quality',
        description: 'Meticulously stitched by artisans for a bag that is built to last.',
        icon: 'Hand',
      },
    ],
    useCases: [
      {
        title: 'For the Office',
        description: 'A professional and stylish companion to carry your work essentials.',
        image: 'use-case-2',
      },
      {
        title: 'For Weekend Trips',
        description:
          'The perfect size for a weekend getaway, fitting all your essentials with ease.',
        image: 'use-case-1',
      },
    ],
    faqs: [
      {
        question: 'What are the dimensions of the bag?',
        answer: 'The tote measures 15" W x 12" H x 6" D, with a handle drop of 10 inches.',
      },
      {
        question: 'How do I care for the leather?',
        answer:
          'Wipe with a damp cloth and use a quality leather conditioner periodically to keep it supple.',
      },
    ],
    pricing: [
       { name: 'Standard', price: '125', priceSuffix: '', features: ['Lifetime Warranty', 'Free Returns', 'Standard Shipping'], cta: 'Add to Cart', isFeatured: true },
    ]
  },
  {
    id: '3',
    slug: 'mens-oxford-shirt',
    name: 'Men\'s Oxford Shirt',
    category: 'Men',
    subcategory: 'Shirts',
    model: 'B2C',
    tagline: 'A timeless classic for the modern man.',
    description:
      'Our signature Oxford shirt is cut from high-quality cotton for a soft, breathable feel. A versatile piece for any wardrobe.',
    keyBenefit: 'All-Day Comfort',
    price: 55,
    isFeatured: true,
    heroImage: 'product-data-sphere',
    features: [
      {
        title: '100% Cotton',
        description: 'Woven from premium long-staple cotton for superior softness and durability.',
        icon: 'Leaf',
      },
      {
        title: 'Modern Fit',
        description: 'A tailored silhouette that looks sharp on its own or layered under a blazer.',
        icon: 'PersonStanding',
      },
      {
        title: 'Button-Down Collar',
        description: 'A classic button-down collar that maintains its shape for a polished look.',
        icon: 'Check',
      },
    ],
    useCases: [
        {
            title: "Business Casual",
            description: "Pair with chinos and loafers for a smart, business-casual ensemble.",
            image: "use-case-1"
        },
        {
            title: "Weekend Ready",
            description: "Wear it untucked with jeans for a relaxed yet put-together weekend style.",
            image: "use-case-2"
        }
    ],
    faqs: [
        {
            question: "Is this shirt machine washable?",
            answer: "Yes, it is machine washable. We recommend washing on a gentle cycle and tumble drying on low."
        },
        {
            question: "Does the shirt run true to size?",
            answer: "Our Oxford shirts have a modern, tailored fit. If you prefer a more relaxed fit, we recommend sizing up."
        }
    ],
    pricing: [
        { name: 'Standard', price: '55', priceSuffix: '', features: ['1-Year Warranty', 'Free Returns', 'Standard Shipping'], cta: 'Add to Cart', isFeatured: true },
    ]
  },
  {
    id: '4',
    slug: 'kids-dino-pajamas',
    name: 'Kids\' Dino Pajamas',
    category: 'Kids',
    subcategory: 'Pajamas',
    model: 'B2C',
    tagline: 'Roar into dreamland!',
    description: 'These fun dinosaur-print pajamas are made from ultra-soft organic cotton, perfect for a cozy night\'s sleep.',
    keyBenefit: 'Ultra-Soft Comfort',
    price: 35,
    discountPrice: 28,
    status: 'Sale',
    isFeatured: false,
    heroImage: 'product-connect-iq',
    features: [
        {
            title: "Organic Cotton",
            description: "GOTS-certified organic cotton that's gentle on sensitive skin.",
            icon: 'Sprout'
        },
        {
            title: "Fun Dinosaur Print",
            description: "A playful and vibrant print that kids will love.",
            icon: 'Laugh'
        },
        {
            title: "Snug Fit",
            description: "Designed for safety and comfort, with a snug fit that stays in place.",
            icon: 'Bed'
        }
    ],
    useCases: [
        {
            title: "Bedtime Stories",
            description: "The perfect comfy attire for snuggling up with a good book before bed.",
            image: "use-case-2"
        },
        {
            title: "Pajama Day at School",
            description: "Let your little one show off their cool dino style on pajama day.",
            image: "use-case-1"
        }
    ],
    faqs: [
        {
            question: "What sizes are available?",
            answer: "Our pajamas are available in sizes 2T through 8Y."
        },
        {
            question: "Are these pajamas flame-resistant?",
            answer: "For child's safety, this garment should fit snugly. This garment is not flame resistant."
        }
    ],
    pricing: [
        { name: 'Standard', price: '35', priceSuffix: '', features: ['6-Month Warranty', 'Free Returns', 'Standard Shipping'], cta: 'Add to Cart', isFeatured: true },
    ]
  },
  {
    id: '5',
    slug: 'business-consulting-package',
    name: 'Business Consulting',
    category: 'Services',
    subcategory: 'Consulting',
    model: 'B2B',
    tagline: 'Strategic guidance for growth.',
    description:
      'Our business consulting package provides expert advice to help you scale your operations, optimize your strategy, and increase profitability.',
    keyBenefit: 'Expert Strategy',
    price: 2500,
    isFeatured: true,
    heroImage: 'use-case-1',
    features: [
        {
            title: "Market Analysis",
            description: "In-depth analysis of your market landscape and competitive positioning.",
            icon: 'PieChart'
        },
        {
            title: "Strategic Roadmap",
            description: "A tailored roadmap with actionable steps to achieve your business goals.",
            icon: 'Map'
        },
        {
            title: "Dedicated Consultant",
            description: "A dedicated consultant to guide you through every step of the process.",
            icon: 'UserCheck'
        }
    ],
    useCases: [],
    faqs: [],
    pricing: [
        { name: 'Standard', price: '2500', priceSuffix: '/ project', features: ['Initial Consultation', 'Market Analysis Report', 'Strategic Roadmap'], cta: 'Inquire Now', isFeatured: true },
    ]
  },
  {
    id: '6',
    slug: 'silk-blend-scarf',
    name: 'Silk Blend Scarf',
    category: 'Women',
    subcategory: 'Accessories',
    model: 'B2C',
    tagline: 'An elegant touch of color.',
    description: 'A beautiful and lightweight scarf made from a blend of silk and modal. Perfect for adding a pop of color to any outfit.',
    keyBenefit: 'Lightweight & Versatile',
    price: 45,
    discountPrice: 35,
    status: 'Sale',
    isFeatured: true,
    heroImage: 'use-case-1',
    features: [
      { title: 'Vibrant Colors', description: 'Available in a wide range of rich, vibrant colors.', icon: 'Palette' },
      { title: 'Luxurious Feel', description: 'The silk-modal blend is incredibly soft and smooth to the touch.', icon: 'Feather' },
      { title: 'Year-Round Wear', description: 'Lightweight enough for spring and summer, yet provides warmth in cooler months.', icon: 'CalendarDays' },
    ],
    useCases: [],
    faqs: [],
    pricing: [
      { name: 'Standard', price: '45', priceSuffix: '', features: ['Free Shipping', 'Easy Returns'], cta: 'Add to Cart', isFeatured: true },
    ]
  },
  {
    id: '7',
    slug: 'mens-leather-belt',
    name: 'Men\'s Leather Belt',
    category: 'Men',
    subcategory: 'Accessories',
    model: 'B2C',
    tagline: 'The perfect finishing touch.',
    description: 'A classic leather belt made from genuine leather with a solid brass buckle. A durable and stylish accessory for any man.',
    keyBenefit: 'Durable & Classic',
    price: 48,
    status: 'Popular',
    isFeatured: true,
    offer: 'BOGO',
    heroImage: 'use-case-2',
    features: [
      { title: 'Full-Grain Leather', description: 'Made from high-quality full-grain leather that will last for years.', icon: 'ShieldCheck' },
      { title: 'Solid Brass Buckle', description: 'A sturdy and stylish buckle that resists corrosion.', icon: 'Gem' },
      { title: 'Versatile Style', description: 'Perfect for both casual and formal occasions.', icon: 'Users' },
    ],
    useCases: [],
    faqs: [],
    pricing: [
      { name: 'Standard', price: '48', priceSuffix: '', features: ['5-Year Warranty', 'Free Shipping'], cta: 'Add to Cart', isFeatured: true },
    ]
  },
  {
    id: '8',
    slug: 'floral-print-dress',
    name: 'Floral Print Dress',
    category: 'Women',
    subcategory: 'Dresses',
    model: 'B2C',
    tagline: 'Bloom with style.',
    description: 'A beautiful floral dress with a flattering silhouette. Made from lightweight fabric, it\'s perfect for sunny days.',
    keyBenefit: 'Light & Airy',
    price: 85,
    status: 'New',
    isFeatured: true,
    heroImage: 'product-pixel-forge',
    features: [
      { title: 'Vibrant Floral Print', description: 'A stunning and colorful print that stands out.', icon: 'Flower' },
      { title: 'Comfortable Fabric', description: 'Made from a soft, breathable material for all-day comfort.', icon: 'Wind' },
      { title: 'Elegant Design', description: 'Features a cinched waist and flowing skirt for a classic look.', icon: 'Sparkles' },
    ],
    useCases: [],
    faqs: [],
    pricing: [
      { name: 'Standard', price: '85', priceSuffix: '', features: ['Free Shipping', 'Easy Returns'], cta: 'Add to Cart', isFeatured: true },
    ]
  },
  {
    id: '9',
    slug: 'graphic-print-tshirt',
    name: 'Kids\' Graphic T-Shirt',
    category: 'Kids',
    subcategory: 'T-Shirts',
    model: 'B2C',
    tagline: 'Cool and comfy for everyday adventures.',
    description: 'A fun and comfortable t-shirt with a playful graphic print. Made from 100% cotton for a soft feel.',
    keyBenefit: 'Playful & Durable',
    price: 22,
    status: 'New',
    isFeatured: false,
    offer: 'B2G1',
    heroImage: 'product-connect-iq',
    features: [
      { title: '100% Cotton', description: 'Soft and breathable cotton that\'s perfect for kids.', icon: 'Leaf' },
      { title: 'Fun Graphic', description: 'A cool, kid-friendly graphic that adds a touch of personality.', icon: 'Smile' },
      { title: 'Durable Construction', description: 'Made to withstand playtime and frequent washing.', icon: 'ShieldCheck' },
    ],
    useCases: [],
    faqs: [],
    pricing: [
      { name: 'Standard', price: '22', priceSuffix: '', features: ['Free Shipping on orders over $50', 'Easy Returns'], cta: 'Add to Cart', isFeatured: true },
    ]
  }
];
