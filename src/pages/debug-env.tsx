import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type EnvDebugProps = {
  // Component props
};

type EnvData = {
  environment: Record<string, string>;
  message: string;
};

export default function EnvDebug({}: EnvDebugProps) {
  const router = useRouter();
  const { key } = router.query;

  const [envData, setEnvData] = useState<EnvData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchEnvData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/env-debug${key ? `?key=${key}` : ""}`
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError(
              "Unauthorized: Access to environment variables requires a valid debug key"
            );
          } else {
            setError(`Error fetching environment data: ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();
        setEnvData(data);
      } catch (err) {
        setError(
          `Failed to fetch environment data: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnvData();
  }, [router.isReady, key]);

  return (
    <>
      <Head>
        <title>Environment Variables Debug</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Environment Variables Debug
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              This page displays environment variables for debugging purposes
            </p>
          </div>

          <div className="mt-10 sm:mt-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Environment Variables
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Current environment: {process.env.NODE_ENV}
                </p>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                {loading && (
                  <div className="py-10 text-center">
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
                    <p>Loading environment data...</p>
                  </div>
                )}

                {error && (
                  <div className="py-5 px-4 sm:px-6 text-red-600">
                    <p>{error}</p>
                    {error.includes("Unauthorized") && (
                      <p className="mt-2 text-sm">
                        Add ?key=YOUR_DEBUG_KEY to the URL to access this page
                        in production.
                      </p>
                    )}
                  </div>
                )}

                {envData && (
                  <dl className="divide-y divide-gray-200">
                    {Object.entries(envData.environment).map(([key, value]) => (
                      <div
                        key={key}
                        className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                      >
                        <dt className="text-sm font-medium text-gray-500">
                          {key}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loader {
          border-top-color: #3b82f6;
          animation: spinner 1.5s linear infinite;
        }

        @keyframes spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}

// This ensures the page is always server-rendered for security
export async function getServerSideProps() {
  return {
    props: {},
  };
}
