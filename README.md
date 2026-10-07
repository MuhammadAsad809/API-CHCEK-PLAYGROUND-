# DOMAIN CLASH — Gojo vs Sukuna

A cinematic, interactive scroll-driven domain collision and frame animation experience between Gojo Satoru and Ryomen Sukuna. Built with HTML5 Canvas, procedural Web Audio synthesis, and zero external dependencies.

## Features

- **Sub-Pixel Canvas Animation**: Smooth lerp interpolation with velocity-aware chromatic aberration and camera depth zoom.
- **Procedural Jujutsu VFX**:
  - **Sukuna's Slashes**: Dynamic Dismantle & Cleave slicing cuts across the viewport with particle sparks.
  - **Gojo's Infinity**: Ethereal cyan particle vortices and gravitational space lensing.
  - **Domain Clash Climax**: Radial supernova distortion waves and energy clashing between red and blue.
- **Cinematic Auto-Play**: Watch the domain collision hands-free with selectable playback speeds (0.5× cinematic slow-mo, 1.0× battle standard, 2.0× hyper blitz).
- **Interactive Scrubber**: Drag or click anywhere on the timeline scrubber with live phase preview tooltip.
- **Live Cursed Telemetry**:
  - Dynamic Cursed Energy Output gauge (120% to 500% Black Flash with neon surge).
  - Domain Tug-of-War Balance meter tracking Limitless Void vs Malevolent Shrine dominance.
- **Synthesized Jujutsu Audio Engine**: Multi-track procedural audio (sub-bass cosmic drone, velocity surge, and razor-sharp slicing noise) built entirely using the Web Audio API.
- **Keyboard Shortcuts**:
  - `[SPACE]` Toggle Auto-Play
  - `[↑ / ↓]` or `[← / →]` Step frame by frame
  - `[M]` Toggle synthesized audio

## Deployment to GitHub Pages

This app is 100% static, client-side, and directly compatible with GitHub Pages:

1. **Automated Deployment**: The repository contains `.github/workflows/pages.yml` which automatically deploys the repository root to GitHub Pages upon pushing changes to the `main` branch.
2. **Custom Domain**: The included `CNAME` file preserves your custom domain (`rzxly.cyou`).
3. **Local Development**:
   ```bash
   npm run dev
   # or
   npx serve .
   ```
   Open `http://localhost:3000/`.
