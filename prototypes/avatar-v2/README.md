# Avatar V2 prototype

This directory proves the replacement portrait pipeline before it is wired into
the live creator.

`canonical-portrait.svg` uses stable, named layer groups that correspond to the
existing avatar schema: backdrop, body, neck, ears, face, eyes, brows, nose,
mouth, hair, markings, accessories, and frame. The game can keep its current
randomization, aging, and genetic-inheritance data while replacing only the
primitive Canvas drawing backend.

Expansion should happen only after the canonical portrait is approved. The
first production slice should cover three skin tones, two face shapes, two eye
shapes, three hairstyles, two outfits, and a small markings/accessories set.
