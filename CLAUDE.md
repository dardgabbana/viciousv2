# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 project using the App Router with TypeScript and Tailwind CSS v4.

**Key structure:**
- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with JetBrains Mono font configuration
- `src/app/globals.css` - Global styles using Tailwind v4's `@import "tailwindcss"` syntax
- `src/components/` - Reusable React components
- `public/images/` - Static assets (logo-white.png, logo-black.png, slider/, etc.)

**Path alias:** `@/*` maps to `./src/*`

## Font

The project uses **JetBrains Mono** (via `next/font/google`) for everything:
- Loaded in `src/app/layout.tsx` as the `--font-jetbrains-mono` CSS variable
- Applied globally on `body` in `src/app/globals.css`
- No local `@font-face` / `public/fonts/` assets remain

## Page Layout

The main page (`src/app/page.tsx`) features a NieR Replicant-inspired menu:
- Black background
- Logo centered at top
- Simple text menu items centered below (Shop, Blog, Games)
- Shop has expandable submenu (Collections, Singles)
- Selected item appears white, others are gray
- Keyboard navigation with arrow keys (up/down)
- Enter/Space to toggle submenus
- Copyright footer at bottom

## Design References

HTML mockups in `public/` folder:
- `pants_button.html` - Metallic button style reference
- `vicious_frame.html` - TV frame style reference
- `metallic-button.html` - Alternative button style reference
