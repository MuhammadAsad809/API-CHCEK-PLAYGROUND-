# Prism — AI API Playground

A premium, single-page AI API playground built with **HTML, Tailwind CDN, custom CSS, and vanilla JavaScript**. It runs fully in the browser and requires no backend.

## Features

- Liquid-glass, responsive dark UI with animated ambient gradients, frosted panels, glows, and motion.
- Provider presets for OpenAI, Grok, Claude, Gemini, OpenRouter, Together AI, Fireworks AI, Groq, DeepSeek, Mistral, plus custom OpenAI-compatible endpoints.
- Common model dropdowns that update with the selected provider.
- Browser-side API requests with provider-specific payload handling for Gemini and Claude.
- Prompt character count, send spinner, stop request, timing, readable errors, and keyboard shortcut (`⌘/Ctrl + Enter`).
- Conversation history in localStorage with replay and clear controls.
- GitHub Pages deployment through `.github/workflows/pages.yml`.

## Run locally

Open `index.html` directly, or serve the folder with any static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Important browser note

The app sends the key directly from the browser to the selected provider. It does not persist API keys or transmit them to a Prism server. Some providers may block direct browser requests with CORS; in that case, use a provider/endpoint that permits browser origins or a compatible gateway. Do not use this public demo with a key you cannot safely rotate.
