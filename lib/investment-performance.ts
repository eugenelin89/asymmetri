import type {PortfolioSnapshot} from '@/receiver/vendor/investment/v1/types';
/** Display-only calculation; partial or gapped histories cannot prove an earlier peak. */
export function benchmarkDrawdowns(points:PortfolioSnapshot[],capital?:string): (string|null)[] {
 if(!capital||Number(capital)<=0||points.some((s,i)=>BigInt(s.valuationSequence)!==BigInt(i+1)||s.benchmark.equity===null))return points.map(()=>null);
 let peak=Number(capital);
 return points.map(s=>{const equity=Number(s.benchmark.equity);peak=Math.max(peak,equity);return ((equity-peak)/peak).toFixed(6);});
}

/** A hidden or absent valuation must break the plotted line even if its neighbours have values. */
export function performancePath(sequences: string[], series: (string|null)[], x: (i:number)=>number, y:(percent:number)=>number): string {
 let gap=true;
 return series.map((value,i)=>{
  if(value===null){gap=true;return '';}
  const contiguous=i>0&&BigInt(sequences[i])===BigInt(sequences[i-1])+BigInt(1);
  const command=gap||!contiguous?'M':'L';
  gap=false;
  return `${command}${x(i)},${y(Number(value)*100)}`;
 }).join(' ');
}

export function performanceSequenceGaps(sequences: string[]): number {
 return sequences.filter((sequence,i)=>i>0&&BigInt(sequence)!==BigInt(sequences[i-1])+BigInt(1)).length;
}
