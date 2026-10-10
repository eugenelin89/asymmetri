import { Showcase } from '@/components/investment/showcase';
import { ArchiveShell } from '@/components/investment/archive';
import { archiveId } from '@/lib/investment-archive';
export const dynamic='force-dynamic';
export const metadata={title:'Retained investment run · BotSquad',robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{runId:string}>}){const {runId}=await params;return archiveId(runId)?<Showcase run={runId}/>:<ArchiveShell title="Invalid run"><p>No experiment can be verified for this identity.</p></ArchiveShell>;}
