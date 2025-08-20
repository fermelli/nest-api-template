import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class RefreshTokensService extends BaseService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {
    super();
  }

  async create(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    try {
      const refreshToken = this.refreshTokenRepository.create({
        userId,
        token,
        expiresAt,
      });

      await this.refreshTokenRepository.save(refreshToken);

      return refreshToken;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async isTokenValid(token: string, userId: number): Promise<boolean> {
    try {
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: { token: Equal(token), userId: Equal(userId) },
      });

      return refreshToken && refreshToken.expiresAt > new Date();
    } catch (error) {
      this.handleErrors(error);
    }
  }
}
