import { Module } from '@nestjs/common';
import { OnlineGateway } from './online.gateway';
import { AuthModule } from '../../auth/auth.module';
import { OnlineUserListener } from './listeners/onlineUser.listener';

@Module({
    imports: [AuthModule],
    providers: [OnlineGateway, OnlineUserListener],
    controllers: [],
    exports: []
})
export class OnlineModule {
}
