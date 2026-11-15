import type { APIRoute } from 'astro';
import { approximateLocation, clean, sendWhatsApp, visitorIp } from '../../lib/notifique';

const recent = new Map<string, number>();
export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = visitorIp(request);
    const key = ip || request.headers.get('user-agent') || 'unknown';
    const last = recent.get(key) || 0;
    if (Date.now() - last < 30 * 60 * 1000) return Response.json({ ok: true, duplicate: true });
    recent.set(key, Date.now());
    if (recent.size > 5000) for (const [k, time] of recent) if (Date.now() - time > 60 * 60 * 1000) recent.delete(k);

    const data = await request.json().catch(() => ({}));
    const local = await approximateLocation(ip);
    await sendWhatsApp(`👀 *Novo visitante no site*\n\n📄 Página: ${clean(data.path, 150) || '/'}\n📍 Local aproximado: ${local}\n🌐 IP: ${ip || 'indisponível'}\n🖥️ Dispositivo: ${clean(request.headers.get('user-agent'), 240) || 'indisponível'}\n🕒 ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Erro na notificação de visita:', error);
    return Response.json({ ok: false }, { status: 500 });
  }
};
