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
      sendExampleMessage: (message: string) => void;
      onExampleResponse: (
        callback: (data: {
          received: boolean;
          timestamp: string;
          message: string;
        }) => void
      ) => () => void;
      getSystemInfo: () => Promise<{
        platform: string;
        arch: string;
        nodeVersion: string;
        electronVersion: string;
        chromeVersion: string;
      }>;
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
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<{
    received: boolean;
    timestamp: string;
    message: string;
  } | null>(null);
  const [systemInfo, setSystemInfo] = useState<{
    platform?: string;
    arch?: string;
    nodeVersion?: string;
    electronVersion?: string;
    chromeVersion?: string;
  }>({});

  useEffect(() => {
    if (window.electron) {
      setIsElectron(true);

      setVersions({
        node: window.electron.node(),
        chrome: window.electron.chrome(),
        electron: window.electron.electron(),
      });

      const removeListener = window.electron.onExampleResponse((data) => {
        setResponse(data);
      });

      window.electron.getSystemInfo().then((info) => {
        setSystemInfo(info);
      });

      return () => {
        removeListener();
      };
    }
  }, []);

  const handleSendMessage = () => {
    if (window.electron && message.trim()) {
      window.electron.sendExampleMessage(message);
      setMessage("");
    }
  };

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

                    <div className="mt-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        System Information
                      </h2>
                      <div className="mt-2 text-sm text-gray-500 border rounded-md p-4 bg-gray-50">
                        <p>
                          <span className="font-medium">Platform:</span>{" "}
                          {systemInfo.platform}
                        </p>
                        <p>
                          <span className="font-medium">Architecture:</span>{" "}
                          {systemInfo.arch}
                        </p>
                        <p>
                          <span className="font-medium">Node Version:</span>{" "}
                          {systemInfo.nodeVersion}
                        </p>
                        <p>
                          <span className="font-medium">Electron Version:</span>{" "}
                          {systemInfo.electronVersion}
                        </p>
                        <p>
                          <span className="font-medium">Chrome Version:</span>{" "}
                          {systemInfo.chromeVersion}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        Send Message to Main Process
                      </h2>
                      <div className="mt-2">
                        <div className="flex">
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Send
                          </button>
                        </div>

                        {response && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800">
                              <span className="font-medium">Response:</span>{" "}
                              {response.message}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Received at: {response.timestamp}
                            </p>
                          </div>
                        )}
                      </div>
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
