# FormCraft

**Open-source form builder.** A self-hostable Typeform alternative with a visual editor, 10 field types, and a submission viewer.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[**Live Demo →**](https://formcraft.spencerstiles.com)

> Portfolio/reference implementation demonstrating complex form state management and validation in Next.js 14.

## Quick Start

```bash
git clone https://github.com/SpencerStiles/formcraft
cd formcraft
pnpm install && pnpm prisma generate && pnpm prisma migrate dev
cp .env.example .env.local
pnpm dev
```

## Features

- Visual drag-and-drop form editor
- 10 field types: text, email, number, dropdown, radio, checkbox, date, URL, phone, textarea
- Publish / draft toggle with public share link
- Submission viewer with tabular response display
- Client + server-side validation (Zod)

## Tech Stack

Next.js 14 · TypeScript · Prisma · SQLite · Tailwind CSS · Zod

## License

MIT
