import {Observable} from "rxjs";

export interface IFileAdapter {

    upload(
        fileBuffer: Buffer,
        fileName: string,
        targetDirName: string,
        filePrefix: string
    ): Observable<string>;

    url(
        fileName: string,
        targetDirName: string,
        filePrefix: string
    ): string

    take(
        fileName: string,
        targetDirName: string,
        filePrefix: string
    ): Observable<Buffer>;

    delete(
        fileName: string,
        targetDirName: string,
        filePrefix: string
    ): Observable<boolean>;
}
