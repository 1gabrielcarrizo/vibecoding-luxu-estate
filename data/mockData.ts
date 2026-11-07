import {
  Property,
  UserProfile,
  NavLink,
  PropertyCategory,
  PropertyAgent,
} from "@/types/property";

export const currentUser: UserProfile = {
  name: "Alexander Vance",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBhLuM9qNltZNxgIWPtC3dVxQ_JLFKXYB9d_klGFux_2JVOGtRlbV4GvpvdT4wqpsueZnXFQhKJe9MGGvM6rXQX15iv80mbEKxjmy4X14AZRqvp573ZlKYDN9bAb0ka7B-g5mkOCP6nRuKC9QsO02JVq6gqZeAo3-7dUurVhhgPJGeuL0Gk2Cp3Wnu5mVlUtpajB2wtx8uMoytbh78i9RmHYtJg52ZELl9XdIC9f5Kix_lFMFoi6Ru61ARrEGIrvgvz4ViiKhufTns",
};

export const defaultAgent: PropertyAgent = {
  name: "Sarah Jenkins",
  role: "Top Rated Agent",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w",
  phone: "+1 (555) 349-8201",
  email: "sarah.jenkins@luxeestate.com",
  rating: 4.9,
};

export const defaultAmenities: string[] = [
  "Smart Home System",
  "Swimming Pool",
  "Central Heating & Cooling",
  "Electric Vehicle Charging",
  "Private Gym",
  "Wine Cellar",
];

export const navLinks: NavLink[] = [
  { label: "Buy", href: "/?tab=Buy", isActive: true },
  { label: "Rent", href: "/?tab=Rent" },
  { label: "Sell", href: "/?tab=Sell" },
  { label: "Saved Homes", href: "/#saved" },
];

export const categoryFilters: PropertyCategory[] = [
  "All",
  "House",
  "Apartment",
  "Villa",
  "Penthouse",
];

// Reusable luxury image collections for development/mocking
const sharedVillaImages = [
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
];

const sharedPenthouseImages = [
  "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80",
];

const sharedApartmentImages = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
];

const sharedHouseImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
];

