# Ignitis product system

System definition for the Ignitisx.0 web product. The **shape** follows Wise on web (Mobbin). The **brand** is Ignitis.

Visual tokens live in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md). Build order lives in [PLAN.md](./PLAN.md).

## Product promise

Wise puts a live money calculator on the homepage and a stripped signup after “Get started.” Ignitis does the same for energy: a live **plan estimator** on the homepage, then a short account setup, then a home dashboard for usage, bills, and payments.

| Wise (reference) | Ignitis (this system) |
| --- | --- |
| Send / hold / spend money | Supply / track / pay for energy |
| Personal / Business | Home / Business |
| Currency converter | Plan estimator |
| Recipients, cards, transfers | Properties, bills, payments |
| Mid-market rate, low fee | Green electricity, clear tariff, no surprise add-ons |

## Two product shells

### 1. Marketing shell

Used on public pages. Full header, full footer, max content width 1120–1200px.

```
┌──────────────────────────────────────────────────────────┐
│ LOGO   [Home | Business]     Features  Plans  Help  LT  │
│                                    Log in   [Register]   │
├──────────────────────────────────────────────────────────┤
│ Page body                                                │
├──────────────────────────────────────────────────────────┤
│ Footer columns + legal                                   │
└──────────────────────────────────────────────────────────┘
```

### 2. Onboarding / auth shell

Used on `/login`, `/register`, and `/onboarding/*`. No marketing nav, no footer. Attention stays on one column (~480px).

```
┌──────────────────────────────────────────────────────────┐
│ LOGO              Account type · Location · 2FA · Password│
│                                                         X│
├──────────────────────────────────────────────────────────┤
│ ← Back                                                   │
│                                                          │
│              One heading                                 │
│              One helper line                             │
│              One control                                 │
│              [ Primary CTA ]                             │
│              Fine print / legal                          │
└──────────────────────────────────────────────────────────┘
```

Rules:

- `X` closes to `/` and stores draft signup in session
- `Back` is hidden on the first onboarding step
- Progress labels are not clickable shortcuts (Wise pattern)
- Completed steps stay visible in the stepper; the fill line uses dark green

## Information architecture

```
/                         Marketing home
/business                 Business home (same layout, B2B copy)
/plans                    Tariff and plan comparison
/features                 EnergySmart, EV, solar, bills
/help                     Help centre
/login                    Welcome back
/register                 Create account (email)
/onboarding
  /account-type           Home or Business
  /location               Country + municipality
  /phone                  Send SMS code
  /phone-confirm          6-digit code
  /password               Create password
  /profile                Legal name + date of birth
/app
  /                       Logged-in home
  /usage                  Consumption
  /bills                  Invoices
  /payments               Pay and history
  /properties             Sites and meters
  /insights               EnergySmart
```

