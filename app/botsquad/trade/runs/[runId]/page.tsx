import { tradeMetadata } from '@/lib/trade-metadata';
import { Showcase } from '@/components/investment/showcase';
import { ArchiveShell } from '@/components/investment/archive';
import { archiveId } from '@/lib/investment-archive';
export const dynamic='force-dynamic';
export async function generateMetadata(input: { params: Promise<{ runId:string }> }) {
  const params = await input.params;
  return tradeMetadata('Retained trade run · BotSquad', `/botsquad/trade/runs/${encodeURIComponent(params.runId)}`);
}
export default async function Page({params}:{params:Promise<{runId:string}>}){const {runId}=await params;return archiveId(runId)?<Showcase run={runId}/>:<ArchiveShell title="Invalid run"><p>No experiment can be verified for this identity.</p></ArchiveShell>;}
