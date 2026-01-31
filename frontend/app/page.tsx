const API_BASE =
  process.env.API_BASE_URL ?? // p.ej. "http://host.docker.internal:4000" si usas Docker
  'http://127.0.0.1:4000';

async function getHealth() {
  const res = await fetch(`${API_BASE}/health`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('No se pudo obtener el estado del servidor');
  }

  return res.json();
}

export default async function Home() {
  const data = await getHealth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Estado del servidor
        </h1>

        <div className="text-sm text-gray-700 mb-4 text-center">
          Endpoint: <code className="font-mono text-blue-600">/health</code>
        </div>

        <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded-lg overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </main>
  );
}
