# Next.js 15 with Electron

This project integrates Next.js 15 page router with Electron, allowing you to build a desktop application while maintaining the ability to deploy your Next.js app on Vercel.

> [!NOTE]
> I built this at 1 AM on a work night, there may be some issues. I'll update this as I find them. If you find any issues, please let me know.

<img width="550" alt="image" src="https://github.com/user-attachments/assets/ade05347-f4e1-4f38-a267-e2f971329ca3" />

## Features

- Next.js 15 with TypeScript
- Electron with Electron Forge for packaging
- Dual environment support (web and desktop)
- Static export configuration

## Caveats

- API routes don't work in Electron
- App router RSCs face issues when used in Electron. Therefore, I've used the pages router for this example.

## File Structure

```
nextjs-electron/
├── electron/             # Electron-specific code
│   ├── main.ts           # Main Electron process
│   ├── preload.ts        # Preload script for secure IPC
│   └── tsconfig.json     # TypeScript config for Electron
├── src/                  # Next.js source code
│   ├── pages/            # Page components
│   │   ├── _app.tsx      # App wrapper component
│   │   ├── _document.tsx # Document component
│   │   ├── index.tsx     # Home page component
│   │   └── api/          # API routes (These don't work in Electron)
│   └── styles/           # CSS styles
├── public/               # Static assets
├── out/                  # Static build output (generated)
├── package.json          # Project dependencies & scripts
├── next.config.ts        # Next.js configuration
├── forge.config.js       # Electron Forge config
├── tsconfig.json         # TypeScript config for Next.js
└── ...                   # Other config files
```

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

> [!NOTE]
> If you're using Chrome DevTools (such as when using `npm run electron:dev`), you may see some errors related to the Autofill API that looks like this: `Request Autofill.enable failed...`. This is a result of a experimental Autofill Panel in Devtools. It can be disabled by turning off the Autofill Panel experiment in DevTools. Ref. [Issue #41614](https://github.com/electron/electron/issues/41614).
> 
> <img width="250" alt="image" src="https://github.com/user-attachments/assets/2424fce2-9519-46db-93d0-9a6700fa0e91" />


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

## Deployment

### Web Deployment

The Next.js app can be deployed on Vercel or any static hosting:

```bash
npm run build
# Then deploy the 'out' directory
```

Hosted on Vercel: https://electron.johnnyle.io/

> [!TIP]
> On Vercel, you won't need to set the output directory. It will automatically use the `out` directory. If you're facing [`Routes Manifest Could Not Be Found` error](https://github.com/vercel/vercel/blob/main/errors/now-next-routes-manifest.md), it's likely because of this.

### Desktop Deployment

Package the Electron app for different platforms:

```bash
npm run make
```

This will create platform-specific distributables in the `out` directory.

### Links

- [Next.js](https://nextjs.org/)
- [Electron](https://www.electronjs.org/)
- [Electron Forge](https://www.electronforge.io/)
