import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reports, ReportsSchema } from './schemas/report.schema';
import { AlbumShareModule } from '../album/album-share/album-share.module';

@Module({
    imports: [
        AlbumShareModule,
        MongooseModule.forFeature([{name: Reports.name, schema: ReportsSchema}])
    ],
    controllers: [ReportController],
    providers: [ReportService],
    exports: [ReportService]
})
export class ReportModule {}
