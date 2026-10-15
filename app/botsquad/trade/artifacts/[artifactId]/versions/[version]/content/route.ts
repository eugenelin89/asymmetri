import { artifactBytes } from "@/lib/investment-archive";
export const dynamic="force-dynamic";
export async function GET(request:Request,{params}:{params:Promise<{artifactId:string;version:string}>}){
 const {artifactId,version}=await params,content=await artifactBytes(artifactId,version,new URL(request.url).searchParams.get("run")??undefined);
 const headers:Record<string,string>={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'; sandbox",'Referrer-Policy':'no-referrer'};
 if(!content)return new Response((process.env.ASYMMETRI_INVESTMENT_EVIDENCE_MODE==='synthetic_fixture'?'Synthetic demonstration — not live trading or real worker activity. ':'')+'This artifact is unavailable.',{status:410,headers});
 const extensions:Record<string,string>={'text/plain':'txt','text/markdown':'md','application/json':'json','text/csv':'csv','image/png':'png'};
 if(!extensions[content.type])return new Response('Unsupported format.',{status:415,headers});
 if(content.synthetic)headers['X-Evidence-Mode']='synthetic_fixture';
 headers['Content-Type']=content.type;headers['Content-Length']=String(content.bytes.length);
 headers['Content-Disposition']=`${content.type==='image/png'&&new URL(request.url).searchParams.get('display')==='1'?'inline':'attachment'}; filename="${content.synthetic?'synthetic-':''}${artifactId}-v${version}.${extensions[content.type]}"`;
 return new Response(content.bytes as Uint8Array<ArrayBuffer>,{headers});
}
