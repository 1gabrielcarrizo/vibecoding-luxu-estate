import { Locale } from "./config";

export interface LocalizedPropertyContent {
  title?: Record<Locale, string>;
  description?: Record<Locale, string[]>;
}

export const PROPERTY_LOCALIZATIONS: Record<string, LocalizedPropertyContent> = {
  "the-glass-pavilion": {
    title: {
      es: "The Glass Pavilion",
      en: "The Glass Pavilion",
      fr: "The Glass Pavilion",
    },
    description: {
      es: [
        "Ubicada entre las onduladas colinas de Beverly Hills, The Glass Pavilion es una obra maestra de la arquitectura moderna con espectaculares muros cortina de cristal y acabados artesanales a medida.",
        "Los extensos terrenos albergan una piscina infinita suspendida sobre el perfil de la ciudad, pabellones privados para recepciones y patios de arte contemporáneo cuidadosamente diseñados. Disfruta de una serenidad absoluta en la suite principal con vestidores dobles y baños de mármol con calefacción radiante.",
      ],
      en: [
        "Set amidst the rolling foothills of Beverly Hills, The Glass Pavilion is an architectural tour-de-force showcasing seamless glass curtain walls and bespoke architectural finishes.",
        "The expansive grounds feature an infinity pool hovering above city skylines, private entertaining pavilions, and curated modern art courtyards. Experience absolute serenity in the master suite with custom walk-in dressing suites and radiant-heated marble baths.",
      ],
      fr: [
        "Érigée sur les collines verdoyantes de Beverly Hills, The Glass Pavilion est un chef-d'œuvre architectural arborant de magnifiques façades de verre continu et des finitions d'exception réalisées sur-mesure.",
        "Le vaste domaine comprend une piscine à débordement dominant l'horizon urbain, des pavillons de réception privés et des cours intérieures ornées d'art contemporain. Vivez une quiétude absolue dans la suite parentale dotée de dressings sur-mesure et de salles de bains en marbre chauffé.",
      ],
    },
  },

  "azure-heights-penthouse": {
    title: {
      es: "Ático Azure Heights",
      en: "Azure Heights Penthouse",
      fr: "Penthouse Azure Heights",
    },
    description: {
      es: [
        "Elevado en lo más alto sobre la deslumbrante bahía de Vancouver, Azure Heights Penthouse redefine la vida cosmopolita con vistas panorámicas desde English Bay hasta las montañas de North Shore.",
        "El diseño de concepto abierto fluye de forma natural hacia una terraza perimetral privada de más de 110 m² equipada con calefacción exterior, bañera de hidromasaje y comedor al aire libre.",
      ],
      en: [
        "Perched high above Vancouver's glittering waterfront, Azure Heights Penthouse redefines urban skyline living with panoramic views stretching from English Bay to the North Shore Mountains.",
        "The open floor plan flows naturally into a 1,200 sq ft private wrap-around terrace equipped with outdoor heating, hot tub, and alfresco dining space.",
      ],
      fr: [
        "Surplombant la magnifique baie de Vancouver, le penthouse Azure Heights réinvente l'art de vivre urbain avec des vues panoramiques spectaculaires s'étendant d'English Bay aux montagnes du North Shore.",
        "L'espace de vie s'ouvre naturellement sur une terrasse panoramique privative de 110 m² équipée d'un système de chauffage extérieur, d'un jacuzzi et d'un salon dînatoire en plein air.",
      ],
    },
  },

  "serenity-lane-palo-alto": {
    title: {
      es: "Residencia 1234 Serenity Lane",
      en: "1234 Serenity Lane",
      fr: "Résidence 1234 Serenity Lane",
    },
    description: {
      es: [
        "Experimenta el lujo contemporáneo en esta impresionante residencia de diseño arquitectónico exclusivo, ubicada en el corazón de Palo Alto. Diseñada con un enfoque vanguardista de integración interior-exterior, cuenta con ventanales de piso a techo que inundan de luz natural todos sus ambientes.",
        "La cocina de concepto abierto está equipada con electrodomésticos de última generación y acabados de autor, ideal para los amantes de la alta gastronomía. La suite principal es un auténtico santuario de relajación con baño estilo spa y terraza privada.",
      ],
      en: [
        "Experience modern luxury in this architecturally stunning home located in the heart of Palo Alto. Designed with an emphasis on indoor-outdoor living, the residence features floor-to-ceiling glass walls that flood the interiors with natural light.",
        "The open-concept kitchen is equipped with top-of-the-line appliances and custom cabinetry, perfect for culinary enthusiasts. Retreat to the primary suite, a sanctuary of relaxation with a spa-inspired bath and private balcony.",
      ],
      fr: [
        "Découvrez le luxe contemporain dans cette demeure architecturale d'exception, idéalement située au cœur de Palo Alto. Conçue pour une harmonie parfaite entre intérieur et extérieur, la résidence dispose de baies vitrées toute hauteur inondant les espaces de lumière naturelle.",
        "La cuisine ouverte haut de gamme est équipée d'appareils de dernière génération et de finitions sur-mesure, idéale pour les passionnés de gastronomie. La suite parentale est un véritable sanctuaire de détente avec sa salle de bain d'inspiration spa et son balcon privé.",
      ],
    },
  },

  "modern-family-home-seattle": {
    title: {
      es: "Residencia Familiar Moderna",
      en: "Modern Family Home",
      fr: "Maison Familiale Moderne",
    },
    description: {
      es: [
        "Ubicada en una tranquila calle arbolada de Seattle, esta residencia familiar meticulosamente renovada combina la calidez artesanal del noroeste con la más avanzada eficiencia energética.",
        "Incluye amplias áreas sociales de concepto abierto, calefacción por suelo radiante, patio privado ajardinado y cochera cerrada climatizada.",
      ],
      en: [
        "Nestled on a serene tree-lined street in Seattle, this meticulously renovated family residence blends Northwest craft with contemporary energy efficiency.",
        "Features include open plan living, radiant floor heating, a landscaped private courtyard, and a detached insulated garage.",
      ],
      fr: [
        "Nichée dans une paisible avenue arborée de Seattle, cette maison familiale méticuleusement rénovée allie le savoir-faire artisanal du Nord-Ouest américain à une efficacité énergétique de premier ordre.",
        "Elle comprend de vastes pièces de réception ouvertes, un chauffage au sol rayonnant, un jardin intérieur privatif et un garage clos isolé.",
      ],
    },
  },

  "urban-loft-portland": {
    title: {
      es: "Loft Urbano Pearl District",
      en: "Urban Loft",
      fr: "Loft Urbain Pearl District",
    },
    description: {
      es: [
        "Un auténtico loft industrial en el exclusivo Pearl District, con techos de hormigón visto de más de 4 metros de altura, detalles en maderas nobles pulidas e impactantes vistas panorámicas de la ciudad.",
      ],
      en: [
        "An authentic Pearl District industrial loft featuring 14-foot exposed concrete ceilings, polished timber accents, and sweeping city views.",
      ],
      fr: [
        "Un authentique loft industriel au cœur du quartier branché de Pearl District, doté de plafonds en béton brut de plus de 4 mètres de hauteur, de touches de bois chaleureux et de vues imprenables sur la ville.",
      ],
    },
  },

  "highland-retreat-bend": {
    title: {
      es: "Refugio Alpino Highland",
      en: "Highland Retreat",
      fr: "Refuge Alpin Highland",
    },
    description: {
      es: [
        "Un refugio de montaña resguardado entre los majestuosos pinos de Central Oregon. Diseñado especialmente para fines de semana de esquí en Mount Bachelor y jornadas de verano en plena naturaleza.",
      ],
      en: [
        "A mountain getaway nestled in the ponderosa pines of Central Oregon. Designed for ski weekends at Mount Bachelor and sunny summer trail runs.",
      ],
      fr: [
        "Un havre de paix montagnard niché parmi les pins ponderosa de l'Oregon central. Conçu sur-mesure pour les escapades de ski au Mont Bachelor et les randonnées estivales ensoleillées.",
      ],
    },
  },

  "sea-view-penthouse-miami": {
    title: {
      es: "Ático Frente al Mar",
      en: "Sea View Penthouse",
      fr: "Penthouse Vue Mer",
    },
    description: {
      es: [
        "Despierta cada mañana ante el turquesa infinito del Océano Atlántico. Este ático en Miami Beach cuenta con ventanales de piso a techo y privilegios de cabaña privada exclusiva en la playa.",
      ],
      en: [
        "Wake up to turquoise Atlantic Ocean vistas every morning. This Miami Beach penthouse features expansive floor-to-ceiling glass and private beach cabana privileges.",
      ],
      fr: [
        "Réveillez-vous chaque matin face aux eaux turquoise de l'océan Atlantique. Ce penthouse à Miami Beach offre de spectaculaires baies vitrées du sol au plafond et l'accès privilégié à une cabine de plage privée.",
      ],
    },
  },

  "central-studio-chicago": {
    title: {
      es: "Estudio Céntrico de Lujo",
      en: "Central Studio",
      fr: "Studio Central Haut de Gamme",
    },
    description: {
      es: [
        "Un sofisticado pied-à-terre en pleno centro financiero de Chicago, a escasos pasos de Michigan Avenue y del emblemático Millennium Park.",
      ],
      en: [
        "A stylish pied-à-terre in the heart of downtown Chicago, steps from Michigan Avenue and Millennium Park.",
      ],
      fr: [
        "Un élégant pied-à-terre au cœur du centre de Chicago, à quelques pas de Michigan Avenue et du célèbre Millennium Park.",
      ],
    },
  },

  "garden-villa-austin": {
    title: {
      es: "Villa Jardín Contemporánea",
      en: "Garden Villa",
      fr: "Villa Jardin Contemporaine",
    },
    description: {
      es: [
        "Diseño contemporáneo de una sola planta enmarcado por exuberante vegetación autóctona de Texas, piscina privada de entrenamiento y amplia terraza comedor al aire libre.",
      ],
      en: [
        "Contemporary single-story design framed by native Texas landscaping, private lap pool, and breezy outdoor dining patio.",
      ],
      fr: [
        "Design contemporain de plain-pied entouré d'une végétation texane soignée, agrémenté d'un couloir de nage privé et d'un patio dînatoire ombragé.",
      ],
    },
  },

  "the-aurora-villa-malibu": {
    title: {
      es: "The Aurora Villa",
      en: "The Aurora Villa",
      fr: "The Aurora Villa",
    },
    description: {
      es: [
        "Enclavada en los prestigiosos acantilados de Malibu, The Aurora Villa ofrece ininterrumpidas vistas al Océano Pacífico, piscina con borde infinito y sendero privado directo a la playa.",
      ],
      en: [
        "Perched in the prestigious Malibu bluffs, The Aurora Villa boasts sweeping Pacific ocean views, zero-edge pool, and private pathway to the sand.",
      ],
      fr: [
        "Perchée sur les falaises emblématiques de Malibu, The Aurora Villa offre des vues saisissantes sur l'océan Pacifique, une piscine à débordement miroir et un accès piéton privé direct à la plage.",
      ],
    },
  },

  "the-highline-residence-ny": {
    title: {
      es: "Residencia The High Line",
      en: "The Highline Residence",
      fr: "Résidence The High Line",
    },
    description: {
      es: [
        "Vistas directas al icónico parque High Line a través de ventanales curvos de autor en el exclusivo barrio de Chelsea.",
      ],
      en: [
        "Direct High Line park views from architect-designed curved glass bays in Chelsea.",
      ],
      fr: [
        "Vues plongeantes directes sur le parc de la High Line depuis des baies vitrées galbées d'architecte à Chelsea.",
      ],
    },
  },

  "bellavista-manor-lake-como": {
    title: {
      es: "Mansión Bellavista Lago de Como",
      en: "Bellavista Manor",
      fr: "Manoir Bellavista Lac de Côme",
    },
    description: {
      es: [
        "Histórica finca señorial a orillas del Lago de Como con muelle privado para embarcaciones, jardines botánicos y techos con frescos originales restaurados.",
      ],
      en: [
        "Historic luxury estate on the shores of Lake Como with private dock, botanical gardens, and frescoed ceilings.",
      ],
      fr: [
        "Propriété historique d'exception sur les rives du lac de Côme avec ponton privé, jardins botaniques et plafonds aux fresques d'époque restaurées.",
      ],
    },
  },

  "komorebi-zen-house-kyoto": {
    title: {
      es: "Casa Zen Komorebi",
      en: "Komorebi Zen House",
      fr: "Maison Zen Komorebi",
    },
    description: {
      es: [
        "Armoniosa residencia contemporánea japonesa con tina de madera tradicional hinoki, jardín de rocas zen y salón ceremonial de té.",
      ],
      en: [
        "Harmonious Japanese contemporary residence featuring hinoki wood bath, rock garden, and traditional tearoom.",
      ],
      fr: [
        "Résidence contemporaine japonaise raffinée comprenant un bain traditionnel en bois de hinoki, un jardin de pierres zen et un pavillon de thé authentique.",
      ],
    },
  },

  "crown-sky-penthouse-miami": {
    title: {
      es: "Ático Crown Sky",
      en: "Crown Sky Penthouse",
      fr: "Penthouse Crown Sky",
    },
    description: {
      es: [
        "Elevado sobre el distrito financiero de Brickell, cuenta con piscina privada en azotea, suelos de mármol italiano y terraza lounge para contemplar el atardecer.",
      ],
      en: [
        "Soaring above Brickell Financial District with private rooftop pool, Italian marble flooring, and sunset lounge.",
      ],
      fr: [
        "Dominant le quartier d'affaires de Brickell avec sa piscine privée sur le toit, ses sols en marbre d'Italie et son salon lounge face au coucher du soleil.",
      ],
    },
  },

  "canal-view-atelier-amsterdam": {
    title: {
      es: "Atelier Vista al Canal",
      en: "Canal View Atelier",
      fr: "Atelier Vue Canal",
    },
    description: {
      es: [
        "Exclusivo apartamento restaurado en una casa señorial del siglo XVII junto al canal Herengracht, declarado Patrimonio de la Humanidad por la UNESCO.",
      ],
      en: [
        "Restored 17th-century canal house apartment on the UNESCO-protected Herengracht canal.",
      ],
      fr: [
        "Appartement d'exception restauré dans un hôtel particulier du XVIIe siècle longeant le prestigieux canal Herengracht, classé au patrimoine mondial de l'UNESCO.",
      ],
    },
  },

  "the-pinecrest-haven-aspen": {
    title: {
      es: "Refugio The Pinecrest Haven",
      en: "The Pinecrest Haven",
      fr: "Refuge The Pinecrest Haven",
    },
    description: {
      es: [
        "Exclusivo santuario alpino en Aspen con acceso directo ski-in/ski-out a las pistas y panorámicas imponentes hacia las cordilleras nevadas.",
      ],
      en: [
        "Exclusive Aspen alpine sanctuary with direct ski-in/ski-out trail access and breathtaking mountain views.",
      ],
      fr: [
        "Sanctuaire alpin d'exception à Aspen avec accès direct skis aux pieds aux pistes et panoramas spectaculaires sur les massifs enneigés.",
      ],
    },
  },

  "solarium-penthouse-vancouver": {
    title: {
      es: "Ático Solarium Kitsilano",
      en: "Solarium Penthouse",
      fr: "Penthouse Solarium Kitsilano",
    },
    description: {
      es: [
        "Ático en primera línea de playa en Kitsilano con vistas ininterrumpidas a English Bay y a los senderos de Stanley Park.",
      ],
      en: [
        "Kitsilano beachfront penthouse overlooking English Bay and Stanley Park.",
      ],
      fr: [
        "Penthouse en front de mer à Kitsilano avec vue plongeante sur English Bay et les boisés de Stanley Park.",
      ],
    },
  },

  "nordic-dune-villa-skagen": {
    title: {
      es: "Villa Nórdica de las Dunas",
      en: "Nordic Dune Villa",
      fr: "Villa Nordique des Dunes",
    },
    description: {
      es: [
        "Arquitectura costera danesa de estilo minimalista que se integra de manera orgánica entre las dunas de arena y la brisa marina.",
      ],
      en: [
        "Minimalist Danish coastal architecture blending seamlessly with sand dunes and wild coastal grasses.",
      ],
      fr: [
        "Architecture côtière danoise minimaliste s'intégrant parfaitement dans le paysage de dunes sauvages et de graminées marines.",
      ],
    },
  },

  "metropolis-loft-london": {
    title: {
      es: "Loft Metrópolis SoHo",
      en: "Metropolis Loft",
      fr: "Loft Métropole SoHo",
    },
    description: {
      es: [
        "Ultra sofisticado loft de diseño en SoHo que ofrece un oasis de tranquilidad en el vibrante corazón teatral y cultural de Londres.",
      ],
      en: [
        "Ultra-chic SoHo loft apartment offering secluded designer living in central London's vibrant theatre district.",
      ],
      fr: [
        "Appartement loft ultra-chic à SoHo offrant un cadre de vie intimiste d'architecte au cœur du quartier effervescent des théâtres de Londres.",
      ],
    },
  },

  "silverstone-estate-los-angeles": {
    title: {
      es: "Mansión Silverstone Bel Air",
      en: "Silverstone Estate",
      fr: "Domaine Silverstone Bel Air",
    },
    description: {
      es: [
        "Exclusiva propiedad privada en Bel Air con jardines de rosas esculpidos, cocina gourmet de chef profesional y una imponente terraza al aire libre.",
      ],
      en: [
        "Gated Bel Air estate with manicured rose gardens, custom chef's kitchen, and expansive outdoor terrace.",
      ],
      fr: [
        "Domaine privé sécurisé à Bel Air doté de roseraies paysagées, d'une cuisine de grand chef sur-mesure et d'une vaste terrasse extérieure.",
      ],
    },
  },

  "skyline-panorama-new-york": {
    title: {
      es: "Ático Skyline Panorama Park Avenue",
      en: "Skyline Panorama",
      fr: "Penthouse Skyline Panorama Park Avenue",
    },
    description: {
      es: [
        "Emblemático ático de gran lujo en Park Avenue con vestíbulo de ascensor privado y vistas despejadas a Central Park.",
      ],
      en: [
        "Iconic Park Avenue luxury penthouse featuring private elevator vestibule and Central Park vistas.",
      ],
      fr: [
        "Penthouse de prestige emblématique sur Park Avenue disposant d'un palier d'ascenseur privatif et d'une vue dégagée sur Central Park.",
      ],
    },
  },

  "desert-horizon-villa-scottsdale": {
    title: {
      es: "Villa Desierto Horizon",
      en: "Desert Horizon Villa",
      fr: "Villa Horizon Désertique",
    },
    description: {
      es: [
        "Impresionante diseño modernista en el desierto de Sonora con piscina de borde infinito y majestuosas vistas a las montañas rocosas.",
      ],
      en: [
        "Stunning Sonoran desert modernism with negative-edge swimming pool and mountain views.",
      ],
      fr: [
        "Superbe villa moderniste dans le désert de Sonora avec piscine à débordement miroir et vues spectaculaires sur les reliefs rocheux.",
      ],
    },
  },

  "harbour-view-suite-sydney": {
    title: {
      es: "Suite Harbour View Sydney",
      en: "Harbour View Suite",
      fr: "Suite Vue Port de Sydney",
    },
    description: {
      es: [
        "Vistas panorámicas hacia el puerto de Sydney y el Real Jardín Botánico desde una de las direcciones más prestigiosas de Australia.",
      ],
      en: [
        "Panoramic views across Sydney Harbour and the Royal Botanic Garden from this prestigious address.",
      ],
      fr: [
        "Vues panoramiques sur la baie de Sydney et les Jardins Botaniques Royaux depuis cette prestigieuse adresse de renommée internationale.",
      ],
    },
  },
};

/**
 * Returns localized description for a property based on its slug and locale.
 */
export function getLocalizedDescription(
  slug: string,
  locale: Locale,
  fallback?: string[]
): string[] {
  const item = PROPERTY_LOCALIZATIONS[slug];
  if (item && item.description && item.description[locale]) {
    return item.description[locale];
  }
  return fallback || [];
}

/**
 * Returns localized title for a property if available.
 */
export function getLocalizedTitle(
  slug: string,
  locale: Locale,
  fallbackTitle: string
): string {
  const item = PROPERTY_LOCALIZATIONS[slug];
  if (item && item.title && item.title[locale]) {
    return item.title[locale];
  }
  return fallbackTitle;
}
