import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { AuthRepository } from './auth.repository';
import { RequestValidator } from '../middlewares/RequestValidator';
import { createUserSchema } from './auth.schema';
import { AuthMiddleware } from '@/middlewares/AuthMiddleware';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestValidator.with(createUserSchema))
      .forRoutes('auth/register');
    consumer.apply(AuthMiddleware.requiredAuth()).forRoutes('auth/me');
    consumer.apply(AuthMiddleware.requiredSuperAuth()).forRoutes('auth/users');
  }
}
