# Klimt — living gallery concept

Independent preview at /klimt-concept/, with Armenian, Russian and English pages. The existing /klimt-beauty-house/ site and the personal GitHub Pages homepage are preserved.

The design uses a compact wordmark in the header, asymmetric authentic salon photographs, a typographic service index, and a horizontal floral masthead inspired by the salon entrance. The floral illustration was created with the built-in imagegen tool from the user’s photograph of the salon entrance; it is decorative artwork and never substitutes for a photograph of salon work. See flower-prompt.md for the exact prompt. The entrance photograph itself is not published.

All salon work photographs, translations, people, contacts and service descriptions are reused from the verified /klimt-beauty-house/_source/content.mjs. No new prices, opening hours or claims are added.

Motion: 10-second photo changes with crossfades; slow photographic movement; subtle masthead movement; viewport reveals. A pause control stops motion. prefers-reduced-motion is respected; hidden tabs stop the slideshow timer. There is no scroll hijacking and no automatic audio. The real Instagram Reel opens via an explicit link; no playable local video is claimed.

References inspected: https://larrykinghair.com/ (editorial photography), https://www.salon64.co.uk/ (spatial atmosphere), https://leco.tokyo/ (visual identity), https://www.hershesons.com/ (movement in hair presentation). No reference site's photos, copy or source code are reused.

Build: node klimt-concept/_source/build.mjs, from the repository root. The source imports the original central data and outputs the three static concept pages. Assets under /klimt-beauty-house/assets/ are shared. The flower illustration is local to this concept. Google Fonts supply Cormorant Garamond, Manrope, Noto Serif Armenian and Noto Sans Armenian, with system fallbacks.

The preview pages have noindex,nofollow. Production SEO is unchanged.

Validation completed: syntax check; all local assets and anchor targets; three translated pages; image dimensions; contact destinations; no untranslated Russian text in Armenian/English except the language selector; responsive checks at 360, 390, 768 and 1440 px; menu/Escape; lightbox arrows/Escape/focus return; animation pause; language switching preserving the section hash.
Revision: all corner floral ornaments were removed from the main photograph and contacts. A horizontal floral garland spans the top of the page above the navigation. Photo captions are 16 px on desktop and 14 px on mobile, with stronger contrast and larger line spacing. The new header illustration is assets/header-flowers.png. The previous corner illustration remains in source history and is not rendered.

Header refinement: removed the pink concept strip; the floral canopy starts at the viewport top. A single non-repeating panoramic image replaces tiling. The masthead is 170–260 px high, with responsive cover cropping and preserved photo caption sizes.

Dimensional header revision: a new imagegen edit adds layered petals, directional light and internal shadows. The header now renders an image rather than a cover background. Its height follows the visible alpha lower bound, with 40 px reserved for the drop shadow and motion, so the lower flower and leaf contours remain complete. Only the top edge is cropped to keep flowers aligned to the top of the page. Metadata: flower-volume-metadata.json.

Hero and navigation revision: the company name is now confined to the header, with a single native language select and an icon menu on mobile. The first screen uses one large portrait frame (the existing real-photo sequence), with text beside it on desktop and below it on narrow screens. The small nail photograph and overlapping hero wordmark are removed. Captions remain 16 px / 14 px.

Petal animation: an original canvas effect draws shaded cream, pink, lilac and wine petals. The petals drift from the floral canopy and scatter around pointer movement; the canvas never receives pointer events. The animation is capped at 30 fps with fewer particles on narrow screens, respects reduced motion and visibility, and stops with the existing pause button. No libraries or assets from COLBA are used.

Additional reference inspected: https://colbacolorbar.ru/ — atmospheric animated colour in the first screen. For Klimt the interaction is expressed with flower petals, retaining its own photos and palette.

Language menu revision: native disclosure with real language links replaces the browser select in both header and footer. Cream surfaces, pink selection, rounded rows and a check mark match the site. Supports keyboard arrows/Home/End/Escape, outside-click and focus dismissal, and preserves the current section hash. The footer popup opens upward.

Three alternative visual directions live under directions/: editorial (Bodoni Moda, Prata, Golos Text), bloom (Tenor Sans, Onest), atelier (Unbounded, Onest). They are separate Russian-language review pages, with an index for comparison. All use large legible branding, clean rectangular campaign images and the existing floral masthead and petal animation. Generated photographs are labeled as concept illustrations, never salon results. Actual work is linked to Instagram. Source: _source/build-directions.mjs; image prompts: _source/direction-image-prompts.md. Build after the main generator.

Selected design: Bloom is now the main hy/ru/en page layout, with the Editorial Bodoni Moda Klimt wordmark. The Russian hero phrase has no final full stop. The styled language dropdown, compact mobile menu, phone/Instagram booking and all three map destinations remain available. Generated images stay labeled; real work links to Instagram. Petals start off with the translated Enable petals control; when enabled they use a low-opacity canvas behind all content and solid reading surfaces. System reduced motion remains respected.

Petal visibility restored at the user request: the original layer above the page and 0.65 opacity are back. Petals start automatically unless reduced motion is requested by the system. The control toggles Disable petals / Enable petals. The selected Bloom layout and Editorial wordmark remain as selected.

Service portfolios: each card links to a translated service detail page. Hair has five existing authentic images; nails has three; makeup has two new high-resolution photos from the official Dehu6fWET_3 post, which credits Narine. Other categories have information and official Instagram/admin links without invented photos. Sources and per-service data: service-pages.mjs. Native dialog supports next/previous, keyboard arrows, Escape, close button and focus return. Language switching keeps the same service and section.

Current revision: visible captions beneath the two decorative campaign images, the hero tagline, the two numbered section eyebrows and the service-card indices are removed on all three main pages. The footer AI disclosure and descriptive alt text remain. The services heading uses two columns to fit the simplified layout. Petals start disabled on viewports up to 767 px and enabled on wider screens unless the system requests reduced motion; visitors can toggle them manually.

Seven additional authentic client-work photographs from the confirmed Klimt Yandex Maps gallery are optimized without retouching or upscaling. The brows/lashes gallery now has three photographs, makeup has five and nails has four; hair keeps its five photographs. Each photo links to its actual source, including in the lightbox. Cosmetology and ELOS keep information pages because no clearly attributable examples were found. Source metadata: map-photos.json.
