# twilight.horse
Source code for my personal website: [https://twilight.horse]

A personal portfolio and project showcase built with Astro. The site contains my software projects, technical writing, and experiments involving web development, LLM systems, and other areas of computer science.

## Tech stack
- [Astro](https://astro.build) - static site generation and layouts
- TypeScript - application logic
- Tailwind CSS - styling
- Vite - development/build tooling

## Development
### Requirements
- Node.js 20+
- npm

### Install dependencies
```bash
npm install
```

### Run locally
```bash
npm run dev
```

The site will be available at [http://localhost:4321]

### Build for production
```bash
npm run build
```
The generated site will be placed in `dist/`

## Structure
```
src/
|-  components/         # reusable UI components
|-  layouts/            # page layouts (e.g. MainLayout)
|-  pages/              # served routes
|-  styles/             # traditional CSS
``` 

## License
This repository is licensed under the MIT License.