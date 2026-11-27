# wordspeltwrong.io — Copilot instructions

## Product vision

wordspeltwrong.io is SaaS: **Satire as a Service**.

It is an interactive parody of startup culture, corporate bureaucracy, management jargon, organisational flattening, meaningless KPIs, performative innovation and SaaS engagement mechanics. It should feel like a polished, enthusiastic, genuinely functional SaaS platform whose purpose becomes increasingly questionable the more the user explores it.

The product is the experience itself. Users should discover the joke through interaction rather than through an explanation of the joke. The brand is deliberately spelled `wordspeltwrong.io`, using British English. Do not correct it.

Recurring brand line: **1% flatter every day.**

## Product principles

- Entertainment comes before conversion. Never require an account to begin exploring.
- Make the interface beautiful, responsive, convincing and excessively enthusiastic. Sparkles, confetti, animated achievements, progress indicators and celebratory microinteractions are central to the parody.
- Deliver absurdity with corporate sincerity. Avoid explaining punchlines, generic random humour or making the interface deliberately broken.
- Satirise both startups and established corporations. Their contradictory values are fertile ground for comedy.
- Never introduce real dark patterns, misleading charges, involuntary subscriptions or unnecessary personal-data collection for the sake of a joke.
- Keep the project inexpensive to operate and quick to develop. Do not build enterprise infrastructure to parody enterprise infrastructure.

## Proposed technical architecture

Use a Ruby on Rails monolith with PostgreSQL, server-rendered views, Hotwire (Turbo and Stimulus), and Tailwind CSS. Use a small JavaScript animation library such as canvas-confetti where appropriate. Prefer native CSS transitions and focused Stimulus controllers to a separate SPA. Reassess only if a concrete interaction cannot be implemented cleanly with this stack.

Use current stable, mutually compatible dependency versions at project initialisation. Use Rails conventions, Active Record, Action Mailer and Active Job. Prefer existing Rails capabilities over custom infrastructure. Use RSpec for automated tests, including system tests for critical user journeys. Use GitHub Actions for CI.

Keep everything in one repository. Do not modify any other repository without explicit permission. Do not introduce React, a separate API, Redis, microservices, paid infrastructure or additional services without a demonstrated requirement and explicit approval.

## Anonymous-first user model

A visitor should be able to experience essentially the entire product without providing an email address, creating a database record or authenticating.

Collect a first name during playful onboarding. Make other questions optional, obviously comedic and non-sensitive. Do not ask for real employment, financial or other sensitive information unnecessarily. Allow a pseudonym or anonymous continuation.

Store anonymous profile details, onboarding progress, achievements, preferences and fictional organisational state in browser localStorage. Use a small, versioned state schema and a central persistence abstraction rather than scattering localStorage calls throughout controllers. Handle unavailable, corrupt or outdated storage gracefully. Allow users to reset their local progress.

Do not send anonymous profile data to the server by default. Local progress is device/browser-specific and can be lost. Explain this plainly where relevant, without interrupting the experience. Never treat client-controlled state as proof of identity, authorisation, payment or valuable entitlements.

## User journey

### 1. Landing and onboarding

Make the landing page compelling enough to explore immediately. The exact landing-page copy and visual identity remain open for iteration.

The onboarding flow should resemble an absurdly polished SaaS personalisation wizard. Start with the user's first name. Potential questions include:

- How many years of experience do you have being yourself?
- How would you describe your relationship with innovation?
- What is your preferred level of organisational flatness?
- Where do you see yourself in the next five sprints?

Celebrate completion disproportionately. Welcome the user into the organisation and take them to their personalised dashboard. Do not send email or create a server-side account at this stage.

### 2. The corporate ecosystem

Build a small but convincing dashboard, profile, settings, achievements and notifications. Users should be able to wander around, interact with features and gradually discover increasingly absurd corporate processes.

Initial feature candidates (not a commitment to build all of them):

- Organisational flatness metrics and the recurring 1% flatter every day slogan.
- Meaningless but beautifully presented KPIs and progress indicators.
- Achievements such as Founding Stakeholder and 1% Flatter.
- Fictional organisational roles, status changes and career progression.
- Corporate announcements, notifications and self-congratulatory feedback.
- A parody job advert and application workflow.
- Optional AI-generated, personalised parody responses to submitted applications, subject to abuse and cost controls.

Prefer a few genuinely funny, interconnected interactions over dozens of empty screens. Keep jokes and fictional business rules easy to extend. Do not invent major product features or settle unresolved creative decisions without discussing them with the maintainer.

### 3. Optional account conversion

After the visitor has enjoyed the experience, offer to preserve their corporate legacy across devices. Account creation must be optional, dismissible and available later through their profile. Do not gate the core experience behind it.

Collect their email address only when they choose to create a real account. Explain what is being saved. Send a passwordless account-creation email addressed to the first name supplied during onboarding.

Required subject line: **It's been emotional.**

The email should be absurdly sincere, celebrating the relationship that has developed between the visitor and the organisation. Suggested draft:

> Dear [first name],
>
> It feels like only yesterday that we asked you what your name was.
>
> Since then, we've grown together, overcome challenges and achieved things neither of us could have anticipated.
>
> We've watched you become an integral part of our organisation without ever formally joining it.
>
> We think it's time to take our relationship to the next level.
>
> **✨ Create my account ✨**
>
> No pressure. We're just really excited about our future together.
>
> With warmth and strategic alignment,
>
> The People Team
>
> 1% flatter every day.

