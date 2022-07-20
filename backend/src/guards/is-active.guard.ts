import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Logger
} from "@nestjs/common";
import {Observable, of, switchMap, throwError,} from "rxjs";
import {UsersService} from "../modules/users/users.service";
import {ReportService} from "../modules/report/report.service";

@Injectable()
export class IsActiveGuard implements CanActivate {

    private logger: Logger = new Logger('IsActiveUser');

    public constructor() {}


    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const user = context.switchToHttp().getRequest().user;

        if(!user) throw new HttpException('user is required', HttpStatus.BAD_REQUEST);

        return (user.isActive);
    }

}
