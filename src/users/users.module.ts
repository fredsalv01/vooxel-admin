import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../auth/entities/user.entity';
import { UserDoesNotExistsConstrint } from './validation/user-does-not-exists.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserDoesNotExistsConstrint],
  controllers: [UsersController],
})
export class UsersModule {}
