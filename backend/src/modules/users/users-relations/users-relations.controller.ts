import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { UsersDocuments } from '../schemas/users.schema';
import { UsersRelationsService } from './users-relations.service';
import { map } from 'rxjs';
import { ChangeRelationToUserDto } from './dto/change-relation-to-user.dto';

@Controller('users-relations')
@ApiTags('Users-relations')
@UseGuards(JwtAuthGuard)
export class UsersRelationsController {

    public constructor(private readonly relationService: UsersRelationsService) {}

    @HttpCode(200)
    @ApiBearerAuth('JWT')
    @ApiBody({type: ChangeRelationToUserDto})
    @Post('change-relation')
    public changeRelation(@User() user: UsersDocuments, @Body() dto: ChangeRelationToUserDto) {
        return this.relationService.changeRelation(user._id, dto.targetUserId, dto.relation).pipe(map(() => {
            return {message: `User's relation has been changed`};
        }));
    }
}
