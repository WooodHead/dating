import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Reports, ReportsDocuments } from './schemas/report.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportService {

    public static readonly MAX_REPORTS_FOR_USER = 5;

    public constructor(
        @InjectModel(Reports.name) private readonly reportModel: Model<ReportsDocuments>
    ) {
    }

    public getReport(userId: Types.ObjectId): Observable<ReportsDocuments> {
        return from(this.reportModel.findOne({user: userId})).pipe(
            switchMap(report => (report) ? of(report) : from(this.reportModel.create({user: userId, reports: []})))
        )
    }

    public updateReport(userId: Types.ObjectId, dto: ReportDto): Observable<ReportsDocuments> {
        return this.getReport(dto.targetUserId).pipe(
            map(report => {
                report.reports.push({complainerId: userId, reason: dto.reason});
                return report;
            }),
            switchMap(report => from(report.save()))
        )
    }

    public countUniqReports(document: ReportsDocuments): Observable<number> {
        const arr = [];
        document.reports.forEach(report => {
            if (arr.find(item => String(item) == String(report.complainerId)) === undefined) arr.push(report.complainerId);
        })
        return of(arr.length);
    }
}
