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

`avatar-v2-compat.js` is the migration boundary between existing saved/random
avatars and the smaller approved V2 option set. It maps every value emitted by
the current generator to a valid V2 configuration, incorporates useful
secondary traits such as eyelid and hair texture, and safely defaults unknown
or retired values. Run `node --test avatar-v2-compat.test.mjs` to verify the
legacy option matrix and representative creator archetypes.

Run `node render-contact-sheet.mjs` in a development environment with `sharp`
available to render 24 deterministic cross-feature portraits for visual QA.
