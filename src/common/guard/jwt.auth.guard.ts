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

    const token = request.cookies.Authorization;

    if (token) {
      const tokenWithoutBearer = token.replace('Bearer ', '');
      try {
        const isValidToken = await this.jwtService.verifyAsync(
          tokenWithoutBearer,
          { secret: `${this.configService.get('jwt.secret')}` },
        );

        if (isValidToken) {
          request.user = isValidToken._doc || isValidToken.user;

          return true;
        }
      } catch (error) {
        return error;
      }
    }

    return false;
  }
}
