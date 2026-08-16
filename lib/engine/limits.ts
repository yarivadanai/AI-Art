/**
 * Session time limits. Leaf module (no imports) so API routes and client code
 * can share these without pulling the question bank into their bundles.
 */

/** Session ceiling from creation. Adaptive sessions serve 35 items whose limits sum to at most ~35 min; fixed (legacy) sessions to ~15 min; plus untimed transitions. */
export const SESSION_CEILING_MS = 45 * 60 * 1000;

/** Submissions are accepted this long past expiresAt (last question in flight, clock skew). The client mirrors this. */
export const SUBMIT_GRACE_MS = 5 * 60 * 1000;
