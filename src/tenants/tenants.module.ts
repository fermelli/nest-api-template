import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenants.entity';
import { TenantsProvider } from './tenants.provider';
import { TenantsMiddleware } from './tenants.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), ConfigModule],
  controllers: [],
  providers: [TenantsProvider],
  exports: [TenantsProvider],
})
export class TenantsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes('*');
  }
}
