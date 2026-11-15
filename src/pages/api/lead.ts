import type { APIRoute } from 'astro';
import { approximateLocation, clean, sendWhatsApp, visitorIp } from '../../lib/notifique';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const nome = clean(data.nome, 100);
    const empresa = clean(data.empresa, 120);
    const telefone = clean(data.telefone, 40);
    const email = clean(data.email, 160);
    const mensagem = clean(data.mensagem, 800);
    if (!nome || !empresa || !telefone || !email) return Response.json({ ok: false, error: 'Preencha os campos obrigatórios.' }, { status: 400 });

    const ip = visitorIp(request);
    const local = await approximateLocation(ip);
    await sendWhatsApp(`🟢 *Nova solicitação de demonstração*\n\n👤 Nome: ${nome}\n🏢 Empresa: ${empresa}\n📱 Telefone: ${telefone}\n✉️ E-mail: ${email}\n💬 Mensagem: ${mensagem || 'Não informada'}\n\n📍 Local aproximado: ${local}\n🌐 IP: ${ip || 'indisponível'}\n🕒 ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Erro ao enviar lead:', error);
    return Response.json({ ok: false, error: 'Não foi possível enviar agora. Tente novamente.' }, { status: 500 });
  }
};
