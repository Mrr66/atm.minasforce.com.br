const API_BASE = 'https://api.notifique-me.com/api';

let cachedToken = '';
let tokenExpiresAt = 0;

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Variável ${name} não configurada.`);
  return value;
}

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;

  const usuario = encodeURIComponent(required('NOTIFIQUE_USER'));
  const senha = encodeURIComponent(required('NOTIFIQUE_PASSWORD'));
  const response = await fetch(`${API_BASE}/login/v1?usuario=${usuario}&senha=${senha}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' },
  });

  if (!response.ok) throw new Error(`Falha no login Notifique-me (${response.status}).`);
  const data = await response.json() as { token?: string; expiration?: string };
  if (!data.token) throw new Error('Token não retornado pelo Notifique-me.');
  cachedToken = data.token;
  tokenExpiresAt = data.expiration ? new Date(data.expiration).getTime() : Date.now() + 4 * 60 * 60 * 1000;
  return cachedToken;
}

export async function sendWhatsApp(message: string) {
  const token = await getToken();
  const response = await fetch(`${API_BASE}/Notificacao/v1`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Msg: message,
      ClienteId: required('NOTIFIQUE_CLIENT_ID'),
      Type: 0,
      Numero: Number(required('NOTIFIQUE_WHATSAPP_NUMBER').replace(/\D/g, '')),
      Status: 0,
    }),
  });
  if (!response.ok) throw new Error(`Falha ao enviar WhatsApp (${response.status}).`);
}

export function visitorIp(request: Request) {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return headers.get('cf-connecting-ip') || headers.get('x-real-ip') || forwarded || '';
}

export type IpDetails = { location: string; operator: string };

export async function lookupIpDetails(ip: string): Promise<IpDetails> {
  if (!ip || /^(127\.|::1$|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)) {
    return { location: 'Localização indisponível', operator: 'Operadora indisponível' };
  }
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: AbortSignal.timeout(3500) });
    if (!response.ok) throw new Error(`Consulta de IP falhou (${response.status}).`);
    const result = await response.json() as any;
    if (!result?.success) throw new Error('Consulta de IP não retornou dados.');
    return {
      location: [result.city, result.region, result.country].filter(Boolean).join(', ') || 'Localização indisponível',
      operator: result.connection?.isp || result.connection?.org || result.connection?.domain || 'Operadora indisponível',
    };
  } catch { return { location: 'Localização indisponível', operator: 'Operadora indisponível' }; }
}

export async function approximateLocation(ip: string) { return (await lookupIpDetails(ip)).location; }

export function clean(value: unknown, max = 500) {
  return String(value ?? '').replace(/[<>]/g, '').trim().slice(0, max);
}