// Featured Properties (each with 4-5 images)
export const featuredProperties: Property[] = [
  {
    id: "featured-1",
    slug: "the-glass-pavilion",
    title: "The Glass Pavilion",
    location: "Beverly Hills, California",
    price: 5250000,
    formattedPrice: "$5,250,000",
    beds: 5,
    baths: 4.5,
    sqm: 4200,
    garage: 3,
    badge: "Exclusive",
    badges: ["Exclusive", "Featured"],
    type: "sale",
    category: "Villa",
    isFeatured: true,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Luxury modern villa exterior with pool",
    coordinates: { lat: 34.0736, lng: -118.4004 },
    agent: defaultAgent,
    amenities: [
      "Infinity Swimming Pool",
      "Smart Home Automation",
      "Private Wine Tasting Room",
      "Home Cinema",
      "Spa & Sauna",
      "Tesla EV Superchargers",
    ],
    description: [
      "Set amidst the rolling foothills of Beverly Hills, The Glass Pavilion is an architectural tour-de-force showcasing seamless glass curtain walls and bespoke architectural finishes.",
      "The expansive grounds feature an infinity pool hovering above city skylines, private entertaining pavilions, and curated modern art courtyards. Experience absolute serenity in the master suite with custom walk-in dressing suites and radiant-heated marble baths.",
    ],
    estimatedPayment: {
      monthly: 22800,
      formattedMonthly: "$22,800/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "featured-2",
    slug: "azure-heights-penthouse",
    title: "Azure Heights Penthouse",
    location: "Downtown, Vancouver",
    price: 3800000,
    formattedPrice: "$3,800,000",
    beds: 3,
    baths: 3,
    sqm: 2100,
    garage: 2,
    badge: "New Arrival",
    badges: ["New Arrival", "Penthouse"],
    type: "sale",
    category: "Penthouse",
    isFeatured: true,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Modern interior living room with view",
    coordinates: { lat: 49.2827, lng: -123.1207 },
    agent: {
      name: "Marcus Sterling",
      role: "Luxury Penthouse Specialist",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (604) 789-2210",
      email: "marcus.sterling@luxeestate.com",
      rating: 5.0,
    },
    amenities: [
      "360° Panoramic Skyline Views",
      "Private Rooftop Hot Tub",
      "Direct Keycard Elevator Access",
      "Concierge 24/7",
      "Sub-Zero & Wolf Appliances",
      "Wine Cellar",
    ],
    description: [
      "Perched high above Vancouver's glittering waterfront, Azure Heights Penthouse redefines urban skyline living with panoramic views stretching from English Bay to the North Shore Mountains.",
      "The open floor plan flows naturally into a 1,200 sq ft private wrap-around terrace equipped with outdoor heating, hot tub, and alfresco dining space.",
    ],
    estimatedPayment: {
      monthly: 16500,
      formattedMonthly: "$16,500/mo",
      downPaymentPercent: 20,
    },
  },
];

// Initial Market Properties (each with at least 4 images)
export const initialMarketProperties: Property[] = [
  {
    id: "serenity-lane",
    slug: "serenity-lane-palo-alto",
    title: "1234 Serenity Lane",
    location: "1234 Serenity Lane, Palo Alto, CA",
    price: 1250000,
    formattedPrice: "$1,250,000",
    beds: 4,
    baths: 3,
    sqm: 240,
    garage: 2,
    badge: "Premium",
    badges: ["Premium", "New"],
    type: "sale",
    category: "House",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjNDU9iE4zwPuWeg-CjIrLI-87GF24_LgOggcXT0vmUYfMx2q1dJAheiqWqVN-39uiwyLKEfP18FsG1vtUyAPX902OhGEfM4clcQiDsJW7MBbc_BoMtZXtqIeFKIfkHnkIPwmFbQg8Eaan6ULV99T8AUVUuKsro0HoTMrIaxw5pp1uSuQlF8X5Dait4US1W4vmyZnVioXbFnCoaOOZ0LPorb0rVGAIQd9reWcpqq27C0oO4ltnsCTHIcjIm0xp-2qVbRJSIZzWPv0",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCvpJBMaiXUL25hHYwLa_0R6dPhLLM1EuhEt-AVtOy8qSnEi9IcA_RzD5s5ThawY3XG2qw8h4kPqvfP18EY1E5vgA8fs6v7RefCMJ1gY8Gt4uyXGJ85-lcIvL18v8Nlc-U-VOwn1h54yjjg4-KXHt1N5DfuTkQUBdldSELRZeJ6zuZ087NCJ7dDIDaXKJpPgulmd6JC6zD1-Kq00Sb4VXIhVR3IQ1Hd8S6xZkd17QvMHSNqbtKG849PRqHZX3nKLHEWYWWPvbL5_Gs",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbloTFAmeq6ugmfkwyqn3NMGn11PMk4FU0EIHRHvfYB8nw_-iH5TLps5ig3zipLPoKVZZKO8fOvEVJIwp3MQ9wrS4Dzhgw6ypUDhsycDc-YsboVBbRrXxKOYl-77zNHX9E4hynYyJfVVzXn7ldtURk3Ij3pHIMwqzfDdUxyhYaIJe5dRYa0JN5RpHbPNaV33TcM-IoYW11wNUCKkivtfgC3tk7hkKa3gue7ZTjLhR1ZOE_A1MvMZ3rgBxGDg-HFASH4YP6jI3rwMM",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRCEooMTK0GZV_7SdAorgeIN1pNz3R9YsLv-2pv39FOje7BUWCWPnKOSA1f6rlYcw7IoJ8NxUp4OU-MAk5_ucnykEtps56-kR6DtQ9JgLlCNyiuazO87fy-xCtXVNROT9kquBZ2JUvUtNGRwWiBaK1DnXOHSxp3ELHbLK8MNS-Ht3Gw8dXgNbya4bZiHZ7C-YnCJfwPjX25zrrQypfbiJsS8jjxFq3--uC264Zbhxp8XCsqDid3BIaJ8RdNMRze6lVvpg49N7Z0tI",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBk_c2n3UBtDQJ-NNLPp9wHCUtPuJTKQi4jnndp2ZNKTRfxtmV85MELPvVecn7Ef74j23fC3l08ZwEbHr70k5C1eHlVG8Pj-K0GWve-DoShWQNa5VGFhBad_Vtlxlu_u22wpBT3475EVHpmhcfwY2FekfCxqUrc_fGSBlHLcKIZ8XsNyHpAPUqUD2n10H86tm9E1nexgYeFUXpLsgB-FRTtya2tTZZ8kTJ-i0Mv6kWLi-LJgvYuYsN2lB0jZi0Q7xxJe6O1M-vA9eg",
    ],
    imageAlt: "Modern luxury home exterior with pool in Palo Alto",
    coordinates: { lat: 37.4419, lng: -122.143 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Experience modern luxury in this architecturally stunning home located in the heart of Palo Alto. Designed with an emphasis on indoor-outdoor living, the residence features floor-to-ceiling glass walls that flood the interiors with natural light.",
      "The open-concept kitchen is equipped with top-of-the-line appliances and custom cabinetry, perfect for culinary enthusiasts. Retreat to the primary suite, a sanctuary of relaxation with a spa-inspired bath and private balcony.",
    ],
    estimatedPayment: {
      monthly: 5430,
      formattedMonthly: "$5,430/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-1",
    slug: "modern-family-home-seattle",
    title: "Modern Family Home",
    location: "123 Pine St, Seattle",
    price: 850000,
    formattedPrice: "$850,000",
    beds: 3,
    baths: 2,
    sqm: 120,
    garage: 1,
    badge: "FOR SALE",
    badges: ["FOR SALE"],
    type: "sale",
    category: "House",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Modern white house facade",
    coordinates: { lat: 47.6062, lng: -122.3321 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Nestled on a serene tree-lined street in Seattle, this meticulously renovated family residence blends Northwest craft with contemporary energy efficiency.",
      "Features include open plan living, radiant floor heating, a landscaped private courtyard, and a detached insulated garage.",
    ],
    estimatedPayment: {
      monthly: 3700,
      formattedMonthly: "$3,700/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-2",
    slug: "urban-loft-portland",
    title: "Urban Loft",
    location: "456 Elm Ave, Portland",
    price: 3200,
    formattedPrice: "$3,200",
    priceSuffix: "/mo",
    beds: 1,
    baths: 1,
    sqm: 85,
    garage: 1,
    badge: "FOR RENT",
    badges: ["FOR RENT"],
    type: "rent",
    category: "Apartment",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Stylish apartment living room",
    coordinates: { lat: 45.5152, lng: -122.6784 },
    agent: defaultAgent,
    amenities: [
      "Industrial Concrete Ceilings",
      "Oversized Factory Windows",
      "Fitness Studio",
      "Rooftop BBQ Lounge",
      "Bicycle Storage Room",
    ],
    description: [
      "An authentic Pearl District industrial loft featuring 14-foot exposed concrete ceilings, polished timber accents, and sweeping city views.",
    ],
    estimatedPayment: {
      monthly: 3200,
      formattedMonthly: "$3,200/mo",
      downPaymentPercent: 0,
    },
  },
  {
    id: "market-3",
    slug: "highland-retreat-bend",
    title: "Highland Retreat",
    location: "789 Mountain Rd, Bend",
    price: 620000,
    formattedPrice: "$620,000",
    beds: 2,
    baths: 2,
    sqm: 98,
    garage: 1,
    badge: "FOR SALE",
    badges: ["FOR SALE"],
    type: "sale",
    category: "House",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Cabin in the woods",
    coordinates: { lat: 44.0582, lng: -121.3153 },
    agent: defaultAgent,
    amenities: [
      "Cedar Wood Fireplace",
      "Panoramic Pine Forest Views",
      "Heated Ski Locker",
      "Private Deck with Hot Tub",
    ],
    description: [
      "A mountain getaway nestled in the ponderosa pines of Central Oregon. Designed for ski weekends at Mount Bachelor and sunny summer trail runs.",
    ],
    estimatedPayment: {
      monthly: 2690,
      formattedMonthly: "$2,690/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-4",
    slug: "sea-view-penthouse-miami",
    title: "Sea View Penthouse",
    location: "321 Ocean Dr, Miami",
    price: 4500,
    formattedPrice: "$4,500",
    priceSuffix: "/mo",
    beds: 3,
    baths: 3,
    sqm: 180,
    garage: 2,
    badge: "FOR RENT",
    badges: ["FOR RENT"],
    type: "rent",
    category: "Penthouse",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Bright bedroom with large window",
    coordinates: { lat: 25.7617, lng: -80.1918 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Wake up to turquoise Atlantic Ocean vistas every morning. This Miami Beach penthouse features expansive floor-to-ceiling glass and private beach cabana privileges.",
    ],
    estimatedPayment: {
      monthly: 4500,
      formattedMonthly: "$4,500/mo",
      downPaymentPercent: 0,
    },
  },
  {
    id: "market-5",
    slug: "central-studio-chicago",
    title: "Central Studio",
    location: "555 Main St, Chicago",
    price: 550000,
    formattedPrice: "$550,000",
    beds: 1,
    baths: 1,
    sqm: 50,
    garage: 1,
    badge: "FOR SALE",
    badges: ["FOR SALE"],
    type: "sale",
    category: "Apartment",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Cozy apartment interior",
    coordinates: { lat: 41.8781, lng: -87.6298 },
    agent: defaultAgent,
    amenities: [
      "24h Doorman",
      "Resident Lounge",
      "Gym & Yoga Studio",
      "Covered Heated Garage",
    ],
    description: [
      "A stylish pied-à-terre in the heart of downtown Chicago, steps from Michigan Avenue and Millennium Park.",
    ],
    estimatedPayment: {
      monthly: 2390,
      formattedMonthly: "$2,390/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-6",
    slug: "garden-villa-austin",
    title: "Garden Villa",
    location: "999 Oak Ln, Austin",
    price: 2800,
    formattedPrice: "$2,800",
    priceSuffix: "/mo",
    beds: 2,
    baths: 2,
    sqm: 110,
    garage: 1,
    badge: "FOR RENT",
    badges: ["FOR RENT"],
    type: "rent",
    category: "Villa",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Modern minimalist home exterior",
    coordinates: { lat: 30.2672, lng: -97.7431 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Contemporary single-story design framed by native Texas landscaping, private lap pool, and breezy outdoor dining patio.",
    ],
    estimatedPayment: {
      monthly: 2800,
      formattedMonthly: "$2,800/mo",
      downPaymentPercent: 0,
    },
  },
  {
    id: "market-7",
    slug: "the-aurora-villa-malibu",
    title: "The Aurora Villa",
    location: "204 Ocean Way, Malibu",
    price: 3450000,
    formattedPrice: "$3,450,000",
    beds: 4,
    baths: 4.5,
    sqm: 380,
    garage: 3,
    badge: "NEW LISTING",
    badges: ["NEW LISTING"],
    type: "sale",
    category: "Villa",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Luxury modern villa exterior with swimming pool",
    coordinates: { lat: 34.0259, lng: -118.7798 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Perched in the prestigious Malibu bluffs, The Aurora Villa boasts sweeping Pacific ocean views, zero-edge pool, and private pathway to the sand.",
    ],
    estimatedPayment: {
      monthly: 14900,
      formattedMonthly: "$14,900/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-8",
    slug: "the-highline-residence-ny",
    title: "The Highline Residence",
    location: "520 W 28th St, Chelsea, NY",
    price: 4800,
    formattedPrice: "$4,800",
    priceSuffix: "/mo",
    beds: 2,
    baths: 2,
    sqm: 115,
    garage: 1,
    badge: "FOR RENT",
    badges: ["FOR RENT"],
    type: "rent",
    category: "Apartment",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Contemporary luxury apartment building",
    coordinates: { lat: 40.7512, lng: -74.0031 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Direct High Line park views from architect-designed curved glass bays in Chelsea.",
    ],
    estimatedPayment: {
      monthly: 4800,
      formattedMonthly: "$4,800/mo",
      downPaymentPercent: 0,
    },
  },
  {
    id: "market-9",
    slug: "bellavista-manor-lake-como",
    title: "Bellavista Manor",
    location: "Via Regina 42, Lake Como",
    price: 4900000,
    formattedPrice: "$4,900,000",
    beds: 6,
    baths: 6,
    sqm: 540,
    garage: 4,
    badge: "EXCLUSIVE",
    badges: ["EXCLUSIVE"],
    type: "sale",
    category: "Villa",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Classic luxury villa with green lawn and terrace",
    coordinates: { lat: 45.9897, lng: 9.2573 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Historic luxury estate on the shores of Lake Como with private dock, botanical gardens, and frescoed ceilings.",
    ],
    estimatedPayment: {
      monthly: 21200,
      formattedMonthly: "$21,200/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-10",
    slug: "komorebi-zen-house-kyoto",
    title: "Komorebi Zen House",
    location: "Higashiyama, Kyoto",
    price: 1650000,
    formattedPrice: "$1,650,000",
    beds: 3,
    baths: 2.5,
    sqm: 195,
    garage: 1,
    badge: "FOR SALE",
    badges: ["FOR SALE"],
    type: "sale",
    category: "House",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Warm contemporary architecture home with glass facade",
    coordinates: { lat: 34.9961, lng: 135.7779 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Harmonious Japanese contemporary residence featuring hinoki wood bath, rock garden, and traditional tearoom.",
    ],
    estimatedPayment: {
      monthly: 7100,
      formattedMonthly: "$7,100/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-11",
    slug: "crown-sky-penthouse-miami",
    title: "Crown Sky Penthouse",
    location: "1420 Brickell Ave, Miami",
    price: 2850000,
    formattedPrice: "$2,850,000",
    beds: 3,
    baths: 3.5,
    sqm: 260,
    garage: 2,
    badge: "TOP FLOOR",
    badges: ["TOP FLOOR"],
    type: "sale",
    category: "Penthouse",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Ultra luxury penthouse exterior with outdoor patio",
    coordinates: { lat: 25.7594, lng: -80.1918 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Soaring above Brickell Financial District with private rooftop pool, Italian marble flooring, and sunset lounge.",
    ],
    estimatedPayment: {
      monthly: 12300,
      formattedMonthly: "$12,300/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-12",
    slug: "canal-view-atelier-amsterdam",
    title: "Canal View Atelier",
    location: "384 Herengracht, Amsterdam",
    price: 3900,
    formattedPrice: "$3,900",
    priceSuffix: "/mo",
    beds: 2,
    baths: 1.5,
    sqm: 95,
    garage: 0,
    badge: "FOR RENT",
    badges: ["FOR RENT"],
    type: "rent",
    category: "Apartment",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Interior designer apartment with wooden floors",
    coordinates: { lat: 52.3676, lng: 4.8875 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Restored 17th-century canal house apartment on the UNESCO-protected Herengracht canal.",
    ],
    estimatedPayment: {
      monthly: 3900,
      formattedMonthly: "$3,900/mo",
      downPaymentPercent: 0,
    },
  },
  {
    id: "market-13",
    slug: "the-pinecrest-haven-aspen",
    title: "The Pinecrest Haven",
    location: "710 Red Mountain Rd, Aspen",
    price: 3200000,
    formattedPrice: "$3,200,000",
    beds: 4,
    baths: 4,
    sqm: 320,
    garage: 2,
    badge: "ALPINE",
    badges: ["ALPINE"],
    type: "sale",
    category: "House",
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Alpine modern mountain house surrounded by pines",
    coordinates: { lat: 39.1911, lng: -106.8175 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Exclusive Aspen alpine sanctuary with direct ski-in/ski-out trail access and breathtaking mountain views.",
    ],
    estimatedPayment: {
      monthly: 13800,
      formattedMonthly: "$13,800/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-14",
    slug: "solarium-penthouse-vancouver",
    title: "Solarium Penthouse",
    location: "2201 Cornwall Ave, Vancouver",
    price: 5400,
    formattedPrice: "$5,400",
    priceSuffix: "/mo",
    beds: 3,
    baths: 2.5,
    sqm: 210,
    garage: 2,
    badge: "FOR RENT",
    badges: ["FOR RENT"],
    type: "rent",
    category: "Penthouse",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Bright modern penthouse living space with panoramic light",
    coordinates: { lat: 49.2734, lng: -123.1539 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Kitsilano beachfront penthouse overlooking English Bay and Stanley Park.",
    ],
    estimatedPayment: {
      monthly: 5400,
      formattedMonthly: "$5,400/mo",
      downPaymentPercent: 0,
    },
  },
  {
    id: "market-15",
    slug: "nordic-dune-villa-skagen",
    title: "Nordic Dune Villa",
    location: "Strandvejen 88, Skagen",
    price: 2150000,
    formattedPrice: "$2,150,000",
    beds: 4,
    baths: 3,
    sqm: 275,
    garage: 2,
    badge: "MINIMALIST",
    badges: ["MINIMALIST"],
    type: "sale",
    category: "Villa",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Scandinavian architecture villa with pool and modern terrace",
    coordinates: { lat: 57.7209, lng: 10.5841 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Minimalist Danish coastal architecture blending seamlessly with sand dunes and wild coastal grasses.",
    ],
    estimatedPayment: {
      monthly: 9300,
      formattedMonthly: "$9,300/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-16",
    slug: "metropolis-loft-london",
    title: "Metropolis Loft",
    location: "14 Dean St, SoHo, London",
    price: 3600,
    formattedPrice: "$3,600",
    priceSuffix: "/mo",
    beds: 1,
    baths: 1.5,
    sqm: 78,
    garage: 0,
    badge: "FOR RENT",
    badges: ["FOR RENT"],
    type: "rent",
    category: "Apartment",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Chic luxury urban loft living room",
    coordinates: { lat: 51.5136, lng: -0.1332 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Ultra-chic SoHo loft apartment offering secluded designer living in central London's vibrant theatre district.",
    ],
    estimatedPayment: {
      monthly: 3600,
      formattedMonthly: "$3,600/mo",
      downPaymentPercent: 0,
    },
  },
  {
    id: "market-17",
    slug: "silverstone-estate-los-angeles",
    title: "Silverstone Estate",
    location: "880 Bel Air Rd, Los Angeles",
    price: 1250000,
    formattedPrice: "$1,250,000",
    beds: 4,
    baths: 3.5,
    sqm: 290,
    garage: 2,
    badge: "FOR SALE",
    badges: ["FOR SALE"],
    type: "sale",
    category: "House",
    images: [
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Silverstone Estate modern exterior",
    coordinates: { lat: 34.0837, lng: -118.4468 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Gated Bel Air estate with manicured rose gardens, custom chef's kitchen, and expansive outdoor terrace.",
    ],
    estimatedPayment: {
      monthly: 5430,
      formattedMonthly: "$5,430/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-18",
    slug: "skyline-panorama-new-york",
    title: "Skyline Panorama",
    location: "740 Park Ave, New York",
    price: 6800,
    formattedPrice: "$6,800",
    priceSuffix: "/mo",
    beds: 2,
    baths: 2,
    sqm: 140,
    garage: 1,
    badge: "FOR RENT",
    badges: ["FOR RENT"],
    type: "rent",
    category: "Penthouse",
    images: [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Skyline Panorama view",
    coordinates: { lat: 40.7712, lng: -73.9632 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Iconic Park Avenue luxury penthouse featuring private elevator vestibule and Central Park vistas.",
    ],
    estimatedPayment: {
      monthly: 6800,
      formattedMonthly: "$6,800/mo",
      downPaymentPercent: 0,
    },
  },
  {
    id: "market-19",
    slug: "desert-horizon-villa-scottsdale",
    title: "Desert Horizon Villa",
    location: "9100 E Pinnacle Peak Rd, Scottsdale",
    price: 1980000,
    formattedPrice: "$1,980,000",
    beds: 4,
    baths: 4,
    sqm: 340,
    garage: 3,
    badge: "FOR SALE",
    badges: ["FOR SALE"],
    type: "sale",
    category: "Villa",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Contemporary desert villa with infinity pool",
    coordinates: { lat: 33.6932, lng: -111.8887 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Stunning Sonoran desert modernism with negative-edge swimming pool and mountain views.",
    ],
    estimatedPayment: {
      monthly: 8550,
      formattedMonthly: "$8,550/mo",
      downPaymentPercent: 20,
    },
  },
  {
    id: "market-20",
    slug: "harbour-view-suite-sydney",
    title: "Harbour View Suite",
    location: "15 Macquarie St, Sydney",
    price: 4200,
    formattedPrice: "$4,200",
    priceSuffix: "/mo",
    beds: 2,
    baths: 2,
    sqm: 125,
    garage: 1,
    badge: "FOR RENT",
    badges: ["FOR RENT"],
    type: "rent",
    category: "Apartment",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    ],
    imageAlt: "Luxurious modern apartment overlooking harbour",
    coordinates: { lat: -33.8688, lng: 151.2093 },
    agent: defaultAgent,
    amenities: defaultAmenities,
    description: [
      "Panoramic views across Sydney Harbour and the Royal Botanic Garden from this prestigious address.",
    ],
    estimatedPayment: {
      monthly: 4200,
      formattedMonthly: "$4,200/mo",
      downPaymentPercent: 0,
    },
  },
];

export const additionalMarketProperties: Property[] = [
  {
    "id": "market-21",
    "slug": "the-aspen-sanctuary-aspen",
    "title": "The Aspen Sanctuary",
    "location": "740 Red Mountain Rd, Aspen, CO",
    "price": 8900000,
    "formattedPrice": "$8,900,000",
    "beds": 5,
    "baths": 6,
    "sqm": 620,
    "garage": 3,
    "badge": "EXCLUSIVE",
    "badges": [
      "EXCLUSIVE",
      "Mountain View"
    ],
    "type": "sale",
    "category": "Villa",
    "images": [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "The Aspen Sanctuary exterior with heated infinity plunge pool",
    "coordinates": {
      "lat": 39.1911,
      "lng": -106.8175
    },
    "agent": {
      "name": "Sarah Jenkins",
      "role": "Top Rated Agent",
      "avatarUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w",
      "phone": "+1 (555) 349-8201",
      "email": "sarah.jenkins@luxeestate.com",
      "rating": 4.9
    },
    "amenities": [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace",
      "Wine Cellar",
      "Sauna & Steam Room"
    ],
    "description": [
      "Nestled in the prestigious Red Mountain enclave of Aspen, this architectural sanctuary commands uninterrupted views of Aspen Mountain and the Roaring Fork Valley.",
      "Crafted with reclaimed timber, Colorado flagstone, and expansive glass walls, the residence offers a heated infinity plunge pool, ski lounge with gear lockers, and heated stone terraces."
    ],
    "estimatedPayment": {
      "monthly": 38200,
      "formattedMonthly": "$38,200/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-22",
    "slug": "tribeca-cast-iron-loft-new-york",
    "title": "Tribeca Cast-Iron Loft",
    "location": "68 Franklin St, Tribeca, New York, NY",
    "price": 14500,
    "formattedPrice": "$14,500",
    "priceSuffix": "/mo",
    "beds": 3,
    "baths": 3,
    "sqm": 280,
    "garage": 1,
    "badge": "FOR RENT",
    "badges": [
      "FOR RENT",
      "Historic"
    ],
    "type": "rent",
    "category": "Apartment",
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Tribeca Cast-Iron Loft living area with tall windows",
    "coordinates": {
      "lat": 40.7183,
      "lng": -74.0049
    },
    "amenities": [
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Authentic cast-iron historic loft boasting 14-foot soaring ceilings, original fluted Corinthian columns, and museum-grade finishes throughout.",
      "Direct keyed elevator opens into an expansive 40-foot living gallery with oversized south-facing windows and a custom Boffi kitchen with Gaggenau appliances."
    ],
    "estimatedPayment": {
      "monthly": 14500,
      "formattedMonthly": "$14,500/mo",
      "downPaymentPercent": 0
    }
  },
  {
    "id": "market-23",
    "slug": "biscayne-bay-waterfront-estate-miami",
    "title": "Biscayne Bay Waterfront Estate",
    "location": "4410 N Bay Rd, Miami Beach, FL",
    "price": 12500000,
    "formattedPrice": "$12,500,000",
    "beds": 6,
    "baths": 7,
    "sqm": 780,
    "garage": 4,
    "badge": "NEW",
    "badges": [
      "NEW",
      "Waterfront"
    ],
    "type": "sale",
    "category": "Villa",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Biscayne Bay Waterfront Estate pool and deck",
    "coordinates": {
      "lat": 25.8165,
      "lng": -80.1378
    },
    "amenities": [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "A pristine waterfront masterpiece located on Miami Beach's premier residential avenue, with 100 feet of deep-water Biscayne Bay frontage and private yacht dockage.",
      "Features zero-edge resort pool, lush tropical gardens designed by Raymond Jungles, summer kitchen pavilion, and glass-encased wine room."
    ],
    "estimatedPayment": {
      "monthly": 53750,
      "formattedMonthly": "$53,750/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-24",
    "slug": "skyline-grand-penthouse-manhattan",
    "title": "Skyline Grand Penthouse",
    "location": "111 W 57th St, Midtown Manhattan, NY",
    "price": 18500000,
    "formattedPrice": "$18,500,000",
    "beds": 4,
    "baths": 5,
    "sqm": 510,
    "garage": 2,
    "badge": "EXCLUSIVE",
    "badges": [
      "EXCLUSIVE",
      "Central Park Views"
    ],
    "type": "sale",
    "category": "Penthouse",
    "images": [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Skyline Grand Penthouse interior with Central Park views",
    "coordinates": {
      "lat": 40.7648,
      "lng": -73.9777
    },
    "amenities": [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Perched on Billionaires' Row with breathtaking, unobstructed views over the entire expanse of Central Park to the north and the Manhattan skyline to the south.",
      "Includes private elevator foyer, 14-foot ceiling heights, custom bronze hardware, radiant heated Fior di Bosco marble baths, and dedicated resident concierge."
    ],
    "estimatedPayment": {
      "monthly": 79500,
      "formattedMonthly": "$79,500/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-25",
    "slug": "malibu-cliffside-modern-malibu",
    "title": "Malibu Cliffside Modern",
    "location": "31800 Broad Beach Rd, Malibu, CA",
    "price": 9750000,
    "formattedPrice": "$9,750,000",
    "beds": 4,
    "baths": 5,
    "sqm": 450,
    "garage": 3,
    "badge": "FOR SALE",
    "badges": [
      "FOR SALE",
      "Oceanfront"
    ],
    "type": "sale",
    "category": "House",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Malibu Cliffside Modern cantilevered deck over the ocean",
    "coordinates": {
      "lat": 34.0381,
      "lng": -118.8687
    },
    "amenities": [
      "Swimming Pool",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Sculptural modern marvel resting atop coastal bluffs with private stairs down to sandy Broad Beach in Malibu.",
      "Motorized glass pocket doors open the main level to an expansive teak cantilevered deck with infinity pool, spa, and panoramic Pacific sunsets."
    ],
    "estimatedPayment": {
      "monthly": 41900,
      "formattedMonthly": "$41,900/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-26",
    "slug": "mayfair-heritage-residence-london",
    "title": "Mayfair Heritage Residence",
    "location": "14 Grosvenor Square, Mayfair, London",
    "price": 22000,
    "formattedPrice": "$22,000",
    "priceSuffix": "/mo",
    "beds": 3,
    "baths": 3.5,
    "sqm": 310,
    "garage": 1,
    "badge": "FOR RENT",
    "badges": [
      "FOR RENT",
      "Prime London"
    ],
    "type": "rent",
    "category": "Apartment",
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Mayfair Heritage Residence classic high-ceiling reception room",
    "coordinates": {
      "lat": 51.5113,
      "lng": -0.1511
    },
    "amenities": [
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Grand Georgian proportions meet ultra-contemporary interior design in London's premier garden square.",
      "Direct lift access, chevron oak flooring, bespoke Poliform joinery, and private balconies overlooking landscaped private communal gardens."
    ],
    "estimatedPayment": {
      "monthly": 22000,
      "formattedMonthly": "$22,000/mo",
      "downPaymentPercent": 0
    }
  },
  {
    "id": "market-27",
    "slug": "lake-austin-hillside-retreat-austin",
    "title": "Lake Austin Hillside Retreat",
    "location": "2804 Westlake Dr, Austin, TX",
    "price": 4650000,
    "formattedPrice": "$4,650,000",
    "beds": 4,
    "baths": 4.5,
    "sqm": 420,
    "garage": 3,
    "badge": "NEW",
    "badges": [
      "NEW",
      "Waterfront"
    ],
    "type": "sale",
    "category": "House",
    "images": [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Lake Austin Hillside Retreat limestone facade and pool",
    "coordinates": {
      "lat": 30.3322,
      "lng": -97.7915
    },
    "amenities": [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Tucked along the tranquil shores of Lake Austin, this modern organic compound combines natural Texas limestone with glass and blackened steel.",
      "Features a private two-story boat dock with upper sundeck, negative-edge pool overlooking the lake, and detached guest casita."
    ],
    "estimatedPayment": {
      "monthly": 20000,
      "formattedMonthly": "$20,000/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-28",
    "slug": "villa-bella-vista-lake-como",
    "title": "Villa Bella Vista",
    "location": "Via Bellagio 18, Lake Como, Italy",
    "price": 6200000,
    "formattedPrice": "$6,200,000",
    "beds": 5,
    "baths": 5,
    "sqm": 540,
    "garage": 2,
    "badge": "EXCLUSIVE",
    "badges": [
      "EXCLUSIVE",
      "Lakefront"
    ],
    "type": "sale",
    "category": "Villa",
    "images": [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Villa Bella Vista overlooking Lake Como",
    "coordinates": {
      "lat": 45.9867,
      "lng": 9.2625
    },
    "amenities": [
      "Swimming Pool",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "An enchanting Lake Como estate with private waterfront gardens, century-old cypress trees, and panoramic views of the Bellagio peninsula.",
      "Extensively restored with Italian Carrara marble, custom Venetian plaster, wine cellar, and private boat mooring."
    ],
    "estimatedPayment": {
      "monthly": 26600,
      "formattedMonthly": "$26,600/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-29",
    "slug": "saint-germain-modern-atelier-paris",
    "title": "Saint-Germain Modern Atelier",
    "location": "24 Rue de Grenelle, 7th Arr., Paris",
    "price": 8500,
    "formattedPrice": "$8,500",
    "priceSuffix": "/mo",
    "beds": 2,
    "baths": 2,
    "sqm": 145,
    "garage": 1,
    "badge": "FOR RENT",
    "badges": [
      "FOR RENT",
      "Rive Gauche"
    ],
    "type": "rent",
    "category": "Apartment",
    "images": [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Saint-Germain Modern Atelier chic Parisian salon",
    "coordinates": {
      "lat": 48.8532,
      "lng": 2.3278
    },
    "amenities": [
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace",
      "Gym"
    ],
    "description": [
      "Refined Left Bank pied-à-terre located in a historic 18th-century hôtel particulier with landscaped courtyards.",
      "Herringbone parquet, classic mouldings, functioning marble fireplaces, air conditioning, and a private terrace overlooking quiet private gardens."
    ],
    "estimatedPayment": {
      "monthly": 8500,
      "formattedMonthly": "$8,500/mo",
      "downPaymentPercent": 0
    }
  },
  {
    "id": "market-30",
    "slug": "the-pacific-heights-manor-san-francisco",
    "title": "The Pacific Heights Manor",
    "location": "2740 Pacific Ave, San Francisco, CA",
    "price": 7800000,
    "formattedPrice": "$7,800,000",
    "beds": 5,
    "baths": 5.5,
    "sqm": 560,
    "garage": 2,
    "badge": "FOR SALE",
    "badges": [
      "FOR SALE",
      "Golden Gate Views"
    ],
    "type": "sale",
    "category": "House",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "The Pacific Heights Manor classic facade",
    "coordinates": {
      "lat": 37.7925,
      "lng": -122.4382
    },
    "amenities": [
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Timeless San Francisco luxury in top-tier Pacific Heights with sweeping vistas of the Golden Gate Bridge, Marin Headlands, and San Francisco Bay.",
      "Features high ceilings, custom chef's kitchen, wine tasting cellar, private rooftop garden terrace, and 2-car garage with EV charger."
    ],
    "estimatedPayment": {
      "monthly": 33500,
      "formattedMonthly": "$33,500/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-31",
    "slug": "roppongi-hills-panorama-suite-tokyo",
    "title": "Roppongi Hills Panorama Suite",
    "location": "6-10-1 Roppongi, Minato City, Tokyo",
    "price": 5400000,
    "formattedPrice": "$5,400,000",
    "beds": 3,
    "baths": 3,
    "sqm": 260,
    "garage": 2,
    "badge": "NEW",
    "badges": [
      "NEW",
      "Skyline Views"
    ],
    "type": "sale",
    "category": "Penthouse",
    "images": [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Roppongi Hills Panorama Suite with panoramic views over Tokyo",
    "coordinates": {
      "lat": 35.6604,
      "lng": 139.7292
    },
    "amenities": [
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Ultra-high specification Tokyo penthouse situated high above Roppongi with direct Tokyo Tower views and Mount Fuji horizon sunsets.",
      "Equipped with Hinoki cypress soaking tub, smart home climate automation, 24-hour bilingual concierge, and private underground parking."
    ],
    "estimatedPayment": {
      "monthly": 23200,
      "formattedMonthly": "$23,200/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-32",
    "slug": "silverleaf-sonoran-villa-scottsdale",
    "title": "Silverleaf Sonoran Villa",
    "location": "10800 E Cactus Rd, Scottsdale, AZ",
    "price": 3450000,
    "formattedPrice": "$3,450,000",
    "beds": 4,
    "baths": 4.5,
    "sqm": 490,
    "garage": 3,
    "badge": "FOR SALE",
    "badges": [
      "FOR SALE",
      "Golf Club"
    ],
    "type": "sale",
    "category": "Villa",
    "images": [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Silverleaf Sonoran Villa pool and mountain backdrop",
    "coordinates": {
      "lat": 33.5975,
      "lng": -111.8485
    },
    "amenities": [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Mediterranean Spanish revival estate located behind the double gates of Silverleaf Club in North Scottsdale.",
      "Courtyard entries, fountains, custom beamed ceilings, resort pool with swim-up bar, and outdoor kitchen with McDowell Mountain backdrops."
    ],
    "estimatedPayment": {
      "monthly": 14800,
      "formattedMonthly": "$14,800/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-33",
    "slug": "lincoln-park-brick-masterpiece-chicago",
    "title": "Lincoln Park Brick Masterpiece",
    "location": "1940 N Orchard St, Chicago, IL",
    "price": 3100000,
    "formattedPrice": "$3,100,000",
    "beds": 4,
    "baths": 4,
    "sqm": 390,
    "garage": 2,
    "badge": "NEW",
    "badges": [
      "NEW",
      "Single Family"
    ],
    "type": "sale",
    "category": "House",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Lincoln Park Brick Masterpiece modern brick facade",
    "coordinates": {
      "lat": 41.9174,
      "lng": -87.6469
    },
    "amenities": [
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Custom brick and limestone single family residence on one of Lincoln Park's most desirable tree-lined blocks.",
      "Features 4 levels of living space, commercial-grade elevator, radiant heated lower level, and a lush landscaped rooftop terrace with skyline views."
    ],
    "estimatedPayment": {
      "monthly": 13300,
      "formattedMonthly": "$13,300/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-34",
    "slug": "diamond-head-oceanfront-haven-honolulu",
    "title": "Diamond Head Oceanfront Haven",
    "location": "3920 Diamond Head Rd, Honolulu, HI",
    "price": 11200000,
    "formattedPrice": "$11,200,000",
    "beds": 5,
    "baths": 6,
    "sqm": 670,
    "garage": 3,
    "badge": "EXCLUSIVE",
    "badges": [
      "EXCLUSIVE",
      "Oceanfront"
    ],
    "type": "sale",
    "category": "Villa",
    "images": [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Diamond Head Oceanfront Haven pool and Pacific ocean horizon",
    "coordinates": {
      "lat": 21.2588,
      "lng": -157.8091
    },
    "amenities": [
      "Swimming Pool",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "One-of-a-kind oceanfront sanctuary at the base of Diamond Head crater with direct private ocean and surf break access.",
      "Featuring indoor-outdoor Hawaiian architecture, infinity edge saltwater pool, wrap-around lanais, and palm-shaded lawns."
    ],
    "estimatedPayment": {
      "monthly": 48100,
      "formattedMonthly": "$48,100/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-35",
    "slug": "salamanca-luxury-flat-madrid",
    "title": "Salamanca Luxury Flat",
    "location": "Calle de Serrano 42, Salamanca, Madrid",
    "price": 6500,
    "formattedPrice": "$6,500",
    "priceSuffix": "/mo",
    "beds": 2,
    "baths": 2,
    "sqm": 160,
    "garage": 1,
    "badge": "FOR RENT",
    "badges": [
      "FOR RENT",
      "Milla de Oro"
    ],
    "type": "rent",
    "category": "Apartment",
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Salamanca Luxury Flat high-ceiling living space",
    "coordinates": {
      "lat": 40.4284,
      "lng": -3.6874
    },
    "amenities": [
      "Gym",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace",
      "Parking"
    ],
    "description": [
      "Exquisite furnished residence situated in Madrid's Golden Mile on Calle Serrano, steps away from haute couture boutiques and gourmet restaurants.",
      "High ceilings, classic balconies overlooking Serrano, contemporary Italian furnishings, automated ducted climate control, and on-site concierge."
    ],
    "estimatedPayment": {
      "monthly": 6500,
      "formattedMonthly": "$6,500/mo",
      "downPaymentPercent": 0
    }
  },
  {
    "id": "market-36",
    "slug": "zurichberg-forest-view-penthouse-zurich",
    "title": "Zurichberg Forest View Penthouse",
    "location": "Zurichbergstrasse 90, 8044 Zurich, Switzerland",
    "price": 6850000,
    "formattedPrice": "$6,850,000",
    "beds": 3,
    "baths": 3.5,
    "sqm": 320,
    "garage": 2,
    "badge": "EXCLUSIVE",
    "badges": [
      "EXCLUSIVE",
      "Lake & Alps Views"
    ],
    "type": "sale",
    "category": "Penthouse",
    "images": [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Zurichberg Forest View Penthouse terrace with Alps views",
    "coordinates": {
      "lat": 47.3792,
      "lng": 8.5638
    },
    "amenities": [
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Exceptional penthouse apartment positioned atop the prestigious Zurichberg hill with panoramic views over Lake Zurich and the Swiss Alps.",
      "Floor-to-ceiling triple glazing, private rooftop terrace with fireplace, Swiss precision finishes, private sauna, and 2 garage spaces."
    ],
    "estimatedPayment": {
      "monthly": 29400,
      "formattedMonthly": "$29,400/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-37",
    "slug": "beacon-hill-brownstone-boston",
    "title": "Beacon Hill Brownstone",
    "location": "84 Chestnut St, Beacon Hill, Boston, MA",
    "price": 4200000,
    "formattedPrice": "$4,200,000",
    "beds": 4,
    "baths": 3.5,
    "sqm": 340,
    "garage": 1,
    "badge": "FOR SALE",
    "badges": [
      "FOR SALE",
      "Historic Landmark"
    ],
    "type": "sale",
    "category": "House",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Beacon Hill Brownstone historic brick entry",
    "coordinates": {
      "lat": 42.3571,
      "lng": -71.0708
    },
    "amenities": [
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Historic brick townhome on quiet gas-lit Chestnut Street in Boston's storied Beacon Hill neighborhood.",
      "Meticulously renovated five-story residence featuring an elevator, private brick garden patio, roof deck with Charles River views, and rare attached garage."
    ],
    "estimatedPayment": {
      "monthly": 18000,
      "formattedMonthly": "$18,000/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-38",
    "slug": "palm-jumeirah-sunset-villa-dubai",
    "title": "Palm Jumeirah Sunset Villa",
    "location": "Frond N, Palm Jumeirah, Dubai, UAE",
    "price": 15900000,
    "formattedPrice": "$15,900,000",
    "beds": 6,
    "baths": 7,
    "sqm": 820,
    "garage": 4,
    "badge": "EXCLUSIVE",
    "badges": [
      "EXCLUSIVE",
      "Private Beach"
    ],
    "type": "sale",
    "category": "Villa",
    "images": [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Palm Jumeirah Sunset Villa with private beach",
    "coordinates": {
      "lat": 25.1189,
      "lng": 55.1328
    },
    "amenities": [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Bespoke beachfront signature villa situated on Palm Jumeirah with private white sand beach and direct sunset views towards the Arabian Gulf.",
      "Private infinity swimming pool, marble-clad double height foyer, Poggenpohl showcase kitchen, spa sanctuary, and smart home automation."
    ],
    "estimatedPayment": {
      "monthly": 68300,
      "formattedMonthly": "$68,300/mo",
      "downPaymentPercent": 20
    }
  },
  {
    "id": "market-39",
    "slug": "golden-mile-beachfront-penthouse-marbella",
    "title": "Golden Mile Beachfront Penthouse",
    "location": "Bv. Príncipe Alfonso von Hohenlohe, Marbella, Spain",
    "price": 9200,
    "formattedPrice": "$9,200",
    "priceSuffix": "/mo",
    "beds": 3,
    "baths": 3,
    "sqm": 290,
    "garage": 2,
    "badge": "FOR RENT",
    "badges": [
      "FOR RENT",
      "Costa del Sol"
    ],
    "type": "rent",
    "category": "Penthouse",
    "images": [
      "https://images.unsplash.com/photo-1502005229762-ee1b2da97327?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Golden Mile Beachfront Penthouse rooftop solarium",
    "coordinates": {
      "lat": 36.5085,
      "lng": -4.9213
    },
    "amenities": [
      "Swimming Pool",
      "Gym",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Frontline Mediterranean penthouse in Marbella's famed Golden Mile, featuring an extensive wrap-around solarium with private plunge pool and summer bar.",
      "Gated community with 24-hour security, lush subtropical gardens, fitness wellness center, and direct boardwalk access."
    ],
    "estimatedPayment": {
      "monthly": 9200,
      "formattedMonthly": "$9,200/mo",
      "downPaymentPercent": 0
    }
  },
  {
    "id": "market-40",
    "slug": "westmount-heritage-manor-montreal",
    "title": "Westmount Heritage Manor",
    "location": "480 Mountain Ave, Westmount, Montreal, QC",
    "price": 3750000,
    "formattedPrice": "$3,750,000",
    "beds": 5,
    "baths": 4,
    "sqm": 460,
    "garage": 2,
    "badge": "FOR SALE",
    "badges": [
      "FOR SALE",
      "Heritage"
    ],
    "type": "sale",
    "category": "House",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    "imageAlt": "Westmount Heritage Manor stone facade and garden",
    "coordinates": {
      "lat": 45.4851,
      "lng": -73.5997
    },
    "amenities": [
      "Swimming Pool",
      "Parking",
      "Air Conditioning",
      "High-speed Wifi",
      "Patio / Terrace"
    ],
    "description": [
      "Distinguished grey stone residence situated on prestigious Mountain Avenue in Westmount.",
      "High ceilings, rich woodwork, leaded glass windows, contemporary open gourmet kitchen, heated outdoor inground pool, and private manicured grounds."
    ],
    "estimatedPayment": {
      "monthly": 16100,
      "formattedMonthly": "$16,100/mo",
      "downPaymentPercent": 20
    }
  }
];
