import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const conceptRoot = resolve(process.cwd(), 'concepts');

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params;
  const relativePath = path.length > 0 ? path.join('/') : 'index.html';
  const filePath = resolve(conceptRoot, relativePath);

  if (!filePath.startsWith(`${conceptRoot}${sep}`)) {
    return new Response(null, { status: 404 });
  }

  try {
    const contents = await readFile(filePath);
    return new Response(new Uint8Array(contents), {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
