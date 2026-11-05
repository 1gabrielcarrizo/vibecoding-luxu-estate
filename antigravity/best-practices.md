# Buenas Prácticas — Luxe Estate (Next.js & Real Estate)

Guía condensada y directa de lineamientos técnicos, diseño, rendimiento y conversión para el desarrollo de la plataforma inmobiliaria.

---

## 1. Arquitectura & Next.js (App Router)
* **Server Components por defecto (`RSC`):** Renderizar listados, fichas de propiedad y páginas estáticas en el servidor para enviar el mínimo JS al cliente.
* **`use client` aislado:** Limitar exclusivamente a componentes interactivos (filtros, mapas, carruseles, calculadoras, modales).
* **Filtros en URL (`searchParams`):** Persistir filtros en la URL para enlaces compartibles, soporte de historial del navegador y mejor SEO.
* **Streaming y Suspense:** Implementar `loading.tsx` y Skeletons animados para evitar pantallas en blanco durante la carga.
* **Server Actions:** Procesar formularios de contacto, agendamiento y favoritos mediante Server Actions con tipado estricto.
* **Revalidación en caché (ISR):** Usar `revalidateTag` para actualizar fichas de propiedades de inmediato al cambiar precio o estado (Vendida/Disponible).

---

## 2. Optimización Multimedia & Core Web Vitals
* **Uso estricto de `next/image`:** Obligatorio para todas las fotografías de propiedades.
* **Priority en LCP:** Asignar `priority` únicamente a la primera imagen visible (Hero / foto principal del inmueble).
* **Formatos modernos:** Configurar Next.js para servir automáticamente WebP y AVIF.
* **Placeholders borrosos:** Implementar `placeholder="blur"` con `blurDataURL` para cargas suaves sin saltos de diseño (CLS).
* **Lazy loading en galerías:** Cargar fotos secundarias bajo demanda o al abrir el modal de galería.
* **Tours 360° diferidos (Facade pattern):** No incrustar iframes pesados (Matterport) de entrada; cargar con un clic sobre una portada estática.

---

## 3. SEO Técnico & Datos Estructurados
* **Metadata dinámica:** Configurar `generateMetadata` en `/propiedades/[slug]` con título, descripción y precio localizado.
* **Schema JSON-LD obligatorio:**
  * `RealEstateListing` o `SingleFamilyResidence` / `Apartment`.
  * `PostalAddress` y `Place` (ciudad, zona, país).
  * `Offer` (precio, divisa, disponibilidad).
  * `BreadcrumbList` (migas de pan para Google).
* **OG Images dinámicas (`@vercel/og`):** Tarjetas automáticas para compartir en WhatsApp y redes con foto, precio y ubicación.
* **Sitemap & Robots dinámicos:** Generar `sitemap.ts` automático para todas las propiedades y categorías activas.

---

## 4. Búsqueda, Filtrado & UX Inmobiliaria
* **Filtros facetados completos:** Por rango de precio, tipo de propiedad, recámaras, baños, metraje y amenidades.
* **Debounce en búsqueda:** Retraso de 300–400 ms en inputs de texto antes de ejecutar la consulta.
* **Vista dual (Grid / Mapa):** Sincronización interactiva; hacer hover en una tarjeta resalta su pin en el mapa.
* **Clustering en mapas:** Agrupar pines por proximidad para evitar saturación y pérdida de fluidez.
* **Formateo numérico:** Usar `Intl.NumberFormat` para precios (`$1,250,000 USD`) y superficies (`m²` / `sq ft`).
* **Favoritos sin fricción:** Persistencia instantánea en `localStorage` (y sincronización con cuenta si existe sesión).

---

## 5. Captación de Leads & Conversión
* **WhatsApp contextual:** Botón directo con mensaje prellenado incluyendo referencia y título de la propiedad.
* **Formulario de contacto directo:** Opciones para agendar visita presencial o videollamada con pocos campos obligatorios.
* **Calculadora de hipoteca:** Simulación interactiva de cuotas mensuales según enganche, tasa de interés y plazo.
* **Descarga de ficha técnica:** Botón para descargar PDF / brochure de la propiedad a cambio de email.
* **Perfil del asesor:** Mostrar foto, nombre y contacto directo del agente a cargo de la propiedad.

---

## 6. Diseño & Estilo (Luxe Estate)
* **Paleta de colores oficial:**
  * Fondo general: `Clear Day` (`#EEF6F6`)
  * Botones y CTAs: `Mosque` (`#006655`)
  * Headers y texto: `Nordic` (`#19322F`)
  * Tarjetas destacadas: `Hint of Green` (`#D9ECC8`)
* **Tipografía:** Uso exclusivo de `SF Pro Display`.
* **Componentización modular:** Componentes reutilizables para `PropertyCard`, `Badge`, `PriceTag`, `Gallery` y `FilterBar`.
* **Accesibilidad (a11y):** Textos `alt` descriptivos en imágenes, navegación por teclado en modales y contraste WCAG AA.

---

## 7. Ideas Clave & Diferenciales
* **Filtro por Estilo de Vida:** Colecciones curadas (*Frente al Mar*, *Montaña*, *Golf*, *Urbano de Lujo*).
* **Comparador de propiedades:** Tabla lado a lado para evaluar 2 o 3 propiedades simultáneamente.
* **Puntos de interés (Walk Score):** Indicadores de cercanía a colegios, hospitales, aeropuertos y zonas gastronómicas.
* **Alertas de precio:** Opción para que el usuario reciba aviso cuando baje de precio una propiedad guardada.
