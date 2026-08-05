# Design reference

The visual source of truth for Afarkeset LaKnesset is Lotem's Figma file
( "Knesset Frame 3" ). This folder holds everything derived from it, so the
project carries its own design memory and depends on nothing outside this
folder.

## What is here

- `figma-renders/` - the design, rendered to PNG from the PDF export.
  `overview.png` is the full canvas map; the lettered tiles are close-ups of
  each screen ( D1 agenda, D5 bill page, H discussion player, C filters
  panel, and so on ). The MVP was built and visually verified against these.
- `knesset-pdf-text.txt` - every text layer of the design, extracted from the
  PDF. This is where the Hebrew editorial content was transcribed from, and
  the place to check wording against the original.
- `render-tile.js` - the tool that produced the renders. It crops a region of
  a PDF at any resolution using macOS's built-in PDFKit ( no installs ):

  ```
  osascript -l JavaScript render-tile.js <pdf> <x> <yTop> <w> <h> <scale> <out.png>
  ```

  Coordinates are PDF points, top-left origin; the canvas is 12645 x 11291.

## One thing to know

The PDF export itself ( "Knesset Frame 3.pdf", ~15MB ) is NOT here: it lived
in the iCloud Downloads folder and was gone by 2026-08-05 - which is exactly
why this folder exists inside the project now. The Figma cloud file remains
the master. If you re-export a PDF, drop it in this folder next to the
renders and pass its path to render-tile.js.
