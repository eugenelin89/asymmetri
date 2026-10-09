// Local owner utility. Inputs must be private consistent backups, never public uploads.
import { open } from 'node:fs/promises';
import { constants } from 'node:fs';
import { sealFile,openFile } from '../dist/src/encryption.js';
process.umask(0o077);
const [mode,input,output,keyPath]=process.argv.slice(2);
if(!['seal','open'].includes(mode)||!input||!output||!keyPath)throw Error('Usage: encrypted-backup.mjs seal|open INPUT OUTPUT PRIVATE_KEY_FILE');
const file=await open(keyPath,constants.O_RDONLY|constants.O_NOFOLLOW);let key;
try{const s=await file.stat();if(!s.isFile()||s.size!==32||(s.mode&0o077)!==0)throw Error('Key must be a private32-byte file.');key=await file.readFile();}finally{await file.close();}
try{await(mode==='seal'?sealFile:openFile)(input,output,key);console.log('Backup file processed; verify manifest and keep key custody separate.');}finally{key.fill(0);}
