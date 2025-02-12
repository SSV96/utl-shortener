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

  @UseGuards(GoogleAuthGuard)
  @Get('authenticated/callback')
  async authenticated(@Req() req: AuthenticatedRequest, @Res() res) {
    const token = await this.jwtService.signAsync({ ...req.user });

    // Set token as an HTTP-only cookie
    res.cookie('Authorization', `Bearer ${token}`, {
      httpOnly: true, // Prevents JavaScript access for security
      sameSite: 'lax',
    });

    // Perform the redirection
    res.redirect('http://localhost:3000/shorten/test/create');
  }
}
