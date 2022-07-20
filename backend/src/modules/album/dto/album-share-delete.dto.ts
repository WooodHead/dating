import { IntersectionType } from '@nestjs/swagger';
import { TargetUseridDto } from '../../../dto/target-userid.dto';
import { AlbumIdDto } from './album-id.dto';

export class AlbumShareDeleteDto extends IntersectionType(
    TargetUseridDto,
    AlbumIdDto
) {}
