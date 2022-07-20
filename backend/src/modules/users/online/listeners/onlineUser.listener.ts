import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnlineStatusEvent } from '../../events/online-status.event';
import { UserProfileService } from '../../user-profile/user-profile.service';
import { first } from 'rxjs/operators';
import { UsersService } from '../../users.service';
import { of, switchMapTo } from 'rxjs';

@Injectable()
export class OnlineUserListener {

    constructor(
        private readonly userProfileService: UserProfileService,
        private readonly usersService: UsersService
    ) {
    }

    @OnEvent('user.online')
    public changeToOnline(event: OnlineStatusEvent) {
        this.userProfileService.changeOnlineStatus(event.user._id, event.isOnline)
            .pipe(
                switchMapTo((event.socketId) ? this.usersService.updateUser({socketId: event.socketId}, {_id: event.user._id}) : of(null)),
                first()
            )
            .subscribe();
    }

}
