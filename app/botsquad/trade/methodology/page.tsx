import { tradeMetadata } from '@/lib/trade-metadata';
import { ArchiveShell } from '@/components/investment/archive';
import { investmentShowcase } from '@/content/site';
export const dynamic='force-dynamic';
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ run?: string }> }) {
  return tradeMetadata('Trade methodology & limitations · BotSquad', '/botsquad/trade/methodology', (await searchParams).run);
}
export default async function Page({searchParams}:{searchParams:Promise<{run?:string}>}){const {run}=await searchParams;return <ArchiveShell detail="Methodology" title="Methodology & limitations" run={run}><p className="archive-lead">{investmentShowcase.methodologyIntroduction}</p>{investmentShowcase.methodology.map(([title,body])=><section key={title}><h2>{title}</h2><p>{body}</p></section>)}</ArchiveShell>;}
