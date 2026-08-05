// Render a crop of the Knesset Figma PDF canvas to PNG.
// Usage: osascript -l JavaScript render-tile.js <pdfPath> <x> <yTop> <w> <h> <scale> <outPath>
// Coordinates are in PDF points with TOP-LEFT origin (converted internally to PDF bottom-left).
// The original export's canvas was 12645 x 11291 points.
ObjC.import("Quartz");
ObjC.import("AppKit");

function run(argv) {
  const path = argv[0];
  const x = parseFloat(argv[1]);
  const yTop = parseFloat(argv[2]);
  const w = parseFloat(argv[3]);
  const h = parseFloat(argv[4]);
  const scale = parseFloat(argv[5]);
  const out = argv[6];
  const doc = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(path));
  const page = doc.pageAtIndex(0);
  const b = page.boundsForBox($.kPDFDisplayBoxMediaBox);
  const pageH = b.size.height;
  const yBottom = pageH - yTop - h; // convert top-left origin to PDF bottom-left origin

  const pxW = Math.round(w * scale), pxH = Math.round(h * scale);
  const rep = $.NSBitmapImageRep.alloc.initWithBitmapDataPlanesPixelsWidePixelsHighBitsPerSampleSamplesPerPixelHasAlphaIsPlanarColorSpaceNameBytesPerRowBitsPerPixel(
    null, pxW, pxH, 8, 4, true, false, $.NSCalibratedRGBColorSpace, 0, 0);
  const ctx = $.NSGraphicsContext.graphicsContextWithBitmapImageRep(rep);
  $.NSGraphicsContext.saveGraphicsState;
  $.NSGraphicsContext.setCurrentContext(ctx);
  const cg = ctx.CGContext;
  // white background
  $.CGContextSetRGBFillColor(cg, 1, 1, 1, 1);
  $.CGContextFillRect(cg, $.CGRectMake(0, 0, pxW, pxH));
  $.CGContextScaleCTM(cg, scale, scale);
  $.CGContextTranslateCTM(cg, -x, -yBottom);
  page.drawWithBoxToContext($.kPDFDisplayBoxMediaBox, cg);
  ctx.flushGraphics;
  $.NSGraphicsContext.restoreGraphicsState;

  const png = rep.representationUsingTypeProperties($.NSBitmapImageFileTypePNG, $.NSDictionary.dictionary);
  png.writeToFileAtomically(out, true);
  return "wrote " + out + " (" + pxW + "x" + pxH + ")";
}
