import type {PortfolioSnapshot} from '@/receiver/vendor/investment/v1/types';
/** Display-only calculation; partial or gapped histories cannot prove an earlier peak. */
export function benchmarkDrawdowns(points:PortfolioSnapshot[],capital?:string): (string|null)[] {
 if(!capital||Number(capital)<=0||points.some((s,i)=>BigInt(s.valuationSequence)!==BigInt(i+1)||s.benchmark.equity===null))return points.map(()=>null);
 let peak=Number(capital);
 return points.map(s=>{const equity=Number(s.benchmark.equity);peak=Math.max(peak,equity);return ((equity-peak)/peak).toFixed(6);});
}
