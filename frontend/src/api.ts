const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

if (!API_BASE && import.meta.env.DEV) {
  console.warn('[api] VITE_API_URL not set — API calls will go to current origin');
}

export function api(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}