Header mapping from [Wise hero navigation](https://mobbin.com/sites/sections/ed4009c4-f3a6-4228-9287-548135488099):

| Slot | Wise | Ignitis |
| --- | --- | --- |
| Brand | Wise mark + word | Ignitis mark + word |
| Segment | Personal / Business pills | Home / Business pills |
| Primary nav | Features, Pricing, Help | Features, Plans, Help |
| Locale | Flag + EN | LT / EN |
| Secondary | Log in | Log in (text) |
| Primary | Register (pill) | Register (pill, brand green) |

## Marketing website

Reference sections: [hero + converter](https://mobbin.com/sites/sections/ed4009c4-f3a6-4228-9287-548135488099), [how it works](https://mobbin.com/sites/sections/96d6e07b-b406-4314-b256-23ca5e0d76bc), [feature split](https://mobbin.com/sites/sections/97ea50f6-d03c-4a4c-88ec-ebd6a72d8da1), [footer](https://mobbin.com/sites/sections/74fdb05c-5413-48fd-827d-ac76653b0047).

### Home page stack (top to bottom)

1. **Header** — marketing shell.
2. **Hero** — two columns.
   - Left: large headline, one supporting sentence, optional play-link, two trust lines (rating, safety).
   - Right: **Plan estimator** card (the Wise converter).
3. **How it works** — centered title, three numbered cards, one pill CTA under the row.
4. **Product split A** — copy left, device mock right (dashboard + app).
5. **Product split B** — lifestyle or card visual left, copy + two buttons right (primary pill, secondary outline).
6. **Trust** — three icon columns (regulated, live support, protection).
7. **FAQ** — accordion, chevron on the right.
8. **Footer** — logo, three to five link columns, social circles, copyright and licences.

### Plan estimator (hero calculator)

This is the homepage’s job. It must work without an account.

**Inputs**

- Home size (small / medium / large / extra large) — same bands as ignitis.lt
- Living pattern (year-round / seasonal)
- Optional: current kWh / month

**Outputs**

- Estimated monthly cost
- Estimated yearly cost
- Suggested plan name
- Green energy share
- Short “should take effect” line (contract start)

**Actions**

- Secondary: Compare plans (`/plans`)
- Primary: Get started (`/register?plan=…&size=…`)

Layout inside the card (Wise fee timeline):

```
Home size          [ Medium ▾ ]
Living             [ Year-round ▾ ]

  ·  Usage estimate     280 kWh
  ·  Energy cost        €42.10
  ·  Network & VAT      €18.40
= Estimated month       €60.50
  Green share           100%

[ Compare plans ]  [ Get started ]
```

Disabled primary button until size + living pattern are set.

### How it works cards

Title pattern: short, bold, sentence case (or a single all-caps marketing display title on green heroes only).

1. Register a free account in minutes
2. Confirm your identity and property
3. Choose a plan and start tracking usage

### Footer columns (Home)

- **About us** — What we do, How we work, Our story
- **Services** — Electricity, Gas, EnergySmart, Ignitis ON
- **Help** — Help centre, Faults, Contact
- **Follow** — circular social icons

Legal strip: privacy, cookies, terms, regulator line.

## Auth

### Login — [Wise login](https://mobbin.com/screens/a3adb2d7-f505-40dc-a6cf-f3adbeee8cdf)

- Title: Welcome back
- Helper: New to Ignitis? **Sign up** (underline)
- Email, password (Show control)
- Primary: Log in
- Trouble logging in? (underline)
- Or log in with: Google, Apple (Facebook optional)
- Log in with a passkey (outline pill)

### Register — [Create your Wise account](https://mobbin.com/screens/fa52fce0-5032-40d6-90ad-7e7ce55d1ef9)

- Title: Create your Ignitis account
- Helper: Already have an account? **Log in**
- Label: First, enter your email address
- Primary: Next
- Or sign up with: Google, Apple
- By registering, you accept Terms of use and Privacy Policy

Email check / new device uses a centered illustration, all-caps or bold title “Check your email”, spinner, Resend (neutral), optional backup verify.

## Onboarding

Reference flows: [Onboarding](https://mobbin.com/flows/bba5b441-1d7e-4a83-a28b-4317e4105108), [Setting up an account](https://mobbin.com/flows/db72a145-5398-4854-ad12-657e6eb2e505), [Verifying a phone number](https://mobbin.com/flows/aeb7b204-aa6a-407b-86fa-43123917e02a), [Creating a password](https://mobbin.com/flows/0fdf109e-e599-4e5c-ac38-0f0864aeb31b).

Stepper labels: **Account type → Location → 2FA → Password**

Profile (name, DOB) sits after Password and is not a stepper tick — same as Wise “Tell us about yourself” after the four named steps.

### Step 1 — Account type

[Account type screen](https://mobbin.com/screens/2f70ce4a-fd49-4c1f-bdd4-fbff03d1e74a)

- Heading: What kind of account would you like to open today?
- Helper: You can add another account later on, too.
- Two equal cards:
  - **Home account** — household electricity and gas
  - **Business account** — company or sole trader supply
- Selecting a card continues immediately (no extra button), or highlight + Continue if we need confirmation
- Fine print: personal/home accounts must not be used for business; link Acceptable Use Policy

### Step 2 — Location

- Heading: Where do you live most of the time?
- Helper: By law, we may need to ask for proof of your address.
- Country select (default Lithuania; also LV, EE, PL, FI)
- Municipality / city select (enabled after country)
- Continue disabled until both are set
- Legal line about the local licensed supplier

### Step 3 — Phone 2FA

[Verify your phone number](https://mobbin.com/screens/44eba616-c209-4bfc-ae1a-1b3f0332c08a)

- Heading: Verify your phone number with a code
- Helper: It helps us keep your account secure. Learn more
- Combined field: country code + number
- Primary: Send verification code (disabled until valid)
- SMS consent fine print
- Terms and Privacy links with external icons

**Confirm screen**

- Heading: Enter the code we sent you
- Six separate digit boxes or one grouped OTP field
- Resend with countdown
- Continue

### Step 4 — Password

- Heading: Create your password
- Field with Show
- Requirement panel (pale green, dark green checks) as soon as the user types:
  - contains a letter
  - contains a number
  - has 9 or more characters
- Continue enabled only when all pass

### Step 5 — Profile

- Heading: Tell us about yourself
- Country of residence (prefilled from step 2)
- Full legal first and middle name(s)
- Full legal last name(s)
- Date of birth: Month ▾ / DD / YYYY
- Save and continue / Confirm

After this: land on `/app` with the estimator prefilled from marketing query params if present.

## Logged-in home

Reference: Wise web home with sidebar, calculator, and promo cards.

```
┌─────────────┬────────────────────────────────────────────┐
│ Ignitis     │                                            │
│ ● Home      │  Plan calculator                           │
│   Usage     │  ┌──────────────┬─────────────────────┐    │
│   Bills     │  │ sparkline    │ size / kWh inputs   │    │
│ ▾ Payments  │  │              │ [ Get this plan ]   │    │
│   Properties│  └──────────────┴─────────────────────┘    │
│   Insights  │  Get rate and outage updates  →            │
│             │                                            │
│             │  Do more with Ignitis                      │
│             │  [EnergySmart] [EV] [Solar]                │
└─────────────┴────────────────────────────────────────────┘
```

- Active nav: light grey pill, not a color fill
- Sidebar icons: 1.5px stroke, 24px
- Promo cards: pale yellow (`#eecf4e` at 18% tint), dismissible, 3D-style icon, title, no paragraph dump
- Profile chip top-right: initials avatar + optional notification dot

## Content and voice

- Headlines are direct and concrete. Marketing heroes may use a heavy display line; product UI uses sentence case.
- One idea per onboarding screen. No extra marketing on those pages.
- Numbers are the hero of the estimator (Wise amount fields).
- Lithuanian first; keep labels short enough that LT strings do not wrap on the 480px column.

## States every flow must include

| State | Behaviour |
| --- | --- |
| Empty | Disabled primary, helper “Enter … to continue” |
| Invalid | Field border `pink.600`, message under field |
| Loading | Spinner on the button, keep label |
| Success | Check in green requirement panels; toast “Email sent” as a dark pill |
| Exit | Confirm only if unsaved profile data exists after password |

## What we do not copy from Wise

- Wordmark, fast-flag mark, “Wise green”
- Currency, cards, Wisetag, recipients
- Stock 3D illustrations (commission Ignitis-energy versions)
- Regulatory copy written for FCA e-money
