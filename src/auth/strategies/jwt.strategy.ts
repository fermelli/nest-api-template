import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';

@Injectable()
export class JwtStrategy {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
