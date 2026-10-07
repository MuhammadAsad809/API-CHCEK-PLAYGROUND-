# Domain Clash — Gojo vs Sukuna

A cinematic, browser-based scroll animation built from the uploaded frame sequence. The main GitHub Pages homepage is a sticky HTML5 Canvas scene: scroll position drives a smooth interpolated transition through 12 local JPG frames.

## Architecture

This is a static website with zero backend and zero database. All animation assets are stored in `assets/scroll-frames/`, preloaded by `script.js`, and rendered locally in the user’s browser. The optional ambience uses the Web Audio API and never loads an audio file or makes a network request.

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Deployment

The repository root is deployable directly on GitHub Pages or Cloudflare Pages. The existing `.github/workflows/pages.yml` workflow publishes the repository root. `CNAME` keeps the configured custom domain.

## Controls

Scroll through the tall scene to control the frame sequence. The Replay button returns to the hero section. The sound button toggles a subtle locally generated ambient tone using the Web Audio API.
