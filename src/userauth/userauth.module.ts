import { Module } from '@nestjs/common';
import { UserauthService } from './userauth.service';
import { UserauthController } from './userauth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UserauthController],
  providers: [UserauthService],
})
export class UserauthModule {}
