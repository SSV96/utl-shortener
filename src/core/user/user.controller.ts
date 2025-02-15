import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from 'src/core/user/utils/google.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from '../../common/interfaces/interface/authenticated.request.interface';

@Controller('user')
export class UserController {
  constructor(private readonly jwtService: JwtService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('authenticate')
  authenticate() {
    return 'AUTHENTICATED';
  }

  @Get('status')
  async status(@Req() req) {
    if (req.cookies.Authorization) {
      const token = req.cookies.Authorization.replace('Bearer ', '');
      const { _doc } = await this.jwtService.verifyAsync(token);

      return _doc;
    } else {
      return null;
    }
  }

  @Get('logout')
  logOut(@Req() req: AuthenticatedRequest, @Res() res) {
    res.clearCookie('Authorization', {
      httpOnly: true,
      secure: true,
    });
    res.redirect(`${process.env.FE_BASE_URL}`);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('authenticated/callback')
  async authenticated(@Req() req: AuthenticatedRequest, @Res() res) {
    const token = await this.jwtService.signAsync({ ...req.user });

    res.cookie('Authorization', `Bearer ${token}`, {
      httpOnly: true,
      secure: true, // Ensures cookies are sent only over HTTPS
      sameSite: 'none', // Allows cross-site cookies
    });

    res.setHeader('X-Auth-Token', `Bearer ${token}`);

    res.redirect(`${process.env.FE_BASE_URL}`);
  }
}
