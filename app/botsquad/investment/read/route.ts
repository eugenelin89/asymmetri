import { archiveDto, archiveId, archiveRead, experimentRead } from '@/lib/investment-archive';
export const dynamic = 'force-dynamic';
/** Same-origin GET-only projection of approved public contract data. No write or HQ proxy. */
export async function GET(request: Request) {
  const url = new URL(request.url), path = url.searchParams.get('resource') ?? '', run = url.searchParams.get('run') ?? undefined;
  const headers = {'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
  if (/^experiment(?:\?after=[A-Za-z0-9_-]+)?$/.test(path) && [...url.searchParams.keys()].every(k=>['resource','run'].includes(k))) {
    const result=await experimentRead(new URL(path,'http://local').searchParams.get('after')??undefined);
    return Response.json(result,{status:result.data?200:503,headers});
  }
  const allowed = /^(status|snapshot|events|performance|transactions|artifacts|discussions)(\?|$)/.test(path);
  if (!allowed || !archiveDto(path) || run && !archiveId(run) || [...url.searchParams.keys()].some(k=>!['resource','run'].includes(k))) return Response.json({data:null,error:'Invalid archive request.',code:'INVALID_REQUEST'},{status:400,headers});
  const result = await archiveRead(path,run);
  return Response.json(result,{status:result.data ? 200 : result.code === 'CURSOR_RESET' ? 409 : 503,headers});
}
