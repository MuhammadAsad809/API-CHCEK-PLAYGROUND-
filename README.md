# PDFly — Private browser PDF editor

PDFly is a static, browser-based PDF editor. It uses **pdf.js** to render PDFs and **pdf-lib** to create the edited output. Files are read from local device memory and are never uploaded to an application server.

## Included

- Drag-and-drop or file-picker PDF import
- Local PDF rendering with page thumbnails
- Add text with font, size, color, alignment, bold, and italic options
- Freehand drawing and area highlighting
- Rectangles, circles, lines, and arrows
- Add local images
- Signatures by drawing, typing, or uploading an image
- Delete, duplicate, rotate, add blank pages, and drag-reorder pages
- Select pages and extract them into a new PDF
- Merge multiple PDFs locally
- Undo/redo for page and annotation edits
- Zoom controls, page navigation, file size, and page count
- Download/export edited PDFs locally
- Dark/light theme
- No authentication, backend, database, or upload API

## Run locally

Because PDFly uses ES modules, serve the folder over a local static server rather than opening `index.html` directly:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deployment

The project is compatible with GitHub Pages and Cloudflare Pages. Deploy the repository root as a static site. The `.github/workflows/pages.yml` workflow publishes the root directory to GitHub Pages.

The runtime libraries are vendored in `vendor/`:

- `vendor/pdf.min.mjs` and `vendor/pdf.worker.min.mjs` — pdf.js
- `vendor/pdf-lib.min.js` — pdf-lib

## Privacy

PDF bytes remain in browser memory. Export creates a local Blob download. No fetch request is made for user PDFs. API errors are shown locally and large files are processed with browser workers where supported by pdf.js.

## Browser support

Use a current Chromium, Firefox, Safari, or Edge release with ES module, File API, Canvas, and Web Worker support. Very large or encrypted PDFs may be rejected by the underlying PDF libraries.
