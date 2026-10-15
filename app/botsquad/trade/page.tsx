import { tradeMetadata } from '@/lib/trade-metadata';
import { Showcase } from '@/components/investment/showcase';
export const dynamic='force-dynamic';
export const metadata=tradeMetadata('Trade showcase · BotSquad', '/botsquad/trade');
export default function Page(){return <Showcase/>;}
