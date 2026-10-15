import { Property, UserProfile, NavLink, PropertyCategory } from "@/types/property";

export const currentUser: UserProfile = {
  name: "Alexander Vance",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA",
};

export const navLinks: NavLink[] = [
  { label: "Buy", href: "#", isActive: true },
  { label: "Rent", href: "#" },
  { label: "Sell", href: "#" },
  { label: "Saved Homes", href: "#" },
];

export const categoryFilters: PropertyCategory[] = [
  "All",
  "House",
  "Apartment",
  "Villa",
  "Penthouse",
];

export const featuredProperties: Property[] = [
  {
    id: "featured-1",
    title: "The Glass Pavilion",
    location: "Beverly Hills, California",
    price: 5250000,
    formattedPrice: "$5,250,000",
    beds: 5,
    baths: 4.5,
    sqm: 4200,
    badge: "Exclusive",
    type: "sale",
    category: "Villa",
    isFeatured: true,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM",
    imageAlt: "Luxury modern villa exterior with pool",
  },
  {
    id: "featured-2",
    title: "Azure Heights Penthouse",
    location: "Downtown, Vancouver",
    price: 3800000,
    formattedPrice: "$3,800,000",
    beds: 3,
    baths: 3,
    sqm: 2100,
    badge: "New Arrival",
    type: "sale",
    category: "Penthouse",
    isFeatured: true,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s",
    imageAlt: "Modern interior living room with view",
  },
];

export const initialMarketProperties: Property[] = [
  {
    id: "market-1",
    title: "Modern Family Home",
    location: "123 Pine St, Seattle",
    price: 850000,
    formattedPrice: "$850,000",
    beds: 3,
    baths: 2,
    sqm: 120,
    badge: "FOR SALE",
    type: "sale",
    category: "House",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ9M7U6euA6_cXmYuXnej-N5IuawAW8ds-4G1mzfqmiBc13qXsPhf9_j_zTB8gfEunrBHo8xMsxYwCw_pl8fsxbxRkmyvLR1N9Tiye5ZJG7fwlLn9MwyBanXYhE0emGwp59es1FEyQTRQbmXLUKO74Yj34ZHqrqIkOtMKhP8CmRFvfoHT5LAe10105vUhKNkxIBvtt530nfLigSUTemOOcJMVNmsgactntRJUwOBU_TZzND7BYtDklr8uZcNYlQOK5U74-ufIf-E",
    imageAlt: "Modern white house facade",
  },
  {
    id: "market-2",
    title: "Urban Loft",
    location: "456 Elm Ave, Portland",
    price: 3200,
    formattedPrice: "$3,200",
    priceSuffix: "/mo",
    beds: 1,
    baths: 1,
    sqm: 85,
    badge: "FOR RENT",
    type: "rent",
    category: "Apartment",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4zNatD3vePhIZAi6OHHJKmamYSgeBNSKjEt32tvkkf4s6aBXCF8R4LNfDfPa9leA0t6N1OKOcP358WwZrnosbCBxSM7EaY2_P7qkx3MinRgmHQn7RvleNTwy8cLigMoR3iv0u83chBVbZYI6BcNMcqv80W-l1pIUgIWZcDIXEqtUatrsojSGfM0lTNDZpkBntBUkRY6NB4ZUymYNYvTHXKbO8NZ6N6uoyuuHqcaRWKzHCNXkOR3p-_EVFAHR8QwijIY_m1mefPZ4",
    imageAlt: "Stylish apartment living room",
  },
  {
    id: "market-3",
    title: "Highland Retreat",
    location: "789 Mountain Rd, Bend",
    price: 620000,
    formattedPrice: "$620,000",
    beds: 2,
    baths: 2,
    sqm: 98,
    badge: "FOR SALE",
    type: "sale",
    category: "House",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARQWC19e7mleUpjb8CWLztEv_svJeRFOaC2i-9r9GctFuX5Barzhfai9wNM1WW8bcGlqdFM32d3KPf7SItom5ijdHOz5rGGQPeT7PlWs8-y9LkfcsHLQqsLxalhxP94XJo76_mAMp7T2dVj3hPKHNzTDLLiS6ujSdSsyo3onxQthp4ZkVE8op92gyTLUUucaGaxO8vJvyhH3HuWB07EPqT1WsW0lr9Of5lUPonjG9eiqE1XiJXTqzXUZQt5JorfPwCO1MioZA_Zro",
    imageAlt: "Cabin in the woods",
  },
  {
    id: "market-4",
    title: "Sea View Penthouse",
    location: "321 Ocean Dr, Miami",
    price: 4500,
    formattedPrice: "$4,500",
    priceSuffix: "/mo",
    beds: 3,
    baths: 3,
    sqm: 180,
    badge: "FOR RENT",
    type: "rent",
    category: "Penthouse",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGq4Phm0uDzCnjHAsnWpYTBVpOds_M6iOsJuRQQA5eUZHkztGgtc7eh_OE6wBeyW1-iZh7yyhROnvvmqkAZ9tyAWFGXk0FG52zU4kZ_EDLA0U0cRszy7byNXTeWe0_hS53SYmtCTEV8Y1AM-WxiIC38UMa15QwFDjXtCGQOxoh35K0Ol_70vfsxm0VqDbaWkr8tcEbLTLy0NXH_GcpGK4lAXizgxYOIlFWGyau-4OIfPZRpjCBDbz_qu3VlN201UUJGiuM9ajVd-U",
    imageAlt: "Bright bedroom with large window",
  },
  {
    id: "market-5",
    title: "Central Studio",
    location: "555 Main St, Chicago",
    price: 550000,
    formattedPrice: "$550,000",
    beds: 1,
    baths: 1,
    sqm: 50,
    badge: "FOR SALE",
    type: "sale",
    category: "Apartment",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA1w-Hb1289NqZKon3VK8bpmMiCDYYiAMT5egzTINo9m9wSZRHv-k-1IGTVoL1NT8YeZXJHa87JPNDIPrtrbP7jChHq0ypXF90uByhC6VA9O788_B4FY8JVg4chbWN9bcrn9-9FvVvfZX8Aj60Iqg_C8CsCA9DEnJqi2rJvzmK5UP5z-9XRTRjBneAPCa8iGgGWBD9yYKsziN6vn0ePBDGo3inieQtmbr46W31p6UfQ649XRxTm7ygOY2J-jxW1r0qWs8i97KGpkTE",
    imageAlt: "Cozy apartment interior",
    hideOnBreakpoint: "hidden xl:flex",
  },
  {
    id: "market-6",
    title: "Garden Villa",
    location: "999 Oak Ln, Austin",
    price: 2800,
    formattedPrice: "$2,800",
    priceSuffix: "/mo",
    beds: 2,
    baths: 2,
    sqm: 110,
    badge: "FOR RENT",
    type: "rent",
    category: "Villa",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfGXdY0g51ojSg0GMeTW9ndLY3mpKK3oMtWxo2nwd_dwi1pgn1Boi_ovaDGIFhUA7nwu3WdBch8ZuHxoHu3QfgM5ceAsp8pglRVyCROWNcy9zeDNP2wqLoevyKGcaEyFYHYpIx2KK46nLWthnHiHugmkKw48kJsL8IjMO1bL3T1Zwt8bvQDTTUHTgB3GqZ2RU2asRzF1jVg0rLw3LWXXTq0YF1CsbhlWpYOuCEpH5bB8zkBlbKXR4At_M46AL8rJqn5c6BrPD5PP8",
    imageAlt: "Modern minimalist home exterior",
    hideOnBreakpoint: "hidden lg:flex",
  },
];

