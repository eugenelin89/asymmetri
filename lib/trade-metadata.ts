import { investmentShowcase } from '@/content/site';
import { inRun } from './investment-links';
import { pageMetadata } from './metadata';

/** Public page identity only; receiver paths and stored evidence are unchanged. */
export function tradeMetadata(title: string, path: string, run?: string) {
  return {
    ...pageMetadata({ title, description: investmentShowcase.introduction }, inRun(path, typeof run === 'string' ? run : undefined), '/images/labs-social.png'),
    robots: { index: false, follow: false },
  };
}
