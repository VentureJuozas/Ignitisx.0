# Ignitis design system

Visual language for Ignitisx.0. **Layout and component behaviour** follow Wise on web ([Mobbin](https://mobbin.com)). **Color, type, and logo** follow the [Ignitis Green Lithuanian Energy Style Guide](https://ignitis.lt/sites/default/files/inline-files/1-Green%20Lithuanian%20Energy%20Style%20guide%20EN.pdf).

Product structure: [SYSTEM.md](./SYSTEM.md).

## Principle

Wise is loud on marketing (full-bleed brand color, heavy type, pill CTAs) and quiet in product (white canvas, one question, one green button). Ignitis uses the same contrast, with official colors:

- Green is the brand and the primary action fill (Wise lime slot).
- Dark green is ink for logo, headings, and stepper fill (Wise forest slot).
- Blue is links, focus, and secondary fills (Wise sky-blue slot).
- Yellow and dark pink are accents only: highlights, data callouts, errors. They do not replace green as the product CTA.

Green buttons use **dark text**, never white. `#31c67c` on white fails WCAG for white label text.

## Color

### Brand (do not invent)

| Token | Role | HEX | RGB |
| --- | --- | --- | --- |
| `green.500` | Main brand, primary CTA fill, logo figure | `#31c67c` | 50, 199, 124 |
| `blue.500` | Additional primary, links, focus, secondary CTA | `#4057e3` | 64, 87, 227 |
| `white` | Surfaces, inverse text on blue | `#ffffff` | 255, 255, 255 |
| `green.800` | Secondary. Logo/text on light, nav ink | `#006d67` | 0, 109, 103 |
| `grey.700` | Secondary. Body, icons, chrome | `#58595b` | 88, 89, 91 |
| `yellow.400` | Accent. Promo cards, savings, facts | `#eecf4e` | 238, 207, 78 |
| `pink.600` | Accent. Errors, critical facts | `#ba3662` | 186, 54, 98 |

### Derived UI tokens

| Token | HEX | Use |
| --- | --- | --- |
| `text.primary` | `#163330` | Headings, button labels on green |
| `text.secondary` | `#58595b` | Helpers, labels, legal |
| `text.disabled` | `#8B8E90` | Disabled labels |
| `text.on-blue` | `#ffffff` | Labels on `blue.500` |
| `bg.canvas` | `#F4F7F6` | Page behind cards (Wise off-white) |
| `bg.surface` | `#ffffff` | Cards, inputs, sheets |
| `bg.sunken` | `#EEF2F1` | Estimator well, disabled button |
| `bg.success-tint` | `#E6F7EE` | Password checks panel |
| `bg.promo` | `#FBF6E0` | “Do more with Ignitis” cards |
| `bg.hero-brand` | `#31c67c` | Optional full-bleed marketing hero |
| `bg.hero-ink` | `#006d67` | Alternate dark hero (trust, tracking) |
| `border.default` | `#D7DEDC` | Inputs, cards |
| `border.strong` | `#163330` | Secondary outline buttons |
| `overlay.nav-active` | `#EEF2F1` | Sidebar active pill |
| `focus.ring` | `#4057e3` | Keyboard focus |

### Mapping from Wise

| Wise | Ignitis token |
| --- | --- |
| Lime CTA / hero `#9FE870` | `green.500` |
| Forest logo / type `#163300` | `green.800` + `text.primary` |
| Navy marketing hero | `green.800` or `blue.500` (prefer dark green) |
| Sky link / secondary button | `blue.500` |
| Pale yellow promo tiles | `bg.promo` / `yellow.400` |
| Grey borders and disabled | `border.default` / `bg.sunken` |
| Error | `pink.600` |

### Combinations

Allowed:

- Green fill + `text.primary`
- Blue fill + white
- Dark green fill + white (header on dark heroes, mono logo on dark)
- White fill + `border.strong` + `text.primary` (secondary)
- Yellow fill + `text.primary` (highlight chip, not primary nav CTA)
- Pink text or border for errors; pink fill only for destructive confirm

Not allowed:

- White text on `green.500`
- Pink or yellow as the default Register / Continue / Get started
- Green dominating less than the style guide allows — green stays the most used chromatic color
- Drop shadows as a brand device; use border and whitespace

## Typography

### Families

| Role | Face | When |
| --- | --- | --- |
| Brand headings | **Basetika Medium** | H1–H3, button labels, stepper current step |
| Brand body | **Basetika Light** | Paragraphs, helpers, legal |
| Product fallback | **Inter** (400/500/600/700) | If Basetika is not licensed for web |
| Official fallback | **Arial** | Email, docs, no-webfont environments |

Do not use serif, or a second display face. Wise’s extra-black all-caps heroes are emulated with Basetika Medium / Inter 700, tighter tracking, and size — not a new font.

### Scale (desktop)

| Style | Size | Line | Weight | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| Display | 56 / 64px | 1.05 | Medium/700 | −0.03em | Marketing hero. Sentence case preferred; all-caps only on green full-bleed heroes |
| Title | 32px | 1.2 | Medium/700 | −0.02em | Onboarding H1, section titles |
| Title sm | 24px | 1.25 | Medium/600 | −0.01em | Card titles, dashboard H1 |
| Body lg | 18px | 1.5 | Light/400 | 0 | Hero subcopy |
| Body | 16px | 1.5 | Light/400 | 0 | UI body |
| Label | 14px | 1.4 | Medium/600 | 0 | Field labels, nav |
| Caption | 13px | 1.45 | Light/400 | 0 | Helpers, fees |
| Legal | 12px | 1.5 | Light/400 | 0 | SMS consent, licences |

Onboarding H1 is centered, `text.primary`, no all-caps. Marketing display may be all-caps on `bg.hero-brand`.

## Logo

- Full color: green figure + Ignitis word (dark green on light, white word + green figure on dark).
- Mono blue on light when color cannot be reproduced; mono white on dark.
- Clear space: at least the height of the figure on all sides.
- Header logo ~28–32px tall. Do not rebuild as a flag-in-a-square (that is Wise).

## Layout

### Grid

- 8px base. Preferred spacing: 8, 16, 24, 32, 48, 64, 96.
- Marketing content max-width: 1120px, page padding 24 / 48.
- Onboarding column: 480px, centered, page padding 16.
- Sidebar: 256px fixed.
- Section padding: 80–120px vertical on marketing.

### Radius

| Token | Value | Use |
| --- | --- | --- |
| `radius.sm` | 8px | Inputs, small chips |
| `radius.md` | 12px | Estimator card, dashboard cards |
| `radius.lg` | 16px | Selection cards, promo tiles |
| `radius.pill` | 999px | Buttons, Home/Business toggle, toasts |
| `radius.full` | 50% | Avatars, social, play control |

Wise inputs are slightly rounded; buttons are pills. Keep that split.

### Elevation

Default: **flat**. Cards on `bg.canvas` are white with no shadow, or a 1px `border.default`. Device mockups on marketing may use a single soft shadow `0 16px 40px rgba(0, 109, 103, 0.08)`.

## Iconography

- 24px default, 1.5px stroke, round caps, `text.primary` / `grey.700`.
- No filled brand icons in nav. Active state is the grey pill, not a color icon.
- External links: small northeast arrow after the label.
- Social: filled circles, `green.800` on light footers, `blue.500` on dark navy-style footers.

Illustrations: 3D, high saturation, one object per onboarding choice (home, briefcase) — in Ignitis green/blue/yellow, not Wise lime/pink marble.

## Components

### Buttons

| Variant | Fill | Text | Border | Use |
| --- | --- | --- | --- | --- |
| Primary | `green.500` | `text.primary` | none | Get started, Continue, Register, Log in, Send |
| Secondary | transparent | `text.primary` | 1px `border.strong` | Learn more, Compare, ghost on white |
| Secondary on dark | transparent | white | 1px white | Register on dark hero |
| Blue | `blue.500` | white | none | Alternate marketing action (Compare price) |
| Quiet | `bg.sunken` | `text.secondary` | none | Disabled, Resend at rest |
| Destructive | white | `pink.600` | 1px `pink.600` | Close account |

Specs:

- Height 48px (40px compact in header)
- Horizontal padding 24px; full width of the 480px column in auth
- Label: Medium/600, 16px
- Hover: 6% darker fill (green → mix with `green.800`)
- Active: 10% darker
- Disabled: `bg.sunken`, `text.disabled`, no pointer
- Focus: 2px `focus.ring` offset 2px
- Loading: spinner in `text.primary`, keep width

Never use a rectangular 4px-radius primary on product screens. Older Wise navy-era rectangles are not the target; current Wise pills are.

### Home / Business toggle

Pill track, no fill. Active item: `green.500` fill + `text.primary` (on light headers) or `green.800` fill + white (on green heroes). Inactive: transparent, `text.primary`.

### Text fields

- Label 14px Medium above the field, `text.primary`
- Control height 48px, `radius.sm`, 1px `border.default`, white fill, 16px padding
- Placeholder `text.disabled`
- Focus: 2px `green.800` or `blue.500` border
- Error: border `pink.600`, caption `pink.600`
- Password: inline Show / Hide, no icon-only control
- Phone: split country code (fixed ~96px) + number; shared border so they read as one field
- Date: Month select + DD + YYYY in one row, 8px gap

### Select / dropdown

Same chrome as text fields. Left slot may hold a flag or country mark. Chevron 16px `grey.700`. Open list: white surface, 8px radius, selected row `green.800` fill + white (Wise navy selected row → dark green).

### Stepper

- Four labels under a 2px track
- Done + current track: `green.800`
- Rest track: `border.default`
- Current label: Medium, `text.primary`
- Other labels: Light, `text.secondary`
- Not a clickable nav

### Selection cards (account type)

- Equal columns, `radius.lg`, 24px padding, 1px `border.default`
- Hover: border `green.800`
- Selected: 2px `green.500`, `bg.success-tint`
- Illustration 80–96px, title 18px Medium, body 14px secondary
- Keyboard: arrow keys between cards

### Plan estimator card

- Container `radius.md`, padding 24, on dark hero: white card; on light: `bg.sunken` or white + border
- Amount / cost figures: 32–40px Medium
- Timeline between fields: 2px vertical rule `blue.500` at 40% opacity, minus/equals glyphs
- Primary + secondary buttons in a row on desktop, stacked on mobile
- Sparkline (logged-in): stroke `green.800`

### Promo cards

- `bg.promo`, `radius.lg`, dismiss X 16px
- Title only + illustration. No long body.

### Accordion (FAQ)

- 56px row, bottom border `border.default`
- Question 16px Medium
- Chevron `blue.500`
- Open: body 16px, 16px padding below

### Toast

- Dark pill, `green.800` or `#163330`, white 14px, 8px 16px padding, bottom-center of the onboarding column (“Email sent”)

### Sidebar (app)

- White or `bg.canvas`
- Logo top
- Items: 40px row, 8px 12px padding, icon + label
- Active: `overlay.nav-active` pill
- Nested: 16px indent, no extra icon color

### Header (marketing)

- Height 72px, transparent on brand hero, white + hairline on inner pages
- Log in: text button
- Register: primary pill compact

### Header (onboarding)

- Height 64px, white, hairline `border.default`
- Logo left, stepper center, X right (24px hit target)

### Footer

- Light: `bg.canvas`, `text.primary` links
- Optional Instagram band above: `green.800`, outline Follow pill
- Column headers Medium 14px, links 14px Light
- Legal centered, 12px
- Dark variant allowed for news/trust pages: `green.800` background, white links, primary Register pill in green

## Motion

- 150ms ease-out for hover/color
- 200ms for accordions and dropdowns
- No bounce. Onboarding screens fade/slide 8px, 200ms
- Respect `prefers-reduced-motion`

## Imagery

- Lifestyle: natural light, Baltic / everyday energy (home, EV, city), not stock “smiling with a card”
- Product: real UI in device frames, dark-green sidebar, green CTA
- Photography may full-bleed under a white headline only with a 40% `green.800` scrim

## Accessibility

- Contrast: `text.primary` on green, white on blue, `pink.600` on white for errors
- Focus visible on every control
- Stepper is `nav` with `aria-current="step"`
- OTP fields: `autocomplete="one-time-code"`
- Language switcher announces current locale
- Minimum tap 40px; onboarding CTA 48px

## CSS tokens (implementation)

```css
:root {
  --ignitis-green: #31c67c;
  --ignitis-blue: #4057e3;
  --ignitis-white: #ffffff;
  --ignitis-green-dark: #006d67;
  --ignitis-grey: #58595b;
  --ignitis-yellow: #eecf4e;
  --ignitis-pink: #ba3662;

  --text-primary: #163330;
  --text-secondary: #58595b;
  --bg-canvas: #f4f7f6;
  --bg-surface: #ffffff;
  --bg-sunken: #eef2f1;
  --bg-success-tint: #e6f7ee;
  --bg-promo: #fbf6e0;
  --border: #d7dedc;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;
  --space: 8px;
  --font: "Basetika", "Inter", Arial, sans-serif;
  --shadow-mock: 0 16px 40px rgba(0, 109, 103, 0.08);
}
```

## Screen checklist (design QA)

Match these Wise references, with Ignitis tokens:

| Screen | Reference | Must look like |
| --- | --- | --- |
| Home hero | [section](https://mobbin.com/sites/sections/ed4009c4-f3a6-4228-9287-548135488099) | Split hero, estimator card, two CTAs |
| How it works | [section](https://mobbin.com/sites/sections/96d6e07b-b406-4314-b256-23ca5e0d76bc) | 3 numbered cards, one pill under |
| Footer | [section](https://mobbin.com/sites/sections/74fdb05c-5413-48fd-827d-ac76653b0047) | Columns, legal, optional social band |
| Login | [screen](https://mobbin.com/screens/a3adb2d7-f505-40dc-a6cf-f3adbeee8cdf) | Centered, social row, green pill |
| Register | [screen](https://mobbin.com/screens/fa52fce0-5032-40d6-90ad-7e7ce55d1ef9) | Email, Next, social, terms |
| Account type | [screen](https://mobbin.com/screens/2f70ce4a-fd49-4c1f-bdd4-fbff03d1e74a) | Two illustrated choice cards |
| Location | [flow](https://mobbin.com/flows/db72a145-5398-4854-ad12-657e6eb2e505) | One heading, two selects, disabled Continue |
| 2FA | [screen](https://mobbin.com/screens/44eba616-c209-4bfc-ae1a-1b3f0332c08a) | Phone split field, consent |
| Password | [flow](https://mobbin.com/flows/0fdf109e-e599-4e5c-ac38-0f0864aeb31b) | Show + live green checklist |
