'use client';
import { csv } from '@/lib/investment-links';
import { investmentArchive } from '@/content/site';
export function ExportButtons({rows,records,name,synthetic}:{rows:(string|number|null)[][];records:unknown;name:string;synthetic:boolean}) {
  function download(format:'csv'|'json') {
    const label=synthetic?investmentArchive.synthetic:'Published paper experiment — no real money';
    const data=format==='csv'?csv([['Evidence mode',label],...rows]):JSON.stringify({notice:label,scope:'Currently displayed page and filters only; not the complete archive.',records},null,2);
    const url=URL.createObjectURL(new Blob([data],{type:format==='csv'?'text/csv;charset=utf-8':'application/json'}));
    const link=document.createElement('a');link.href=url;link.download=`${synthetic?'synthetic-':''}${name}.${format}`;link.click();URL.revokeObjectURL(url);
  }
  return <div className="inv-actions"><button onClick={()=>download('csv')}>Export shown CSV</button><button onClick={()=>download('json')}>Export shown JSON</button></div>;
}
