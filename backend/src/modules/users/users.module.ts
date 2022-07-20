import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/users.schema';
import { AdditionDataModule } from '../addition-data/addition-data.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UsersRelationsModule } from './users-relations/users-relations.module';
import { OnlineModule } from './online/online.module';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      AuthModule,
      AdditionDataModule,
      UserProfileModule,
      UsersRelationsModule,
      OnlineModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, UserProfileModule, UsersRelationsModule]
})
export class UsersModule {}
