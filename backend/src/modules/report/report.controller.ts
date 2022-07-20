import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ReportDto } from './dto/report.dto';
import { User } from '../users/decorators/user.decorator';
import { UsersDocuments } from '../users/schemas/users.schema';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { combineLatest, mapTo, of, switchMap, switchMapTo } from 'rxjs';
import { TokenService } from '../auth/token/token.service';
import { ReasonsReportEnum } from './enums/tokenTypes.enum';
import { UsersRelationsService } from '../users/users-relations/users-relations.service';
import { RelationsEnum } from '../users/users-relations/enums/relations.enum';
import { DeactivateReasonsEnum } from '../users/enums/user.enum';
import { UsersService } from '../users/users.service';
import { AlbumShareService } from '../album/album-share/album-share.service';

@ApiTags('Report')
@Controller('report')
@UseGuards(JwtAuthGuard)
export class ReportController {

    public constructor(
        private readonly reportService: ReportService,
        private readonly tokenService: TokenService,
        private readonly relationService: UsersRelationsService,
        private readonly usersService: UsersService,
        private readonly shareService: AlbumShareService,
    ) {}

    @HttpCode(200)
    @ApiBearerAuth('JWT')
    @ApiBody({type: ReportDto})
    @Post()
    public report(@User() user: UsersDocuments, @Body()  {reason, targetUserId}: ReportDto) {
        return this.reportService.updateReport(user._id, {reason, targetUserId}).pipe(
            switchMap(report => this.reportService.countUniqReports(report)),
            switchMap(count => this.relationService.changeRelation(user._id, targetUserId, RelationsEnum.block).pipe(mapTo(count))),
            switchMap(count => (count == ReportService.MAX_REPORTS_FOR_USER)
                ? combineLatest([
                    this.usersService.deactivate(targetUserId, DeactivateReasonsEnum.reportBlock),
                    this.tokenService.deleteAllUserTokens(targetUserId)
                ])
                : of(count)),
            switchMapTo(this.shareService.deleteSharePermissions({userId: user._id, targetUserId})),
            switchMapTo(this.shareService.deleteSharePermissions({userId: targetUserId, targetUserId: user._id})),
            mapTo({message: `User has been reported`})
        )
    }

    @ApiBearerAuth('JWT')
    @Get('list-of-reasons')
    public listOfReasons() {
        return ReasonsReportEnum;
    }
}
