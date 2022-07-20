import { IFileAdapter } from './IFile.adapter';
import { S3 } from 'aws-sdk';
import { map, Observable, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';


export default class S3Adapter implements IFileAdapter {

    public static readonly photoBucket = 'datingsitefiles';
    public readonly source = process.env.AWS_WORK_DIR || 'Default';
    private timelifeLink = 60 * 5;

    constructor(
        private readonly s3: S3,
    ) {}

    public take(
        fileName: string,
        targetDirName: string,
        filePrefix: string
    ): Observable<Buffer> {
        return of({
            Bucket: S3Adapter.photoBucket,
            Key: `${this.source}/${filePrefix}/${fileName}`,
        }).pipe(
            switchMap(params => this.s3.getObject(params).promise()),
            map(response => response.Body as Buffer),
        )
    };

    public url(fileName: string, targetDirName: string, filePrefix: string): string {
        return this.s3.getSignedUrl('getObject', {
            Bucket: S3Adapter.photoBucket,
            Key: `${this.source}/${filePrefix}/${fileName}`,
            Expires: this.timelifeLink
        })
    }

    public upload(fileBuffer: Buffer, fileName: string, targetDirName: string, filePrefix: string): Observable<string> {
        return of({
            Bucket: S3Adapter.photoBucket,
            Key: `${this.source}/${filePrefix}/${fileName}`,
            Body: fileBuffer
        }).pipe(
            switchMap(params => this.s3.upload(params).promise()),
            map(() => `/${targetDirName}/${filePrefix}/${fileName}`)
        );
    }

    delete(
        fileName: string,
        targetDirName: string,
        filePrefix: string
    ): Observable<boolean> {
        return of({
            Bucket: S3Adapter.photoBucket,
            Key: `${this.source}/${filePrefix}/${fileName}`,
        }).pipe(
            switchMap(params => this.s3.deleteObject(params).promise()),
            map(response => true),
            catchError(e => {
                console.log(e)
                return of(false)
            })
        );
    }
}
