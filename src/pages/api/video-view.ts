import type { APIRoute } from 'astro';
import { anonymousVisitorId, recordVideoView } from '../../lib/visits';

const allowed:Record<string,string>={
  '/videos/apresentacao.mp4':'Apresentação completa',
  '/videos/produtos.mp4':'Consulta de produtos',
  '/videos/pagamento.mp4':'Recebendo pagamento',
  '/videos/estoque.mp4':'Atualização de estoque',
};
const recent=new Map<string,number>();

export const POST:APIRoute=async({request})=>{
  try{
    const data=await request.json().catch(()=>({})),video=String(data.video||''),videoPath=new URL(video,'https://atm.minasforce.com.br').pathname,title=allowed[videoPath];
    if(!title)return Response.json({ok:false},{status:400});
    const key=`${anonymousVisitorId(request)}:${videoPath}`,last=recent.get(key)||0;
    if(Date.now()-last<30*60*1000)return Response.json({ok:true,duplicate:true});
    recent.set(key,Date.now());
    if(recent.size>10000)for(const[k,time]of recent)if(Date.now()-time>60*60*1000)recent.delete(k);
    await recordVideoView(request,videoPath,title);
    return Response.json({ok:true});
  }catch(error){console.error('Erro ao registrar visualização do vídeo:',error);return Response.json({ok:false},{status:500})}
};
