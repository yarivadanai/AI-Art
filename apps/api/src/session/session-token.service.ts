import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';

interface SignTokenPayload {
  specimenId: string;
  seed: string;
  expiresAt: Date;
}

export interface SessionTokenClaims {
  sub: string;
  seed: string;
  exp: number;
  iat: number;
  iss: string;
}

@Injectable()
export class SessionTokenService {
  private static readonly DEFAULT_SECRET = 'hit-arc-development-secret';
  private readonly logger = new Logger(SessionTokenService.name);
  private readonly secret: string;
  private readonly issuer: string;

  constructor(private readonly config: ConfigService) {
    const configuredSecret =
      this.config.get<string>('SESSION_TOKEN_SECRET') ??
      this.config.get<string>('SESSION_SECRET') ??
      this.config.get<string>('AUTH_SECRET');

    if (!configuredSecret) {
      this.logger.warn(
        'SESSION_TOKEN_SECRET missing; falling back to a development secret. Do not use this configuration in production.',
      );
      this.secret = SessionTokenService.DEFAULT_SECRET;
    } else {
      this.secret = configuredSecret;
    }

    this.issuer = this.config.get<string>('SESSION_TOKEN_ISSUER') ?? 'hit-arc-authority';
  }

  sign(payload: SignTokenPayload): string {
    const header = this.base64UrlEncodeJson({ alg: 'HS256', typ: 'JWT' });
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = Math.floor(payload.expiresAt.getTime() / 1000);
    const body = this.base64UrlEncodeJson({
      sub: payload.specimenId,
      seed: payload.seed,
      iss: this.issuer,
      iat: issuedAt,
      exp: expiresAt,
    });

    const signature = this.signSegments(`${header}.${body}`);
    return `${header}.${body}.${signature}`;
  }

  verify(token: string): SessionTokenClaims | null {
    const segments = token.split('.');
    if (segments.length !== 3) {
      return null;
    }

    const [header, payload, signature] = segments;
    const expectedSignature = this.signSegments(`${header}.${payload}`);

    if (!this.safeEqual(signature, expectedSignature)) {
      return null;
    }

    try {
      const claims = JSON.parse(this.base64UrlDecode(payload)) as SessionTokenClaims;
      if (typeof claims.exp === 'number' && claims.exp * 1000 < Date.now()) {
        return null;
      }
      return claims;
    } catch (error) {
      this.logger.error('Failed to parse session token payload', error as Error);
      return null;
    }
  }

  private base64UrlEncodeJson(data: unknown): string {
    return this.base64UrlEncode(Buffer.from(JSON.stringify(data)));
  }

  private base64UrlEncode(buffer: Buffer): string {
    return buffer.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  private base64UrlDecode(segment: string): string {
    const padded = segment.padEnd(segment.length + ((4 - (segment.length % 4)) % 4), '=');
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf8');
  }

  private signSegments(input: string): string {
    const hash = createHmac('sha256', this.secret).update(input).digest();
    return this.base64UrlEncode(hash);
  }

  private safeEqual(a: string, b: string): boolean {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);
    if (aBuffer.length !== bBuffer.length) {
      return false;
    }
    return timingSafeEqual(aBuffer, bBuffer);
  }
}
