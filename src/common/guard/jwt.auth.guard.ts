import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let token =
      request.cookies?.Authorization ||
      request.headers?.authorization ||
      request.headers?.['x-auth-token'];
    console.log({ token });
    if (token) {
      token = token.replace('Bearer ', '');

      try {
        const isValidToken = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('jwt.secret'),
        });

        if (isValidToken) {
          // Attach user information to the request

          request.user = isValidToken._doc || isValidToken.user;

          return true;
        }
      } catch (error) {
        console.error('JWT Verification Error:', error);
        return false;
      }
    }

    return false;
  }
}
