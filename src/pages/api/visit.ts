import type { APIRoute } from 'astro';
import { clean, lookupIpDetails, sendWhatsApp, visitorIp } from '../../lib/notifique';
import { recordVisit } from '../../lib/visits';

const recent=new Map<string,number>();
export const POST:APIRoute=async({request})=>{
  try{
    const ip=visitorIp(request),key=ip||request.headers.get('user-agent')||'unknown',last=recent.get(key)||0;
    if(Date.now()-last<30*60*1000)return Response.json({ok:true,duplicate:true});
    recent.set(key,Date.now());
    if(recent.size>5000)for(const[k,time]of recent)if(Date.now()-time>60*60*1000)recent.delete(k);
    const data=await request.json().catch(()=>({})),details=await lookupIpDetails(ip),pagePath=clean(data.path,150)||'/';
    await recordVisit(request,pagePath,details.location,details.operator);
    try{
      await sendWhatsApp(`👀 *Novo visitante no site*\n\n📄 Página: ${pagePath}\n📍 Local aproximado: ${details.location}\n📡 Operadora: ${details.operator}\n🌐 IP: ${ip||'indisponível'}\n🖥️ Dispositivo: ${clean(request.headers.get('user-agent'),240)||'indisponível'}\n🕒 ${new Date().toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})}`);
      return Response.json({ok:true,notified:true});
    }catch(error){console.error('Visita registrada, mas a notificação falhou:',error);return Response.json({ok:true,notified:false})}
  }catch(error){console.error('Erro ao registrar visita:',error);return Response.json({ok:false},{status:500})}
};
