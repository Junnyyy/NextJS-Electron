import { useEffect, useState } from "react";
import Head from "next/head";

// Define the Electron window interface
declare global {
  interface Window {
    electron?: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
      sendMessage: <T>(channel: string, args: T) => void;
      on: <T>(channel: string, callback: (...args: T[]) => void) => () => void;
    };
  }
}

export default function Home() {
  const [isElectron, setIsElectron] = useState(false);
  const [versions, setVersions] = useState<{
    node?: string;
    chrome?: string;
    electron?: string;
  }>({});

  useEffect(() => {
    // Check if running in Electron
    if (window.electron) {
      setIsElectron(true);

      // Get versions
      setVersions({
        node: window.electron.node(),
        chrome: window.electron.chrome(),
        electron: window.electron.electron(),
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Next.js + Electron App</title>
        <meta name="description" content="Next.js and Electron Integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Next.js + Electron
                </h1>
                <p>
                  This is a simple example of a Next.js app running in Electron.
                </p>

                {isElectron ? (
                  <div className="mt-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Running in Electron
                    </h2>
                    <div className="mt-2 text-sm text-gray-500 border rounded-md p-4 bg-gray-50">
                      <p>
                        <span className="font-medium">Node:</span>{" "}
                        {versions.node}
                      </p>
                      <p>
                        <span className="font-medium">Chrome:</span>{" "}
                        {versions.chrome}
                      </p>
                      <p>
                        <span className="font-medium">Electron:</span>{" "}
                        {versions.electron}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <p className="text-amber-600">
                      Running in a web browser. Electron functionality not
                      available.
                    </p>
                  </div>
                )}

                <div className="pt-6 text-base font-bold text-gray-900">
                  <p>
                    This application works in both Electron and as a regular web
                    app!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
