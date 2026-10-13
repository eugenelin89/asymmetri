/** Server-owned loopback Host mapping. Never accepts forwarded/request headers. */
export function investmentReadHeaders(
  location: string,
  authority = process.env.ASYMMETRI_INVESTMENT_READ_AUTHORITY,
): Record<string,string> {
  const url = new URL(location);
  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || url.username || url.password || url.hash) {
    throw new Error('Archive reads require a trusted loopback URL.');
  }
  if (authority === undefined) return {};
  const match = /^([a-z0-9]+(?:[.-][a-z0-9]+)*)(?::([1-9][0-9]{0,4}))?$/.exec(authority);
  if (!match || match[2] && Number(match[2]) > 65535) throw new Error('Invalid configured archive authority.');
  return {Host:authority};
}

/** Node fetch may discard Host overrides. Use native HTTP only for the explicit
 * DigitalOcean loopback mapping; default Sites/no-mapping reads keep fetch. */
export async function investmentArchiveFetch(location:string, timeoutMs:number, maxBytes:number, authority=process.env.ASYMMETRI_INVESTMENT_READ_AUTHORITY):Promise<Response> {
  const headers=investmentReadHeaders(location,authority);
  if(authority===undefined)return fetch(location,{cache:'no-store',redirect:'error',signal:AbortSignal.timeout(timeoutMs)});
  const {request}=await import('node:http'),url=new URL(location);
  return new Promise<Response>((resolve,reject)=>{
    const req=request({hostname:'127.0.0.1',port:url.port||'80',path:url.pathname+url.search,method:'GET',
      headers:{...headers,Connection:'close'},agent:false,signal:AbortSignal.timeout(timeoutMs)},res=>{
      const parts:Buffer[]=[];let length=0;
      res.on('data',(part:Buffer)=>{length+=part.length;if(length>maxBytes){req.destroy(new Error('Archive response exceeds bound.'));}else parts.push(part);});
      res.on('error',reject);res.on('aborted',()=>reject(new Error('Archive response interrupted.')));
      res.on('end',()=>{
        try{
          const responseHeaders=new Headers();
          for(const [name,value] of Object.entries(res.headers))if(value!==undefined)responseHeaders.set(name,Array.isArray(value)?value.join(', '):value);
          const status=res.statusCode??503;
          resolve(new Response([204,205,304].includes(status)?null:Buffer.concat(parts),{status,headers:responseHeaders}));
        }catch(error){reject(error);}
      });
    });req.on('error',reject);req.end();
  });
}
