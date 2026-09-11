# Avatar V2 prototype

This directory proves the replacement portrait pipeline before it is wired into
the live creator.

`canonical-portrait.svg` uses stable, named layer groups that correspond to the
existing avatar schema: backdrop, body, neck, ears, face, eyes, brows, nose,
mouth, hair, markings, accessories, and frame. The game can keep its current
randomization, aging, and genetic-inheritance data while replacing only the
primitive Canvas drawing backend.

The approved first production slice is available in `index.html`. It exercises
three skin tones, two face shapes, two eye shapes, three hairstyles, two
outfits, three marking states, three accessory states, randomization, and a
six-character stress-test lineup. `avatar-v2-engine.js` holds the option
manifest and applies selections without changing the live game renderer.

Run `node render-contact-sheet.mjs` in a development environment with `sharp`
available to render 24 deterministic cross-feature portraits for visual QA.
