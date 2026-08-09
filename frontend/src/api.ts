const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '';

export function api(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}
