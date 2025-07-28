import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret',
    });
  }

  // This method is called after the token is verified.
  // The return value is attached to the request object as `req.user`.
  validate(payload: any) {
    if (!payload) {
      console.error('JWT validation failed: Missing payload');
      throw new UnauthorizedException('Invalid token');
    }
    console.log(`Authenticated user: ${payload.username}, role: ${payload.role}`);
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
