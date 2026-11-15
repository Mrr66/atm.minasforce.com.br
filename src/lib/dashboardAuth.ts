import { timingSafeEqual } from 'node:crypto';
const equal=(a:string,b:string)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)};
export function dashboardAuth(request:Request){
  const expectedUser=process.env.VISITAS_USER?.trim(),expectedPassword=process.env.VISITAS_PASSWORD?.trim();
  if(!expectedUser||!expectedPassword)return{configured:false,authorized:false};
  const authorization=request.headers.get('authorization')||'';
  if(!authorization.startsWith('Basic '))return{configured:true,authorized:false};
  try{const decoded=Buffer.from(authorization.slice(6),'base64').toString('utf8'),i=decoded.indexOf(':');return{configured:true,authorized:i>=0&&equal(decoded.slice(0,i),expectedUser)&&equal(decoded.slice(i+1),expectedPassword)}}catch{return{configured:true,authorized:false}}
}
