/** Framework-neutral, disabled-by-default read boundary for a later server page.
 * No SQLite, signing keys, receiver runtime imports, fetches or startup side effects.
 */
export type {
  PublicExperiment, PublicStatus, SnapshotResponse, EventPage, PerformancePage,
  TransactionPage, DiscussionPage, DiscussionDetail, DecisionDetail, ArtifactPage,
  ArtifactDetail, RecordDetail,
} from "../receiver/vendor/investment/v1/types";

export function investmentArchiveReadLocation(
  experimentId: string,
  runId: string,
  origin = process.env.ASYMMETRI_INVESTMENT_READ_ORIGIN,
): { status: string; snapshot: string; events: string } | null {
  if (!origin) return null;
  if (![experimentId, runId].every((id) => /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(id))) {
    throw new Error("Invalid public archive identity.");
  }
  const base = new URL(origin);
  if (base.protocol !== "http:" || base.hostname !== "127.0.0.1" ||
      base.username || base.password || base.search || base.hash || base.pathname !== "/") {
    throw new Error("Public archive reads require an explicit loopback origin.");
  }
  const path = `/api/experiments/v1/experiments/${experimentId}/runs/${runId}`;
  return Object.fromEntries(["status", "snapshot", "events"].map((name) =>
    [name, new URL(`${path}/${name}`, base).href])) as { status: string; snapshot: string; events: string };
}
