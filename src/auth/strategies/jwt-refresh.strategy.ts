import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { Repository, Equal } from 'typeorm';
import { BasicJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  async validate(basicJwtPayload: BasicJwtPayload): Promise<User> {
    const { sub: userId } = basicJwtPayload;
    const user = await this.userRepository.findOne({
      where: { id: Equal(userId) },
      withDeleted: true,
    });

    if (!user) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('User not active');
    }

    return user;
  }
}
