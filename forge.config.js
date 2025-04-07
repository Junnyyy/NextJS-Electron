const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
const path = require("path");
const fs = require("fs");

const outDir = path.resolve(__dirname, "out");
const outDirExists = fs.existsSync(outDir);

module.exports = {
  packagerConfig: {
    asar: true,
    executableName: "nextjs-electron",
    extraResource: outDirExists ? [outDir] : [],
    ignoreSymlinks: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "nextjs-electron",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  hooks: {
    // Add a hook to generate the Next.js static export before packaging
    packageAfterPrune: async (config, buildPath) => {
      console.log("Building Next.js app for production...");
      const { execSync } = require("child_process");
      execSync("npm run build", { stdio: "inherit" });
    },
  },
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