export const additionalMarketProperties: Property[] = [
  {
    id: "market-7",
    title: "Silverstone Estate",
    location: "880 Bel Air Rd, Los Angeles",
    price: 1250000,
    formattedPrice: "$1,250,000",
    beds: 4,
    baths: 3.5,
    sqm: 290,
    badge: "FOR SALE",
    type: "sale",
    category: "House",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM",
    imageAlt: "Silverstone Estate exterior",
  },
  {
    id: "market-8",
    title: "Skyline Panorama",
    location: "740 Park Ave, New York",
    price: 6800,
    formattedPrice: "$6,800",
    priceSuffix: "/mo",
    beds: 2,
    baths: 2,
    sqm: 140,
    badge: "FOR RENT",
    type: "rent",
    category: "Penthouse",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDurAGHzg_fpQxFal-obkFVy1Q3WLPdueAQpz0itcQiRV-WfvulnBEDJbNeV8J06q4mX7PTtXYVJjX4-mHVr_khZLZxQ_s8f6fruGqzeqALyMu8wEHRK1EsOs9f4_jPmS7FxcdzrDkR88Wz0GjaPLXkTZRoJQfur59rxYRLi-WYcW-VU_gKS39CPLOMlftvqGvW0IOk5tXgst5mJ4WQM-ICN4vkdel9ido9YFUQga0OI10i6NSe5W4owt33-2YRi_b_ltdZW2QZC5s",
    imageAlt: "Skyline Panorama view",
  },
];
