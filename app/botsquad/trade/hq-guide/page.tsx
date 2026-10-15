import { TradeGuideLayout } from '@/components/investment/guide-layout';
import { hqGuide, tradeGuide } from '@/content/site';
import { pageMetadata } from '@/lib/metadata';
import { HqGuideArticle, guideContents } from './article';
import '../guide/guide.css';

export const metadata = { ...pageMetadata({ title: hqGuide.title + ' | Asymmetri Labs', description: hqGuide.description }, hqGuide.href, '/images/labs-social.png'), robots: { index: false, follow: false } };

export default function HqGuidePage() {
  return <TradeGuideLayout guide={hqGuide} companion={tradeGuide} contents={guideContents}><HqGuideArticle /></TradeGuideLayout>;
}
