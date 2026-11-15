import { createHash } from 'node:crypto';
import { mkdir, readFile, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { clean, visitorIp } from './notifique';

export type Visit = { at:string; visitor:string; path:string; location:string; userAgent:string };
const dataDirectory = process.env.VISITS_DATA_DIR?.trim() || path.join(process.cwd(), 'data');
const visitsFile = path.join(dataDirectory, 'visits.jsonl');

export async function recordVisit(request:Request, pagePath:string, location:string) {
  const identity = visitorIp(request) || request.headers.get('user-agent') || 'unknown';
  const salt = process.env.VISIT_HASH_SALT?.trim() || 'configure-visit-hash-salt';
  const visit:Visit = {
    at:new Date().toISOString(),
    visitor:createHash('sha256').update(`${salt}:${identity}`).digest('hex'),
    path:clean(pagePath,180)||'/', location:clean(location,180)||'Localização indisponível',
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
