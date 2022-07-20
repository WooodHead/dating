import { Injectable, Logger } from '@nestjs/common';
import { AcceptedGenderEnum, NotificationEventTypesEnum } from './notification.enum';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationsConfigs, NotificationsConfigsDocuments } from './schemas/notifications-configs.schema';
import { Model, Types } from 'mongoose';
import { concatMap, from, map, Observable, of } from 'rxjs';
import { Notification, NotificationsDocuments } from './schemas/notification.schema';
import { GenderEnum } from '../users/user-profile/enums/userProfile.enum';
import { EmailService } from '../email/email.service';

type ConfigEmailData = {
    genderType: AcceptedGenderEnum,
    email: string,
    global: boolean,
    message: boolean,
    sharedAlbum: boolean,
    user: Types.ObjectId
}

type aggregateEmailDate = {
    _id: Types.ObjectId,
    notifications: { _id: Types.ObjectId, type: NotificationEventTypesEnum }[],
    avatarPath: string,
    gender: GenderEnum,
    name: string
}

type sortingData = aggregateEmailDate & {
    types: { messages: Types.ObjectId[], sharedAlbums: Types.ObjectId[] },
}

@Injectable()
export class EmailTaskService {
    private readonly logger = new Logger(EmailTaskService.name);

    constructor(
        @InjectModel(NotificationsConfigs.name) private readonly notificationConfigModel: Model<NotificationsConfigsDocuments>,
        @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationsDocuments>,
        private readonly emailService: EmailService
    ) {}

    //@Cron(CronExpression.EVERY_30_SECONDS)
    public handleCron() {

        this.getConfigData().pipe(
            concatMap(configs => from(configs)),
            concatMap((notificationConfig: ConfigEmailData) => this.getNotifications(notificationConfig.user).pipe(map(data => {
                return {config: notificationConfig, users: data}
            }))),
            map(data => {
                const _users = data.users.map(
                    user => this.sortingAndFilterByType(user, data.config)
                )
                return {...data.config, users: _users}
            }),
            concatMap(data => this.sendEmail(data.users, data)),
            concatMap((data: { sortingData: sortingData[], config: ConfigEmailData }) => this.markAsEmailed(data.sortingData))
        ).subscribe({
                next: data => {
                    //console.log('data', data);
                },
                error: e => console.log('error', e),
                complete: () => console.log('complete')
            }
        )
    }

    public getConfigData(): Observable<ConfigEmailData[]> {
        const query = this.notificationConfigModel.aggregate<ConfigEmailData>([
            {
                $match: {
                    $or: [
                        {'configs.global.email': {$exists: true}},
                        {'configs.message.email': {$exists: true}},
                        {'configs.sharedAlbum.email': {$exists: true}}
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users', localField: 'user', foreignField: '_id', as: 'systemUser'
                }
            },
            {$unwind: {path: '$systemUser'}},
            {
                $addFields: {
                    global: '$configs.global.email',
                    message: '$configs.message.email',
                    sharedAlbum: '$configs.sharedAlbum.email',
                    email: '$systemUser.email'
                }
            },
            {
                $project: {
                    genderType: 1,
                    global: 1,
                    message: 1,
                    sharedAlbum: 1,
                    user: 1,
                    email: 1
                }
            },
        ])

        return from(query)
    }

    private getNotifications(userId: Types.ObjectId): Observable<aggregateEmailDate[]> {
        const query = this.notificationModel.aggregate<aggregateEmailDate>([
            {
                $match: {
                    $and: [
                        {toUser: userId},
                        {isEmailed: false}
                    ]
                },
            },
            {
                $group: {
                    _id: '$fromUser',
                    notifications: {
                        $push: {
                            _id: '$_id',
                            type: '$eventType'
                        }
                    },
                }
            },
            {
                $lookup: {
                    from: 'userprofiles', localField: '_id', foreignField: 'user', as: 'profile'
                }
            },
            {$unwind: {path: '$profile'}},
            {
                $addFields: {
                    name: '$profile.name',
                    avatarPath: '$profile.avatarPath',
                    gender: '$profile.gender',
                }
            },
            {
                $project: {
                    _id: 1,
                    notifications: 1,
                    avatarPath: 1,
                    name: 1,
                    gender: 1
                }
            },
        ]);
        return from(query);
    }

    private sortingAndFilterByType(data: aggregateEmailDate, config: ConfigEmailData): sortingData {
        if (config.genderType != AcceptedGenderEnum.all && String(config.genderType) != String(data.gender)) return {
            ...data,
            types: {
                messages: [],
                sharedAlbums: []
            }
        }
        return {
            ...data,
            types: {
                messages: data.notifications.reduce(
                    (res, notif) => {
                        if ((notif.type == NotificationEventTypesEnum.sendMessage)) res.push(notif._id);
                        return res;
                    }, []
                ),
                sharedAlbums: data.notifications.reduce(
                    (res, notif) => {
                        if ((notif.type == NotificationEventTypesEnum.shareAlbum)) res.push(notif._id);
                        return res;
                    }, []
                )
            }
        }
    }

    private sendEmail(data: sortingData[], config: ConfigEmailData): Observable<{ sortingData: sortingData[], config: ConfigEmailData }> {
        const text = data.map((user) => {
            const _text = 'Notification from ' + user.name
            return _text;
        }, [])
        // return this.emailService.sendEmail({
        //     from: 'support@loveisahead.com',
        //     to: [config.email],
        //     subject: 'Notifications',
        //     text: text.toString(),
        // })
        return of({sortingData: data, config})
    }

    private markAsEmailed(users: sortingData[]) {
        const _notifs = users.reduce((finish, user) =>
                finish.concat(user.notifications)
            , [])
        const _ids = _notifs.map(notif => notif._id)
        return from(this.notificationModel.updateMany({ _id: { $in: _ids } }, {isEmailed: true}).exec())
    }
}

