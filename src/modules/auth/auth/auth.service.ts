import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/user/user.service';
import { UserGroupsService } from 'src/modules/userGroups/user-groups/user-groups.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userGroupService: UserGroupsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('No user from google');
    }

    const userGroup = await this.userGroupService.findOne(user.groupId);
    const payload = {
      email: user?.email,
      name: user.userName,
      sub: user._id,
      role: userGroup.groupNameAr,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '1d',
    });

    await this.userService.updateRefreshToken(
      user._id.toString(),
      refreshToken,
    );

    return {
      accessToken,
      user: {
        email: user?.email,
        name: user.userName,
      },
    };
  }

  async validateUser(emailOrPhone: string, password: string): Promise<any> {
    let user;
    const isEmail = emailOrPhone.includes('@');
  
    try {
      if (isEmail) {
        user = await this.userService.findByEmail(emailOrPhone);
        if (!user) {
          throw new NotFoundException('User with this email not found');
        }
      } else {
        user = await this.userService.findByPhone(emailOrPhone);
        if (!user) {
          throw new NotFoundException('User with this phone number not found');
        }
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
  
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred during authentication');
    }
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await this.verifyRefreshToken(
      refreshToken,
      user.refreshToken,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }

  async login(user: LoginDto) {
    const storedUser = await this.validateUser((user?.email ? user.email : user.phone), user.password);
    const userGroup = await this.userGroupService.findOne(storedUser.groupId);
    const payload = {
      email: storedUser?.email,
      name: storedUser.userName,
      sub: storedUser._id,
      role: userGroup.groupNameAr,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '1d',
    });

    await this.userService.updateRefreshToken(
      storedUser._id.toString(),
      refreshToken,
    );

    return {
      accessToken,
    };
  }

  async refreshTokens(accToken: string) {
    try {
      const decoded = this.jwtService.decode(accToken) as {
        sub: string;
        email: string;
      };
      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      const userId = decoded.sub;

      const user = await this.userService.findById(userId);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const userGroup = await this.userGroupService.findOne(user.groupId);
      this.jwtService.verify(user.refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const payload = {
        email: user.email,
        sub: user._id,
        role: userGroup.groupNameAr,
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      });

      return {
        accessToken,
      };
    } catch {
      throw new UnauthorizedException('Access Denied');
    }
  }

  async logout(userId: string) {
    return this.userService.updateRefreshToken(userId, null);
  }

  private async verifyRefreshToken(
    refreshToken: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(refreshToken, hashedRefreshToken);
  }
}
