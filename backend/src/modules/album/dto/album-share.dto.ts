import { IntersectionType } from '@nestjs/swagger';
import { TargetUseridDto } from '../../../dto/target-userid.dto';
import { AlbumIdsDto } from './album-ids.dto';

export class AlbumShareDto extends IntersectionType(
    TargetUseridDto,
    AlbumIdsDto
) {}
