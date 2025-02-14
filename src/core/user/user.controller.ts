import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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
    });
    res.redirect('http://localhost:5173/');
  }
  @UseGuards(GoogleAuthGuard)
  @Get('authenticated/callback')
  async authenticated(@Req() req: AuthenticatedRequest, @Res() res) {
    const token = await this.jwtService.signAsync({ ...req.user });

    // Set token as an HTTP-only cookie
    res.cookie('Authorization', `Bearer ${token}`);

    // Perform the redirection
    res.redirect('http://localhost:5173/form');
  }
}
