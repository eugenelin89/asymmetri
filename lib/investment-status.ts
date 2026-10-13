import type { Freshness } from '@/receiver/vendor/investment/v1/types';
import { investmentShowcase } from '@/content/site';

/** Describe the public archive's limitation without asserting private scheduler configuration. */
export function publicFreshnessReason(freshness?: Freshness): string | null {
  if (freshness?.status === 'unknown' && freshness.expectedMarkSession === null &&
      freshness.reason === 'Transport contact does not establish market freshness; no calendar collector is configured.') {
    return investmentShowcase.status.marketUnavailable;
  }
  return freshness?.reason ?? null;
}
