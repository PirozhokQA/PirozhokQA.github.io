# Klimt — living gallery concept

Independent preview at /klimt-concept/, with Armenian, Russian and English pages. The existing /klimt-beauty-house/ site and the personal GitHub Pages homepage are preserved.

The design uses a large editorial wordmark, asymmetric authentic salon photographs, a typographic service index, and a restrained floral entrance motif. The floral illustration was created with the built-in imagegen tool from the user’s photograph of the salon entrance; it is decorative artwork and never substitutes for a photograph of salon work. See flower-prompt.md for the exact prompt. The entrance photograph itself is not published.

All salon work photographs, translations, people, contacts and service descriptions are reused from the verified /klimt-beauty-house/_source/content.mjs. No new prices, opening hours or claims are added.

Motion: 10-second photo changes with crossfades; slow photographic movement; subtle floral sway; viewport reveals. A pause control stops motion. prefers-reduced-motion is respected; hidden tabs stop the slideshow timer. There is no scroll hijacking and no automatic audio. The real Instagram Reel opens via an explicit link; no playable local video is claimed.

References inspected: https://larrykinghair.com/ (editorial photography), https://www.salon64.co.uk/ (spatial atmosphere), https://leco.tokyo/ (visual identity), https://www.hershesons.com/ (movement in hair presentation). No reference site's photos, copy or source code are reused.

Build: node klimt-concept/_source/build.mjs, from the repository root. The source imports the original central data and outputs the three static concept pages. Assets under /klimt-beauty-house/assets/ are shared. The flower illustration is local to this concept. Google Fonts supply Cormorant Garamond, Manrope, Noto Serif Armenian and Noto Sans Armenian, with system fallbacks.

The preview pages have noindex,nofollow. Production SEO is unchanged.

Validation completed: syntax check; all local assets and anchor targets; three translated pages; image dimensions; contact destinations; no untranslated Russian text in Armenian/English except the language selector; responsive checks at 360, 390, 768 and 1440 px; menu/Escape; lightbox arrows/Escape/focus return; animation pause; language switching preserving the section hash.