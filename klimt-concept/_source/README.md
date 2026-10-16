# Klimt — living gallery concept

Independent preview at /klimt-concept/, with Armenian, Russian and English pages. The existing /klimt-beauty-house/ site and the personal GitHub Pages homepage are preserved.

The design uses a large editorial wordmark, asymmetric authentic salon photographs, a typographic service index, and a horizontal floral masthead inspired by the salon entrance. The floral illustration was created with the built-in imagegen tool from the user’s photograph of the salon entrance; it is decorative artwork and never substitutes for a photograph of salon work. See flower-prompt.md for the exact prompt. The entrance photograph itself is not published.

All salon work photographs, translations, people, contacts and service descriptions are reused from the verified /klimt-beauty-house/_source/content.mjs. No new prices, opening hours or claims are added.

Motion: 10-second photo changes with crossfades; slow photographic movement; subtle masthead movement; viewport reveals. A pause control stops motion. prefers-reduced-motion is respected; hidden tabs stop the slideshow timer. There is no scroll hijacking and no automatic audio. The real Instagram Reel opens via an explicit link; no playable local video is claimed.

References inspected: https://larrykinghair.com/ (editorial photography), https://www.salon64.co.uk/ (spatial atmosphere), https://leco.tokyo/ (visual identity), https://www.hershesons.com/ (movement in hair presentation). No reference site's photos, copy or source code are reused.

Build: node klimt-concept/_source/build.mjs, from the repository root. The source imports the original central data and outputs the three static concept pages. Assets under /klimt-beauty-house/assets/ are shared. The flower illustration is local to this concept. Google Fonts supply Cormorant Garamond, Manrope, Noto Serif Armenian and Noto Sans Armenian, with system fallbacks.

The preview pages have noindex,nofollow. Production SEO is unchanged.

Validation completed: syntax check; all local assets and anchor targets; three translated pages; image dimensions; contact destinations; no untranslated Russian text in Armenian/English except the language selector; responsive checks at 360, 390, 768 and 1440 px; menu/Escape; lightbox arrows/Escape/focus return; animation pause; language switching preserving the section hash.
Revision: all corner floral ornaments were removed from the main photograph and contacts. A horizontal floral garland spans the top of the page above the navigation. Photo captions are 16 px on desktop and 14 px on mobile, with stronger contrast and larger line spacing. The new header illustration is assets/header-flowers.png. The previous corner illustration remains in source history and is not rendered.

Header refinement: removed the pink concept strip; the floral canopy starts at the viewport top. A single non-repeating panoramic image replaces tiling. The masthead is 170–260 px high, with responsive cover cropping and preserved photo caption sizes.
