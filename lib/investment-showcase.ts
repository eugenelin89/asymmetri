import { archiveRead, experimentRead, type ArchiveResponse } from './investment-archive';
import type { ArtifactPage, DiscussionPage, EventPage, PerformancePage, PublicExperiment, PublicStatus, SnapshotResponse, TransactionPage } from '@/receiver/vendor/investment/v1/types';
export interface ShowcaseData {
  run: string | undefined;
  experiment: ArchiveResponse<PublicExperiment>;
  status: ArchiveResponse<PublicStatus>;
  snapshot: ArchiveResponse<SnapshotResponse>;
  events: ArchiveResponse<EventPage>;
  performance: ArchiveResponse<PerformancePage>;
  artifacts: ArchiveResponse<ArtifactPage>;
  discussions: ArchiveResponse<DiscussionPage>;
  transactions: ArchiveResponse<TransactionPage>;
}
/** Nine bounded reads, at most two in flight; final status witnesses visibility. No recursive archive download or artifact-byte fan-out. */
export async function readShowcase(run = process.env.ASYMMETRI_INVESTMENT_RUN): Promise<ShowcaseData> {
  const [experiment,status] = await Promise.all([experimentRead(),archiveRead<PublicStatus>('status',run)]);
  const [snapshot,events] = await Promise.all([archiveRead<SnapshotResponse>('snapshot',run),archiveRead<EventPage>('events?limit=100',run)]);
  const [performance,artifacts] = await Promise.all([archiveRead<PerformancePage>('performance?limit=100',run),archiveRead<ArtifactPage>('artifacts?limit=20',run)]);
  const [discussions,transactions] = await Promise.all([archiveRead<DiscussionPage>('discussions?limit=20',run),archiveRead<TransactionPage>('transactions?limit=20',run)]);
  const witness=await archiveRead<PublicStatus>('status',run);
  const results=[experiment,status,snapshot,events,performance,artifacts,discussions,transactions];
  const invalid=results.some(result=>result.data&&result.fingerprint!==(witness.data?witness.fingerprint:undefined))||!witness.data;
  if(invalid){const denied={data:null,error:status.code==='NOT_CONFIGURED'?'No archive read service is configured.':'Archive visibility changed or is unavailable. Refresh to verify current records.',code:'UNAVAILABLE'} as const;return {run,experiment:denied,status:denied,snapshot:denied,events:denied,performance:denied,artifacts:denied,discussions:denied,transactions:denied};}
  return {run,experiment,status:witness,snapshot,events,performance,artifacts,discussions,transactions};
}
