/**
 * Session time limits. Leaf module (no imports) so API routes and client code
 * can share these without pulling the question bank into their bundles.
 */

/** Session ceiling from creation. Worst case is 15 min of question time (10x30s + 5x30s + 10x45s) plus five untimed section intros. */
export const SESSION_CEILING_MS = 30 * 60 * 1000;

/** Submissions are accepted this long past expiresAt (last question in flight, clock skew). The client mirrors this. */
export const SUBMIT_GRACE_MS = 5 * 60 * 1000;
