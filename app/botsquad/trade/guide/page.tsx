import { TradeGuideLayout } from '@/components/investment/guide-layout';
import { tradeGuide } from '@/content/site';
import { pageMetadata } from '@/lib/metadata';
import { GuideArticle, guideContents } from './article';
import './guide.css';

export const metadata = { ...pageMetadata({ title: tradeGuide.title + ' | Asymmetri Labs', description: tradeGuide.description }, tradeGuide.href, '/images/labs-social.png'), robots: { index: false, follow: false } };

export default function TradeGuidePage() {
  return <TradeGuideLayout contents={guideContents}><GuideArticle /></TradeGuideLayout>;
}
