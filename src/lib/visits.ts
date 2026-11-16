import { createHash } from 'node:crypto';
import { mkdir, readFile, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { clean, visitorIp } from './notifique';

export type Visit = { at:string; visitor:string; path:string; ip?:string; location:string; operator?:string; userAgent:string };
const dataDirectory = process.env.VISITS_DATA_DIR?.trim() || path.join(process.cwd(), 'data');
const visitsFile = path.join(dataDirectory, 'visits.jsonl');

const knownModels:Record<string,string>={
  'SM-S711B':'Samsung Galaxy S23 FE',
};

export function describeDevice(userAgent:string) {
  if (!userAgent || userAgent === 'Indisponível') return 'Dispositivo não identificado';
  const parts:string[]=[];
  const android=userAgent.match(/Android\s+([\d.]+)(?:;\s*([^;)]+?)(?:\s+Build\/|;|\)))/i);
  const ios=userAgent.match(/(?:iPhone|iPad).*?OS\s([\d_]+)/i);

  if (android) {
    const rawModel=(android[2]||'').trim();
    const model=knownModels[rawModel]
      || (/^SM-/i.test(rawModel)?`Samsung ${rawModel}`:rawModel);
    if(model) parts.push(model);
    parts.push(`Android ${android[1]}`);
  } else if (ios) {
    parts.push(userAgent.includes('iPad')?'Apple iPad':'Apple iPhone',`iOS ${ios[1].replaceAll('_','.')}`);
  } else if (/Windows NT/i.test(userAgent)) parts.push('Computador Windows');
  else if (/Macintosh|Mac OS X/i.test(userAgent)) parts.push('Apple Mac');
  else if (/Linux/i.test(userAgent)) parts.push('Computador Linux');

  if (/Instagram/i.test(userAgent)) parts.push('Instagram');
  else if (/FBAN|FBAV/i.test(userAgent)) parts.push('Facebook');
  else if (/WhatsApp/i.test(userAgent)) parts.push('WhatsApp');
  else if (/Edg\//i.test(userAgent)) parts.push('Microsoft Edge');
  else if (/Chrome\//i.test(userAgent)) parts.push('Google Chrome');
  else if (/Safari\//i.test(userAgent)) parts.push('Safari');

  return parts.join(' · ')||'Dispositivo não identificado';
}

export async function recordVisit(request:Request, pagePath:string, location:string, operator:string) {
  const ip=visitorIp(request),identity = ip || request.headers.get('user-agent') || 'unknown';
  const salt = process.env.VISIT_HASH_SALT?.trim() || 'configure-visit-hash-salt';
  const visit:Visit = {
    at:new Date().toISOString(),
    visitor:createHash('sha256').update(`${salt}:${identity}`).digest('hex'),
    path:clean(pagePath,180)||'/', ip:clean(ip,64)||'Indisponível', location:clean(location,180)||'Localização indisponível',
    operator:clean(operator,180)||'Operadora indisponível',
    userAgent:clean(request.headers.get('user-agent'),240)||'Indisponível'
  };
  await mkdir(dataDirectory,{recursive:true,mode:0o700});
  await appendFile(visitsFile,`${JSON.stringify(visit)}\n`,{encoding:'utf8',mode:0o600});
}

export async function readVisits():Promise<Visit[]> {
  try {
    const content=await readFile(visitsFile,'utf8');
    return content.split('\n').filter(Boolean).flatMap(line=>{try{return [JSON.parse(line) as Visit]}catch{return []}});
  } catch(error:any) { if(error?.code==='ENOENT') return []; throw error; }
}
