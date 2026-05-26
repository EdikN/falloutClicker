---
name: Urban Survivor
colors:
  surface: '#0d1515'
  surface-dim: '#0d1515'
  surface-bright: '#333b3b'
  surface-container-lowest: '#081010'
  surface-container-low: '#151d1e'
  surface-container: '#192122'
  surface-container-high: '#232b2c'
  surface-container-highest: '#2e3637'
  on-surface: '#dce4e4'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dce4e4'
  inverse-on-surface: '#2a3232'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dce6'
  primary: '#e3fdff'
  on-primary: '#00373a'
  primary-container: '#00f3ff'
  on-primary-container: '#006b71'
  inverse-primary: '#00696f'
  secondary: '#dcb8ff'
  on-secondary: '#480081'
  secondary-container: '#7701d0'
  on-secondary-container: '#dcb7ff'
  tertiary: '#fff7e9'
  on-tertiary: '#3b2f00'
  tertiary-container: '#ffd93d'
  on-tertiary-container: '#725e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ff6ff'
  primary-fixed-dim: '#00dce6'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dcb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6700b5'
  tertiary-fixed: '#ffe173'
  tertiary-fixed-dim: '#e8c426'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#554500'
  background: '#0d1515'
  on-background: '#dce4e4'
  surface-variant: '#2e3637'
typography:
  display-lg:
    fontFamily: Space Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.1em
  headline-lg:
    fontFamily: Space Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  headline-md:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  headline-sm:
    fontFamily: Space Mono
    fontSize: 18px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.12em
  label-sm:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.12em
  headline-lg-mobile:
    fontFamily: Space Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.08em
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is a high-fidelity, futuristic interface designed for high-stakes digital environments. It adopts a **Cyberpunk** aesthetic, blending high-tech utility with gritty, low-life underground energy. The target audience includes tech-native enthusiasts, gamers, and developers who value a cinematic, immersive experience.

The visual style is characterized by:
- **Glassmorphism & Depth:** Heavy backdrop blurs create layers of data floating over a dark, chaotic world.
- **Neon Utility:** High-intensity primary colors serve as functional light sources, casting glows on dark surfaces.
- **Digital Texture:** Subtle overlays of CRT grain and scanlines provide a "hardware-native" feel.
- **Aggressive Geometry:** Angular clips and sharp edges evoke speed and precision.

## Colors
The palette is built on a "Darkness vs. Light" philosophy. The base is an impenetrable **Deep Graphite**, allowing the vibrant neon signals to punch through with maximum contrast.

- **Primary (Cyber Cyan):** Used for interactive states, key data readouts, and primary actions. It must always be accompanied by a 10px outer glow.
- **Secondary (Cyber Violet):** Used for supporting elements, secondary buttons, and decorative accents.
- **Accent (Hot Pink):** Reserved strictly for destructive actions, high-priority alerts, or critical system failures.
- **Neutrals:** The background uses a specific near-black to prevent total flatness, while text uses off-white to reduce eye strain against the neon elements.

## Typography
The typography strategy contrasts the mechanical, fixed-width nature of **Space Mono** (substituted for technical UI labels and headers) with the organic, modern readability of **Outfit**.

- **Headers & UI Labels:** Always uppercase with expanded letter spacing to mimic tactical military displays.
- **Body Content:** Uses Outfit to maintain high legibility amidst the visual noise of the cyberpunk style.
- **Special Treatment:** For critical headers, apply a 0.5px horizontal glitch offset or a faint cyan drop shadow.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high density. Content is organized into modular "blades" or "cells" that stack vertically on mobile and span a 12-column grid on desktop.

- **Grid:** 12 columns (desktop), 4 columns (mobile).
- **Rhythm:** An 8px base unit ensures mathematical alignment of all UI elements.
- **Safe Areas:** Large margins (48px+) are used at the edges of the viewport to simulate a widescreen cinematic experience.
- **Scanline Overlay:** A fixed-position overlay with `pointer-events: none` should apply a repeating 2px linear gradient across the entire layout to unify the components.

## Elevation & Depth
Depth is not achieved through traditional drop shadows, but through **Tonal Stacking** and **Optical Glows**.

- **Level 0 (Background):** Solid #05020a.
- **Level 1 (Panels):** `rgba(10, 10, 15, 0.85)` with a `backdrop-filter: blur(25px)`. These panels have a 1px border of `rgba(0, 243, 255, 0.16)`.
- **Level 2 (Active Elements):** Elements "emulate" light. Instead of a shadow, use `box-shadow: 0 0 15px rgba(0, 243, 255, 0.4)` to make primary buttons appear as if they are glowing neon tubes.
- **Interstitials:** Use thin, 1px lines (Cyber Cyan at 10% opacity) to separate sections rather than heavy blocks.

## Shapes
The shape language is strictly **Sharp and Angular**. 

- **Corner Treatment:** All standard components have 0px radius.
- **Polygon Clipping:** For buttons and primary containers, use `clip-path` to cut off corners at 45-degree angles (dog-eared corners). This creates a custom "machined" look.
- **Dividers:** Use "notched" lines where a horizontal line ends in a small 4px vertical tick.

## Components
- **Buttons:** Sharp, polygon-clipped shapes. Primary buttons feature a solid Cyber Cyan background with black text and a strong outer glow. Secondary buttons use a transparent background with a Cyber Violet border.
- **Input Fields:** Dark, semi-transparent backgrounds with a bottom-only border. On focus, the border animates to full width with a Cyber Cyan glow.
- **Chips/Tags:** Small, rectangular blocks with monospaced text. Use secondary colors (Violet) to distinguish from primary actions.
- **Cards/Panels:** These are the primary "glass" containers. They should feature a small "ID" or "Serial Number" in the top-right corner in `label-sm` typography to enhance the industrial aesthetic.
- **Data Visualizations:** Use primary and secondary neons. Avoid soft transitions; use stepped increments or pixelated bars.
- **Hover States:** All interactive elements should trigger a "flicker" effect or a rapid color-shift on hover to simulate high-voltage hardware.