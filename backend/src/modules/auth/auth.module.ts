import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenModule } from './token/token.module';
import { ReportModule } from '../report/report.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Registration, RegistrationSchema } from './registration.schema';
import { AdditionDataModule } from '../addition-data/addition-data.module';

@Module({
    providers: [AuthService, LocalStrategy, JwtStrategy],
    imports: [
        MongooseModule.forFeature([
            {name: Registration.name, schema: RegistrationSchema}
        ]),
        PassportModule, TokenModule, ReportModule, AdditionDataModule
    ],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
}
