import type { Actor, RecordRef, Worker } from '@/receiver/vendor/investment/v1/types';
export const investmentPath = '/botsquad/investment';
export function inRun(path: string, run?: string): string {
  return run ? `${path}${path.includes('?') ? '&' : '?'}run=${encodeURIComponent(run)}` : path;
}
export const artifactHref = (id: string, version: number, run?: string) => inRun(`${investmentPath}/artifacts/${id}/versions/${version}`, run);
export function recordHref(ref: RecordRef, run?: string): string {
  if (ref.kind === 'artifact' && ref.version > 0) return artifactHref(ref.id, ref.version, run);
  if (ref.kind === 'discussion') return inRun(`${investmentPath}/discussions/${ref.id}`, run);
  return inRun(`${investmentPath}/records/${ref.kind}/${ref.id}/versions/${ref.version}`, run);
}
export function actorName(actor: Actor, workers: Worker[] = []): string {
  return actor.kind === 'worker' ? workers.find(w => w.workerId === actor.workerId)?.name ?? actor.workerId : actor.kind === 'owner' ? 'Owner contribution' : 'System event';
}
export function displayTime(value: string | null): string {
  return value ? new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(value)) + ' UTC' : 'Unknown';
}
const unit=BigInt(1000000);
function micros(value:string):bigint {
  const negative=value.startsWith('-'),[whole,fraction='']=value.replace(/^-/, '').split('.');
  return (BigInt(whole)*unit+BigInt(fraction.padEnd(6,'0').slice(0,6)))*(negative?BigInt(-1):BigInt(1));
}
function roundEven(n:bigint,d:bigint):bigint {
  const sign=n<BigInt(0)?BigInt(-1):BigInt(1),a=n*sign,q=a/d,r=a%d;
  return (q+(r*BigInt(2)>d||r*BigInt(2)===d&&q%BigInt(2)===BigInt(1)?BigInt(1):BigInt(0)))*sign;
}
function exactDisplay(value:string,factor:bigint,currency:boolean):string {
  const cents=roundEven(micros(value)*factor,BigInt(10000)),abs=cents<BigInt(0)?-cents:cents;
  const grouped=new Intl.NumberFormat('en-US').format(abs/BigInt(100));
  const sign=cents<BigInt(0)?'-':!currency&&cents>BigInt(0)?'+':'';
  return `${sign}${currency?'$':''}${grouped}.${(abs%BigInt(100)).toString().padStart(2,'0')}${currency?'':'%'}`;
}
export const money=(value:string|null|undefined)=>value==null?'Unavailable':exactDisplay(value,BigInt(1),true);
export const percent=(value:string|null|undefined)=>value==null?'Unavailable':exactDisplay(value,BigInt(100),false);
/** Derived display weight only; exact integer division, never unknown-to-zero. */
export function ratio(part:string|null,whole:string|null):string|null {
  if(part===null||whole===null||micros(whole)<=BigInt(0))return null;
  const n=roundEven(micros(part)*unit,micros(whole)),a=n<BigInt(0)?-n:n;
  return `${n<BigInt(0)?'-':''}${a/unit}.${(a%unit).toString().padStart(6,'0')}`;
}
export function compareSequence(a:string,b:string):number{return a===b?0:BigInt(a)<BigInt(b)?-1:1;}
export function csv(rows: (string | number | null)[][]): string {
  return rows.map(row => row.map(cell => {
    const text = cell == null ? 'Unavailable' : String(cell);
    const safe = /^[\s\u0000-\u001f]*[=+\-@]/.test(text) ? "'" + text : text;
    return '"' + safe.replaceAll('"', '""') + '"';
  }).join(',')).join('\r\n');
}

export function decimalSum(values:string[]):string {
 const n=values.reduce((sum,value)=>sum+micros(value),BigInt(0)),a=n<BigInt(0)?-n:n;
 return `${n<BigInt(0)?'-':''}${a/unit}.${(a%unit).toString().padStart(6,'0')}`;
}
