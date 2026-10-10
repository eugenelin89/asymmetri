import '../investment/investment.css';
import { ArchiveShell } from '@/components/investment/archive';
import { investmentShowcase } from '@/content/site';
export const dynamic='force-dynamic';
export const metadata={title:'Ask BotSquad · Coming later',robots:{index:false,follow:false}};
export default function Page(){return <ArchiveShell staticContent title="Ask BotSquad, eventually."><p className="archive-lead">{investmentShowcase.ask}</p><section><h2>One question. One relevant employee.</h2><p>The planned service will support general questions and questions about exact research, decisions and simulated transactions. It will keep visitor conversations separate from the public investment discussion.</p><p>There is no question composer, session, queue or model connection here. Functional answers belong to the later INV-ASK milestones.</p><a href="/botsquad/investment">Explore the investment showcase →</a></section></ArchiveShell>;}