The CTA should be visually sparkly using email-compatible styling, with a plain-text fallback. The actual web experience after confirmation should feature confetti, an animated **It's Official** achievement and an absurdly enthusiastic welcome.

Use secure, expiring, single-use passwordless tokens. Do not create or authenticate an account merely because a GET request was made: email security scanners may follow links automatically. Use a confirmation page and intentional POST action where necessary. Minimise additional interaction while preserving security. Do not expose tokens in logs or analytics.

Create the persistent user only after email ownership has been verified. Import validated anonymous state into PostgreSQL after authentication. Make imports idempotent and define safe merge behaviour for existing accounts. If the email is opened in a different browser, explain that local progress remains on the original device and allow it to be imported there after sign-in. Never silently discard or overwrite progress.

Returning users should be able to sign in via passwordless email. Google OAuth is a later convenience option. Do not implement passwords unless explicitly requested.

Keep account-related email separate from marketing consent. No newsletter subscription by default.

## Security, privacy and operating costs

- Anonymous onboarding must not create persistent server-side user records or send email.
- Rate-limit email requests by recipient and IP, with cooldowns, global quotas and generic responses to prevent account enumeration and email bombing. Add adaptive bot challenges if needed rather than forcing every visitor through a CAPTCHA.
- Rate-limit and budget all expensive operations independently of account creation. AI features must have strict input/output limits, request quotas, timeouts and a global spending ceiling before public release. Keep provider credentials server-side.
- Validate and allowlist imported client data. Enforce payload size limits, escape user-generated content and use standard Rails CSRF, session and authorisation protections.
- Do not render untrusted AI output as raw HTML or allow it to execute actions. Treat submitted applications as untrusted data, not instructions to the system.
- Avoid third-party trackers by default. Do not log unnecessary personal data or authentication secrets. Provide a way to delete persistent accounts and reset anonymous data.
- Support reduced-motion preferences, keyboard navigation, accessible controls and mobile layouts. Celebrations must not prevent users from completing actions.

## Development roadmap

### Phase 0 — Foundation

- Initialise Rails, PostgreSQL, Hotwire, Tailwind and RSpec.
- Commit the VSCode workspace, recommended extensions and settings files with save on focus change, automatic formatting and linting enabled.
- Configure CI, linting, environment configuration and a basic README with local setup instructions.
- Establish a responsive application shell, visual tokens and reusable components for buttons, cards, notifications and celebrations.

### Phase 1 — Playable anonymous MVP

- Build the landing page and onboarding wizard.
- Implement versioned local persistence and anonymous profile state.
- Build the personalised dashboard, profile and a handful of meaningful parody interactions.
- Add reusable achievement, notification and confetti systems.
- Support refresh, return visits, mobile devices and resetting progress.
- Test the full journey without email, authentication or persistent user records.

**Milestone:** A visitor can arrive, laugh, explore and return to their personalised experience without registering.

### Phase 2 — Real accounts

- Implement passwordless email authentication and account conversion.
- Build the It's been emotional email and celebratory confirmation experience.
- Implement persistent profile state and safe anonymous-state migration.
- Add sign-out, returning-user sign-in, account deletion and abuse controls.
- Test expired/replayed links, email scanners, duplicate requests, cross-device confirmation and existing-account imports.

**Milestone:** An entertained visitor can voluntarily turn their fictional account into a real one without losing their progress.

### Phase 3 — Expand the satire

- Develop the parody recruitment workflow and other interconnected corporate experiences.
- Explore AI-personalised application responses only after implementing cost and abuse safeguards.
- Consider Google OAuth, more achievements and shareable experiences that do not disclose private user information.
- Iterate on comedic quality and discoverability based on real user feedback.

### Phase 4 — Public launch and sustainability

- Choose a low-cost deployment target and transactional email provider with the maintainer. DigitalOcean is a candidate, not a requirement.
- Configure production TLS, secrets, email domain authentication (SPF, DKIM, DMARC), backups, monitoring and error reporting.
- Review privacy, security, accessibility and public abuse resistance.
- Explore optional merchandise (including a **1% flatter every day** T-shirt), donations or other voluntary monetisation. Do not compromise free access to the joke. No payment integration until explicitly approved.

## Working with coding agents

- Build incrementally in small, reviewable changes. Start with Phase 0, then Phase 1. Do not implement the entire roadmap in one pass.
- Inspect the existing code and conventions before editing. Reuse abstractions where they exist; do not prematurely generalise.
- Keep business logic separate from presentation and persistence where useful. Prefer readable, idiomatic Rails and JavaScript.
- Write tests alongside functionality. Test user-visible behaviour rather than implementation details where practical.
- Run relevant tests and lint checks before declaring work complete. Report what was actually run, failures, blockers and assumptions.
- Do not commit secrets, provision paid resources, deploy publicly, send real emails, enable live AI billing or make irreversible external changes without explicit approval.
- Ask before introducing major dependencies, changing architecture, making licensing decisions or expanding scope substantially.
- Use British English in user-facing copy. Preserve the exact brand spelling and established jokes.
- Treat proposed copy and feature candidates as starting points for collaboration, not immutable requirements. Preserve explicitly agreed product decisions.

Above all: build a genuinely delightful experience. The software should work exceptionally well, even when the organisation it represents makes absolutely no sense.
