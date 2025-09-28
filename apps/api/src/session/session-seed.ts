import { randomUUID, createHash } from 'node:crypto';

export function generateSessionSeed(): string {
  const timestamp = Date.now().toString(36);
  const entropy = randomUUID().replace(/-/g, '');
  const digest = createHash('sha256').update(entropy).digest('hex').slice(0, 10);
  return `${timestamp}-${digest}`;
}
