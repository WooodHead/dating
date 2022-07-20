import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { Observable, of, switchMap, throwError, } from 'rxjs';
import { UsersRelationsService } from '../modules/users/users-relations/users-relations.service';
import { AuthHelpersService } from '../modules/helpers/auth-helpers.service';

@Injectable()
export class BlockUserGuard implements CanActivate {

    private logger: Logger = new Logger('BlockUserGuard');

    public constructor(
        protected relationsService: UsersRelationsService
    ) {}


    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const targetUserId = AuthHelpersService.getUserIdFromBodyContext(context, 'targetUserId');
        const authUser = AuthHelpersService.getUserDocFromContext(context);
        if(!authUser) throw new UnauthorizedException();
        if(!targetUserId) throw new HttpException('no target User', HttpStatus.BAD_REQUEST);
        return this.relationsService.isBlocked(authUser._id, targetUserId).pipe(
            switchMap(result => (result) ? throwError(() => new HttpException('Blocked User', HttpStatus.FORBIDDEN)) : of(!result) )
        );
    }

}
