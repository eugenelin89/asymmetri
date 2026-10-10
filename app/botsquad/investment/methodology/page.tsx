import { ArchiveShell } from '@/components/investment/archive';
import { investmentShowcase } from '@/content/site';
export const dynamic='force-dynamic';
export const metadata={title:'Investment methodology & limitations · BotSquad',robots:{index:false,follow:false}};
export default async function Page({searchParams}:{searchParams:Promise<{run?:string}>}){const {run}=await searchParams;return <ArchiveShell staticContent title="Methodology & limitations" run={run}><p className="archive-lead">A transparent experiment in teamwork and accountability. Official settings remain unconfigured; synthetic examples do not approve them.</p>{investmentShowcase.methodology.map(([title,body])=><section key={title}><h2>{title}</h2><p>{body}</p></section>)}</ArchiveShell>;}
