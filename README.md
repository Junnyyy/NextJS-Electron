# Next.js 15 with Electron

This project integrates Next.js 15 with Electron, allowing you to build a desktop application while maintaining the ability to deploy your Next.js app on Vercel.

## Features

- Next.js 15 with TypeScript
- Electron with Electron Forge for packaging
- Dual environment support (web and desktop)
- Static export configuration

## Development

### Next.js Development (Web Only)

To run the Next.js development server:

```bash
npm run dev
```

This will start the Next.js development server at http://localhost:3000.

### Electron Development

To run the app in Electron development mode:

```bash
npm run electron:dev
```

This will:

1. Start the Next.js development server
2. Compile the Electron TypeScript files
3. Start Electron pointing to the Next.js dev server

## Building

### Web Build

To build the Next.js app for web deployment:

```bash
npm run build
```

This will generate a static export in the `out` directory that can be deployed to any static hosting service, including Vercel.

### Electron Build

To build the Electron app for distribution:

```bash
npm run electron:build
```

This will:

1. Build the Next.js app as a static export
2. Compile the Electron TypeScript files for production
3. Package the app with Electron Forge

The packaged app will be available in the `out` directory.

## Project Structure

- `/src`: Next.js source code
- `/electron`: Electron-specific code
  - `main.ts`: Main Electron process
  - `preload.ts`: Preload script for exposing APIs to the renderer
- `/out`: Next.js build output (used by Electron)

## Deployment

### Web Deployment

The Next.js app can be deployed on Vercel or any static hosting:

```bash
npm run build
# Then deploy the 'out' directory
```

### Desktop Deployment

Package the Electron app for different platforms:

```bash
npm run make
```

This will create platform-specific distributables in the `out` directory.
