import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';

import type { User } from '@/entities/user';

import 'server-only';

/**
 * In-memory mock auth store.
 *
 * Replaced 1:1 by a real backend later. Lives only in the dev process —
 * data is lost on server restart. Module is cached across HMR boundaries
 * via `globalThis` so we don't lose state on hot reload.
 *
 * THIS FILE MUST NEVER BE IMPORTED FROM CLIENT CODE.
 */

type StoredUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // "<saltHex>:<hashHex>"
  createdAt: string;
};

type Session = {
  id: string;
  userId: string;
  expiresAt: number;
};

type RegisterChallenge = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  code: string;
  expiresAt: number;
  attemptsLeft: number;
};

type StoreShape = {
  usersById: Map<string, StoredUser>;
  usersByEmail: Map<string, StoredUser>;
  sessions: Map<string, Session>;
  challenges: Map<string, RegisterChallenge>;
};

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7d
const CHALLENGE_TTL_MS = 10 * 60 * 1000; // 10m
const MAX_CODE_ATTEMPTS = 5;

const globalKey = Symbol.for('@app/auth-mock-store');
const globalScope = globalThis as unknown as { [globalKey]?: StoreShape };

function getStore(): StoreShape {
  if (!globalScope[globalKey]) {
    globalScope[globalKey] = {
      usersById: new Map(),
      usersByEmail: new Map(),
      sessions: new Map(),
      challenges: new Map(),
    };
  }

  return globalScope[globalKey];
}

/* ------------------------------------------------------------------ */
/*  Password hashing (scrypt)                                         */
/* ------------------------------------------------------------------ */

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);

  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(password, salt, expected.length);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublicUser(u: StoredUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt,
  };
}

/* ------------------------------------------------------------------ */
/*  Users                                                             */
/* ------------------------------------------------------------------ */

export function findUserByEmail(email: string): StoredUser | undefined {
  return getStore().usersByEmail.get(normalizeEmail(email));
}

export function createUser(args: { email: string; name: string; passwordHash: string }): User {
  const store = getStore();
  const user: StoredUser = {
    id: randomUUID(),
    email: normalizeEmail(args.email),
    name: args.name,
    passwordHash: args.passwordHash,
    createdAt: new Date().toISOString(),
  };
  store.usersById.set(user.id, user);
  store.usersByEmail.set(user.email, user);

  return toPublicUser(user);
}

export function getPublicUser(userId: string): User | undefined {
  const u = getStore().usersById.get(userId);

  return u ? toPublicUser(u) : undefined;
}

export function checkCredentials(email: string, password: string): User | null {
  const u = findUserByEmail(email);
  if (!u) return null;
  if (!verifyPassword(password, u.passwordHash)) return null;

  return toPublicUser(u);
}

/* ------------------------------------------------------------------ */
/*  Sessions                                                          */
/* ------------------------------------------------------------------ */

export function createSession(userId: string): Session {
  const session: Session = {
    id: randomBytes(32).toString('hex'),
    userId,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  getStore().sessions.set(session.id, session);

  return session;
}

export function getSession(sessionId: string | undefined): Session | null {
  if (!sessionId) return null;
  const session = getStore().sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    getStore().sessions.delete(sessionId);

    return null;
  }

  return session;
}

export function destroySession(sessionId: string | undefined): void {
  if (!sessionId) return;
  getStore().sessions.delete(sessionId);
}

/* ------------------------------------------------------------------ */
/*  Registration challenges                                           */
/* ------------------------------------------------------------------ */

function generateCode(): string {
  // 6-digit numeric code, zero-padded.
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
}

export function createRegisterChallenge(args: { email: string; name: string; password: string }): {
  challenge: RegisterChallenge;
  code: string;
} {
  const code = generateCode();
  const challenge: RegisterChallenge = {
    id: randomUUID(),
    email: normalizeEmail(args.email),
    name: args.name,
    passwordHash: hashPassword(args.password),
    code,
    expiresAt: Date.now() + CHALLENGE_TTL_MS,
    attemptsLeft: MAX_CODE_ATTEMPTS,
  };
  getStore().challenges.set(challenge.id, challenge);

  return { challenge, code };
}

type VerifyResult =
  | { kind: 'ok'; user: User }
  | { kind: 'not-found' }
  | { kind: 'expired' }
  | { kind: 'wrong-code'; attemptsLeft: number }
  | { kind: 'locked' };

export function verifyRegisterChallenge(challengeId: string, code: string): VerifyResult {
  const store = getStore();
  const challenge = store.challenges.get(challengeId);

  if (!challenge) return { kind: 'not-found' };

  if (challenge.expiresAt < Date.now()) {
    store.challenges.delete(challengeId);

    return { kind: 'expired' };
  }

  if (challenge.attemptsLeft <= 0) {
    store.challenges.delete(challengeId);

    return { kind: 'locked' };
  }

  if (challenge.code !== code) {
    challenge.attemptsLeft -= 1;
    if (challenge.attemptsLeft <= 0) {
      store.challenges.delete(challengeId);

      return { kind: 'locked' };
    }

    return { kind: 'wrong-code', attemptsLeft: challenge.attemptsLeft };
  }

  // Race: another tab already registered this email.
  if (findUserByEmail(challenge.email)) {
    store.challenges.delete(challengeId);

    return { kind: 'not-found' };
  }

  const user = createUser({
    email: challenge.email,
    name: challenge.name,
    passwordHash: challenge.passwordHash,
  });
  store.challenges.delete(challengeId);

  return { kind: 'ok', user };
}

export const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;
export const CHALLENGE_TTL_SECONDS = CHALLENGE_TTL_MS / 1000;
