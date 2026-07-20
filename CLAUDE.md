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
- `src/app/layout.tsx` - Root layout with Geist font configuration
- `src/app/globals.css` - Global styles using Tailwind v4's `@import "tailwindcss"` syntax + Softhits font
- `src/components/` - Reusable React components
- `public/images/` - Static assets (logo-white.png, bg.jpg, etc.)
- `public/fonts/` - Custom fonts (SOFTHITS.TTF)

**Path alias:** `@/*` maps to `./src/*`

## Custom Font

The project uses **Softhits** font:
- Located at `public/fonts/SOFTHITS.TTF`
- Defined in `src/app/globals.css` via `@font-face`
- Usage: `fontFamily: "'Softhits', sans-serif"`

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
