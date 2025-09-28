import { ConfigService } from '@nestjs/config';
import { SessionTokenService } from './session-token.service.js';

function toBase64Url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function fromBase64Url(input: string): string {
  const padded = input.padEnd(input.length + ((4 - (input.length % 4)) % 4), '=');
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf8');
}

function createService(secret = 'specimen-secret') {
  const config = new ConfigService({
    SESSION_TOKEN_SECRET: secret,
    SESSION_TOKEN_ISSUER: 'hit-arc-test',
  });
  return new SessionTokenService(config);
}

describe('SessionTokenService', () => {
  it('signs and verifies a session token', () => {
    const service = createService();
    const token = service.sign({
      specimenId: 'spec-abc',
      seed: 'seed-123',
      expiresAt: new Date(Date.now() + 60_000),
    });

    const claims = service.verify(token);

    expect(claims).not.toBeNull();
    expect(claims?.sub).toBe('spec-abc');
    expect(claims?.seed).toBe('seed-123');
    expect(claims?.iss).toBe('hit-arc-test');
  });

  it('rejects tampered tokens', () => {
    const service = createService();
    const token = service.sign({
      specimenId: 'spec-another',
      seed: 'seed-xyz',
      expiresAt: new Date(Date.now() + 60_000),
    });

    const parts = token.split('.');
    const payload = JSON.parse(fromBase64Url(parts[1]));
    payload.sub = 'spec-tampered';
    parts[1] = toBase64Url(JSON.stringify(payload));
    const tampered = parts.join('.');

    const claims = service.verify(tampered);
    expect(claims).toBeNull();
  });

  it('expires tokens based on exp claim', () => {
    const service = createService();
    const token = service.sign({
      specimenId: 'spec-expired',
      seed: 'seed-expired',
      expiresAt: new Date(Date.now() - 1_000),
    });

    const claims = service.verify(token);
    expect(claims).toBeNull();
  });
});
