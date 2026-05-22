/**
 * Tiny state machine for the registration flow.
 *
 * `step` lives in component state, not in Zustand: it must reset when the
 * user leaves the page, and it has zero meaning to other parts of the app.
 */

export type RegisterStep = { kind: 'credentials' } | { kind: 'verify'; challengeId: string; email: string; expiresAt: number };
