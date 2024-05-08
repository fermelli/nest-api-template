import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenants.entity';
import { TenantsService } from './tenants.service';
import { ConfigModule } from '@nestjs/config';
import { TenantsController } from './tenants.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), ConfigModule],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
