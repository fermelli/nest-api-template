import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<User> {
    const { id } = jwtPayload;

    const user = await this.userRepository.findOne({
      where: { id: Equal(id) },
      withDeleted: true,
    });

    if (!user) {
      throw new UnauthorizedException('Access token is invalid');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('User not active');
    }

    return user;
  }
}
