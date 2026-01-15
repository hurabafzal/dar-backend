import {
  Controller,
  Post,
  UseGuards,
  Body,
  Headers,
  UnauthorizedException,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.docrator';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

  //   @Public()
  //   @Post('signup')
  //   @ApiOperation({ summary: 'User signup' })
  //   @ApiResponse({ status: 201, description: 'User created successfully' })
  //   async signUp(@Body() signUpDto: SignUpDto) {
  //     return this.authService.signUp(signUpDto);
  //   }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google authentication' })
  async googleAuth(@Req() req) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google authentication callback' })
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    res.redirect(
      `${this.configService.get('FRONTEND_URL')}/auth/callback?token=${
        result.accessToken
      }`,
    );
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  async refreshTokens(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token is missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    return this.authService.refreshTokens(token);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }
}

